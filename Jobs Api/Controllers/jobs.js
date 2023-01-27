const Jobs = require("../Models/job");
const { StatusCodes } = require("http-status-codes");

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Jobs.findOne({
        _id: jobId,
        createdBy: userId
    });

    if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({ Msg: "job not found" });
    }
    res.status(StatusCodes.OK).json({ job });
}
const getAllJob = async (req, res) => {
    const job = await Jobs.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ job, count: job.length });
}
const addJob = async (req, res) => {
    // add the job for the current user only
    req.body.createdBy = req.user.userId;
    const job = await Jobs.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}
const editJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, body: { company, position } } = req;

    const job = await Jobs.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({ job });
}
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Jobs.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    });


    res.send(job);
}

module.exports = {
    getJob,
    editJob,
    addJob,
    deleteJob,
    getAllJob
}