const express = require("express");

const { check } = require("express-validator");

const jobController = require("../controllers/jobs-controller");

const router = express.Router();

router.get("/", jobController.getAllJobs);

router.get("/:id", jobController.getJob);

router.post(
  "/",
  [
    check("company").notEmpty().withMessage("Company name is required"),
    check("position").notEmpty().withMessage("Position is required"),
  ],
  jobController.createJobs
);

router.delete("/:id", jobController.deleteJobs);

router.patch(
  "/:id",
  [
    check("company").notEmpty().withMessage("Company name is required"),
    check("position").notEmpty().withMessage("Position is required"),
  ],
  jobController.updateJobs
);

module.exports = router;
