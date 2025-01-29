import { Router } from "express";
import { regiesteruser, loginUser, updateUserField,getLoggedInUser } from "../controller/user.controlller";

const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
routes.route("/update-field").post(updateUserField);
routes.route("/getLoggedInUser").post(getLoggedInUser);

export default routes;