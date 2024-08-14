const { getAllJobs, createJob, getJob, deleteJob, updateJob } = require("../controller/job")
const router = require("express").Router()

// createJob,deleteJob,getAlljobs,updateJob,getJob
router.route("/").get(getAllJobs).post(createJob)
router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router