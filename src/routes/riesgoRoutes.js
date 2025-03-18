const express = require("express");
const riesgoController = require("../controllers/riesgoController");

const router = express.Router();

router.get("/", riesgoController.getRiesgos);
router.post("/", riesgoController.createRiesgo);

module.exports = router;
