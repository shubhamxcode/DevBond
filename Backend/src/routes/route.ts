import express from 'express';
// import verifyFirebaseToken from '../authtoken/auth'; // Ensure this is correctly imported

import verifyFirebaseToken from '../authtoken/auth';
import { User } from '../models/userschema'; // Import the correct User model

const router = express.Router();

router.get('/protected', verifyFirebaseToken, async (req, res) => {
  const { uid, email, name } = req.user; // Decoded token data from Firebase

  // Create or update user in MongoDB
  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    user = new User({
      firebaseUid: uid,
      email: email,
      name: name || '', // Use displayName if available
    });
    await user.save();
  }

  res.status(200).json({
    message: 'User authenticated and data stored successfully',
    user,
  });
});

export default router;