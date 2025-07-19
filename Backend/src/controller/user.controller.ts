import asyncHandler from "../utils/asynchandler.ts";
import ApiError from "../utils/apierror.ts";
import { User } from "../models/userschema.ts";
import ApiResponse from "../utils/apiresponse.ts";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FollowRequest } from "../models/userfollowrequest.ts";
// import { Follower } from "../models/Follower.ts";
import { Document } from "mongoose";
import { Message } from "../models/message";
import Resume from "../models/resumeschema.ts";

interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  selectedField?: string;
  refreshToken?: string;
  getAccessToken: () => string;
  getreftoken: () => string;
}

const generateTokens = async (user: IUserDocument) => {
  const accessToken = user.getAccessToken();
  const refreshToken = user.getreftoken();
  
  // Save the refresh token in the database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already registered");
  }

  // Create new user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  // Get user without sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  const { accessToken, refreshToken } = await generateTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          userId: user._id,
        },
        "User logged in successfully"
      )
    );
});

const updateUserField = asyncHandler(async (req, res) => {
  const { userId, selectedField } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    
    user.selectedField = selectedField;
    await user.save();
    
    return res.status(200).json(
      new ApiResponse({ user }, "Field updated successfully")
    );
  } catch (error) {
    console.error("Error updating field:", error);
    throw new ApiError(500, "Failed to update user field");
  }
});

const getUsersByField = asyncHandler(async (req, res) => {
  const { selectedField } = req.query;
  
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const userId = req.user._id;

  if (!selectedField) {
    throw new ApiError(400, "Selected field is required");
  }

  // Find users in the same field but exclude the logged-in user
  const users = await User.find({
    selectedField: { $regex: new RegExp(String(selectedField), "i") },
    _id: { $ne: userId }, // Exclude logged-in user
  })
  .select("username email selectedField")
  .limit(50); // Add pagination to limit results
  
  return res.status(200).json(new ApiResponse(users, "Users retrieved successfully"));
});

const followRequestAccept = asyncHandler(async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    throw new ApiError(400, "User ID and status are required");
  }
  
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  // Find and update the follow request
  const followRequest = await FollowRequest.findOneAndUpdate(
    { to: req.user._id, from: userId, status: "pending" },
    { status: status },
    { new: true }
  );
  
  if (!followRequest) {
    throw new ApiError(404, "Follow request not found");
  }

  /* Follower relationship would be created here if notification system was active */

  return res.status(200).json(
    new ApiResponse(followRequest, "Follow request updated successfully")
  );
});

const sendFollowRequest = asyncHandler(async (req, res) => {
  const { userIdToFollow } = req.body;
  
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const currentUserId = req.user._id;

  // Validate required data
  if (!userIdToFollow) {
    throw new ApiError(400, "User ID to follow is required");
  }
  
  // Verify both users exist
  const [targetUser, currentUser] = await Promise.all([
    User.findById(userIdToFollow),
    User.findById(currentUserId)
  ]);
  
  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if already following
  const existingRequest = await FollowRequest.findOne({ 
    from: currentUserId, 
    to: userIdToFollow 
  });
  
  if (existingRequest) {
    return res.status(400).json(
      new ApiResponse(null, "Follow request already exists")
    );
  }

  // Create follow request
  const newRequest = await FollowRequest.create({
    from: currentUserId,
    to: userIdToFollow,
    status: "pending",
  });

  return res.status(200).json(
    new ApiResponse(newRequest, "Follow request sent successfully")
  );
});

const logout = asyncHandler(async (req, res) => {
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );
  
  const options = {
    httpOnly: true,
    secure: true,
  };
  
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(null, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken;
  
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECREAT as string
    ) as JwtPayload;
    
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    
    const options = {
      httpOnly: true,
      secure: true,
    };
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      ));
  } catch (err) {
    // Log error for debugging if needed
    console.error("Refresh token verification failed:", err);
    throw new ApiError(401, "Invalid refresh token");
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const currentUserId = req.user._id;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  // Delete the follow relationship
  const result = await FollowRequest.findOneAndDelete({
    from: currentUserId,
    to: userId,
    status: "accepted"
  });
  
  if (!result) {
    throw new ApiError(404, "Follow relationship not found");
  }

  return res.status(200).json(
    new ApiResponse(null, "User unfollowed successfully")
  );
});

