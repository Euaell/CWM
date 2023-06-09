import { Router } from "express"
import BillController from "../controllers/BillController"

import Authenticate from "../middlewares/Authenticate";

const router = Router()

router.post("/create", Authenticate.authenticate, BillController.create)

router.get("/", Authenticate.authenticate, BillController.getAll)
router.get("/get-chart-data", Authenticate.authenticate, BillController.getBillChartData)
router.get("/get-chart-yearly-data", Authenticate.authenticate, BillController.getBillChardDataByYear)
router.get("/get-yearly-usage-data", Authenticate.authenticate, BillController.getUsageDataByYear)

router.get("/:id", Authenticate.authenticate, BillController.read)

router.put("/:id", Authenticate.authenticate, BillController.update)
router.delete("/:id", Authenticate.authenticate, BillController.delete)

export default router
