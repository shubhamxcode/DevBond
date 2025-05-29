import { Router } from "express";
import { regiesteruser, loginUser, updateUserField, getUsersByField,logout,refreshacesstoken,followreq } from '../controller/user.controlller'
import verfiyjwt from "../middleware/authenticationToken";

const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser)
routes.route("/update-field").post(updateUserField);
routes.route("/users-by-field").get(verfiyjwt, getUsersByField);
routes.route("/followreq").post(followreq)
routes.route("/logout").post(logout)
routes.route("/refreshToken").post(refreshacesstoken)
// routes.route("/userunfollow").post(unfollowUser)
// routes.route("/followreq/accept").post(followreqaccept)
// routes.route("/notifications").get(getNotifications)
export default routes;