import { Router } from "express";
import { regiesteruser, loginUser, getAllUsers} from "../controller/user.controlller";


const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
// routes.route("/update-field").post(updateUserField);
routes.route("/").get(getAllUsers);



export default routes;