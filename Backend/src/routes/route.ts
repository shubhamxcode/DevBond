import { Router } from "express";
import { regiesteruser, loginUser, updateUserField } from "../controller/user.controlller";

const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
routes.route("/update-field").post(updateUserField);


export default routes;