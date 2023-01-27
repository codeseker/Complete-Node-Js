const express = require("express");
const router = express.Router();
const {getAllJob, getJob, addJob, editJob, deleteJob} = require("../Controllers/jobs");

router.route("/").post(addJob).get(getAllJob);
router.route("/:id").get(getJob).patch(editJob).delete(deleteJob);

module.exports = router;