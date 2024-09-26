import getStatusController from "../controllers/healthcheckController.js";
import express from "express";

const router = express.Router();

// TODO add protectRoute
router.get("/", getStatusController);
router.all("/", getStatusController)

export default router;