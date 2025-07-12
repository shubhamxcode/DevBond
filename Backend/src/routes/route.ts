import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  updateUserField, 
  getUsersByField,
  followRequestAccept,
  logout,
  refreshAccessToken, 
  unfollowUser,
  sendFollowRequest,
  getFollowStatus,
  getPendingFollowRequests,
  getConnections,
  getMessages
} from '../controller/user.controller'
import { parseResume, saveResumeData } from '../controller/resume.controller';
import { upload } from '../middleware/multer.middleware';
import verifyJwt from "../middleware/authenticationToken";

const routes = Router();

routes.route("/register").post(registerUser);
routes.route("/login").post(loginUser);
routes.route("/update-field").post(updateUserField);
routes.route("/users-by-field").get(verifyJwt, getUsersByField);
routes.route("/followreq").post(verifyJwt, sendFollowRequest);
routes.route("/logout").post(verifyJwt, logout);
routes.route("/refreshToken").post(refreshAccessToken);
routes.route("/userunfollow").post(verifyJwt, unfollowUser);
routes.route("/followreq/accept").post(verifyJwt, followRequestAccept);
routes.route("/follow-status/:userId").get(verifyJwt, getFollowStatus);
routes.route("/followreq/pending").get(verifyJwt, getPendingFollowRequests);
routes.route("/connections").get(verifyJwt, getConnections);
routes.route("/messages").get(verifyJwt,getMessages);
routes.route("/parse-resume").post(verifyJwt, upload.single('resume'), parseResume);
routes.route("/save-resume").post(verifyJwt, saveResumeData);
// routes.route("/notifications").get(getNotifications)
export default routes;