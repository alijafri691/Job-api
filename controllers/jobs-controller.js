const HttpError = require("../models/httpError");

const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const Job = require("../models/Job");

exports.getAllJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await Job.find({ createdBy: req.userData.userId }).sort("createdAt");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not find a job",
      500
    );
    return next(error);
  }

  res.json({ jobs: jobs, "Number of Jobs": jobs.length });
};

exports.getJob = async (req, res, next) => {
  const jobId = req.params.id;

  let job;

  try {
    job = await Job.findById(jobId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not find a job",
      500
    );
    return next(error);
  }

  if (!job) {
    const error = new HttpError("Could not find job for the provided id", 404);
    return next(error);
  }

  res.status(200).json({ job });
};

exports.createJobs = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError(error.array()[0].msg, 422));
  }
  const { company, position } = req.body;

  const job = new Job({
    company,
    position,
    createdBy: req.userData.userId,
  });

  try {
    await job.save();
  } catch (err) {
    const error = new HttpError(err.message);
    return next(error);
  }

  res.status(201).json({ job: job });
};

exports.updateJobs = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError(error.array()[0].msg, 422));
  }
  const jobId = req.params.id;

  const { company, position } = req.body;

  // Check if the provided jobId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const error = new HttpError("No job found for the given Id", 404);
    return next(error);
  }

  const newJobData = { company, position };
  let updatedJob;
  try {
    updatedJob = await Job.findByIdAndUpdate(jobId, newJobData, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update a job",
      500
    );

    return next(error);
  }

  if (!updatedJob) {
    const error = new HttpError("No job found for the given Id", 404);

    return next(error);
  }

  res.status(200).json({ updatedJob });
};

exports.deleteJobs = async (req, res, next) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const error = new HttpError("No job found for the given Id", 404);
    return next(error);
  }

  let deleteJob;
  try {
    deleteJob = await Job.findByIdAndDelete(jobId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not delete a job",
      500
    );

    return next(error);
  }
  if (!deleteJob) {
    const error = new HttpError("No job found for the given Id", 404);

    return next(error);
  }

  res.json({ message: "delete Job" });
};
