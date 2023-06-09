import { Router } from "express"
import CustomerController from "../controllers/CustomerController"
import Authenticate from "../middlewares/Authenticate";

const router = Router()

router.post("/create", Authenticate.authenticate, CustomerController.createCustomer)

router.get("/", Authenticate.authenticate, CustomerController.getCustomers)
router.get("/customer-average", Authenticate.authenticate, CustomerController.getAverageYearlyRevenue)
router.get("/:id", Authenticate.authenticate, CustomerController.getCustomer)

router.put("/:id", Authenticate.authenticate, CustomerController.updateCustomer)
router.delete("/:id", Authenticate.authenticate, CustomerController.deleteCustomer)

export default router