const getFollowStatus = asyncHandler(async (req, res) => {
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const { userId } = req.params;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  const currentUserId = req.user._id;
  
  try {
    // Find a follow request between the users (in either direction)
    const followRequest = await FollowRequest.findOne({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    });
    
    let status = 'not_following';
    let direction = null;
    
    if (followRequest) {
      status = followRequest.status;
      direction = String(followRequest.from) === String(currentUserId) ? 'outgoing' : 'incoming';
    }
    
    return res.status(200).json(
      new ApiResponse(
        { status, direction },
        "Follow status retrieved successfully"
      )
    );
  } catch {
    throw new ApiError(500, "Failed to retrieve follow status");
  }
});

const getPendingFollowRequests = asyncHandler(async (req, res) => {
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const userId = req.user._id;
  
  try {
    // Find pending follow requests where the current user is the recipient
    const pendingRequests = await FollowRequest.find({
      to: userId,
      status: "pending"
    })
    .populate("from", "username email selectedField") // Get sender details
    .sort({ createdAt: -1 }); // Sort by latest first
    
    return res.status(200).json(
      new ApiResponse(
        pendingRequests,
        "Pending follow requests retrieved successfully"
      )
    );
  } catch {
    throw new ApiError(500, "Failed to retrieve follow requests");
  }
});

const getConnections = asyncHandler(async (req, res) => {
  // Verify authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  
  const userId = req.user._id;
  
  try {
    // Find all accepted follow relationships where the current user is involved
    const acceptedConnections = await FollowRequest.find({
      $or: [
        { from: userId, status: "accepted" },
        { to: userId, status: "accepted" }
      ]
    })
    .populate("from", "username email selectedField")
    .populate("to", "username email selectedField")
    .sort({ updatedAt: -1 });
    
    // Map to get the other user's details (not the current user)
    const connections = acceptedConnections.map((connection) => {
      const isFromCurrentUser = String(connection.from._id) === String(userId);
      const otherUser = isFromCurrentUser ? connection.to : connection.from;
      
      return {
        userId: (otherUser as any)._id,
        username: (otherUser as any).username,
        email: (otherUser as any).email,
        selectedField: (otherUser as any).selectedField
      };
    });
    
    return res.status(200).json(
      new ApiResponse(
        connections,
        "Connections retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw new ApiError(500, "Failed to retrieve connections");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const userId = req.user._id;

  // Fetch user basic info
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  // Fetch latest resume
  const resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });

  // Fetch connections (accepted follow requests)
  const acceptedConnections = await FollowRequest.find({
    $or: [
      { from: userId, status: "accepted" },
      { to: userId, status: "accepted" }
    ]
  })
    .populate("from", "username email selectedField")
    .populate("to", "username email selectedField")
    .sort({ updatedAt: -1 });

  const connections = acceptedConnections.map((connection) => {
    const isFromCurrentUser = String(connection.from._id) === String(userId);
    const otherUser = isFromCurrentUser ? connection.to : connection.from;
    const otherUserData = otherUser as any;
    return {
      userId: otherUserData._id,
      username: otherUserData.username,
      email: otherUserData.email,
      selectedField: otherUserData.selectedField
    };
  });

  return res.status(200).json(
    new ApiResponse({
      user,
      resume,
      connections
    }, "User profile fetched successfully")
  );
});

// Save message (called from socket)
export const saveMessage = async ({ senderId, recipientId, message }: any) => {
  const msg = await Message.create({ senderId, recipientId, message });
  return msg;
};

// Get messages (paginated)
export const getMessages = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  const  userId = req.user._id; // Authenticated user
  const { otherUserId, skip = 0, limit = 20 } = req.query;

  if (!otherUserId) throw new ApiError(400, "otherUserId required");

  // Find messages between the two users and populate sender information
  const messages = await Message.find({
    $or: [
      { senderId: userId, recipientId: otherUserId },
      { senderId: otherUserId, recipientId: userId },
    ],
  })
    .populate("senderId", "username") // Populate sender username
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: 1 }); // Sort by creation time ascending

  // Transform messages to include senderName
  const transformedMessages = messages.map(msg => {
    const sender = msg.senderId as any; // Type assertion for populated field
    return {
      _id: msg._id,
      senderId: sender._id || sender,
      recipientId: msg.recipientId,
      message: msg.message,
      timestamp: msg.createdAt,
      senderName: sender.username || 'Unknown'
    };
  });

  res.json(new ApiResponse(transformedMessages, "Messages fetched"));
});

export {
  registerUser,
  loginUser,
  updateUserField,
  getUsersByField,
  followRequestAccept,
  unfollowUser,
  logout,
  refreshAccessToken,
  sendFollowRequest,
  getFollowStatus,
  getPendingFollowRequests,
  getConnections,
  getUserProfile,
}; 