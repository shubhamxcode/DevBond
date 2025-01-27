import { Router } from "express";
import { regiesteruser, loginUser,selectfield} from "../controller/user.controlller";

const routes = Router();

routes.route("/register").post(regiesteruser);
routes.route("/login").post(loginUser);
routes.route("/devfield").post(selectfield)

export default routes;