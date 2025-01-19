import { Router } from "express";
import registeruser from '../controller/user.controlller'
const routes=Router()

routes.route("/register").post(registeruser )
export default routes