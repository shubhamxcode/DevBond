import { Router } from "express";
import { regiesteruser, loginUser, getAllUsers, updateUserField, getUsersByField } from '../controller/user.controlller'


const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
routes.route("/update-field").post(updateUserField);
routes.route("/").get(getAllUsers);
routes.route("/users-by-field").get(getUsersByField);



export default routes;