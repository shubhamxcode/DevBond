import { Router } from "express";
import { regiesteruser, loginUser, updateUserField, getUsersByField,followUser,logout,refreshacesstoken} from '../controller/user.controlller'
import verfiyjwt from "../middleware/authenticationToken";

const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
routes.route("/update-field").post(updateUserField);
routes.route("/users-by-field").get(verfiyjwt, getUsersByField);
routes.route("/userfollower").post(followUser)
routes.route("/logout").post(logout)
routes.route("/refreshToken").post(refreshacesstoken)
export default routes;