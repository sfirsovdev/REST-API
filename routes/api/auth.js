const express = require('express');

const validationData = require("../../middlewares/contactValidation");

const ctrlWrapper = require("../../helpers/ctrlWrapper");

const { schemas } = require("../../models/user")

const ctrl = require("../../controllers/auth")

const router = express.Router();

//signup
router.post("/register", validationData(schemas.registerSchema), ctrlWrapper(ctrl.register))

module.exports = router;