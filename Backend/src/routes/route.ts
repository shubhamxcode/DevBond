import { Router } from "express";
import { regiesteruser } from "../controller/user.controlller";
import { loginUser } from "../controller/user.controlller";
const routes=Router()

routes.route("/register").post(regiesteruser )
routes.route("/login").post(loginUser)
export default routes