const getStatusController =require("../controllers/healthcheckController.js") ;
const express =require("express");

const router = express.Router();

// TODO add protectRoute
router.get("/", getStatusController);
router.all("/", getStatusController)

module.exports= router;