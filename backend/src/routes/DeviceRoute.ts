import { Router } from "express"
import DeviceController from "../controllers/DeviceController"
import Authenticate from "../middlewares/Authenticate"

const router: Router = Router()

router.post("/", Authenticate.authenticate, Authenticate.authorize, DeviceController.create)
router.get("/", Authenticate.authenticate, DeviceController.getAll)

router.put("/:id", Authenticate.authenticate, Authenticate.authorize, DeviceController.update)
router.delete("/:id", Authenticate.authenticate, Authenticate.authorize, DeviceController.delete)

router.post("/read/:id", DeviceController.read)

router.post("/add-children", Authenticate.authenticate, Authenticate.authorize, DeviceController.addChildren)

export default router
