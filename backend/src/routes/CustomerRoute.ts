import { Router } from "express"
import CustomerController from "../controllers/CustomerController"

const router = Router()

router.post("/create", CustomerController.createCustomer)
router.get("/", CustomerController.getCustomers)
router.get("/:id", CustomerController.getCustomer)
router.put("/:id", CustomerController.updateCustomer)
router.delete("/:id", CustomerController.deleteCustomer)

export default router
