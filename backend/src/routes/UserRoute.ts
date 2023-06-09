import { Router } from "express"
import UserController from "../controllers/UserController";
import Authenticate from "../middlewares/Authenticate";

const router: Router = Router()

router.post("/login", UserController.login)
router.get("/logout", Authenticate.authenticate, UserController.logout)
router.post("/verifyuser", Authenticate.authenticate, UserController.verifyUser)
router.post("/", UserController.createUser)
router.post("/changePassword", Authenticate.authenticate, Authenticate.authorize, UserController.changePassword)

router.get("/", UserController.getUsers)
router.get("/get-cities-usage", Authenticate.authenticate, UserController.getCitiesAndUsages)
router.get("/:id", UserController.getUser)
router.put("/:id", Authenticate.authenticate, Authenticate.authorize, UserController.updateUser)
router.delete("/:id", Authenticate.authenticate, Authenticate.authorize, UserController.deleteUser)

router.put("/makeadmin/:id", Authenticate.authenticate, Authenticate.authorize, UserController.makeAdmin)
router.put("/removeadmin/:id", Authenticate.authenticate, Authenticate.authorize, UserController.removeAdmin)

export default router
