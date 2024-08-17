const { StatusCodes } = require("http-status-codes")
const Job = require("../model/Job")
const { BadRequestError, NotFoundError } = require("../errors")

const getAllJobs = async (req, res) => {
 // const { name, userId } = req.user

 const jobs = await Job.find({ createdBy: req.user._id })
 res.status(StatusCodes.OK).json({ name: req.user.name, nbHits: jobs.length, jobs })

}
const createJob = async (req, res) => {
 req.body.createdBy = req.user._id
 console.log(req.user._id)
 const job = await Job.create(req.body)
 res.status(StatusCodes.CREATED).json({ created: true, job })
}
const getJob = async (req, res) => {
 const { id: jobID } = req.params
 const job = await Job.findOne({ createdBy: req.user._id, _id: jobID })
 if (!job) { throw new NotFoundError(`no job found with id ${jobID}`) }
 res.status(StatusCodes.OK).json({ job })
}
const updateJob = async (req, res) => {
 const { id: jobID } = req.params
 const { company, position } = req.body
 if (company === '' || position === '') throw new BadRequestError('company and position cannot be empty')
 const job = await Job.findOneAndUpdate({ _id: jobID, createdBy: req.user._id }, req.body, { new: true, runValidators: true })
 res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
 const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
 if (!job) {
  throw new NotFoundError(`no job found with id ${req.params.id}`)
 }
 res.status(StatusCodes.OK).json({ deleted: true })
}

module.exports = {
 getAllJobs,
 createJob,
 deleteJob,
 updateJob,
 getJob
}