import { Router } from "express"
import BillController from "../controllers/BillController"

const router = Router()

router.post("/create", BillController.create)
router.get("/", BillController.getAll)
router.get("/:id", BillController.read)
router.put("/:id", BillController.update)
router.delete("/:id", BillController.delete)

export default router
