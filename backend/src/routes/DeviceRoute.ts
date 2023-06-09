import { Router } from "express"
import DeviceController from "../controllers/DeviceController"
import Authenticate from "../middlewares/Authenticate"

const router: Router = Router()

router.post("/", Authenticate.authenticate, Authenticate.authorize, DeviceController.create)
router.get("/", Authenticate.authenticate, DeviceController.getAll)
router.get("/get-cities", Authenticate.authenticate, DeviceController.getCities)
router.get("/get-available-devices", Authenticate.authenticate, DeviceController.getAvailableDevices)

router.put("/add-children", Authenticate.authenticate, Authenticate.authorize, DeviceController.addChildren)
router.put("/remove-children", Authenticate.authenticate, Authenticate.authorize, DeviceController.removeChildren)
router.put("/:id", Authenticate.authenticate, Authenticate.authorize, DeviceController.update)

router.delete("/:id", Authenticate.authenticate, Authenticate.authorize, DeviceController.delete)

router.post("/read/:id", DeviceController.read)

export default router
