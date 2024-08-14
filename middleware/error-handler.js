const { StatusCodes } = require("http-status-codes")
const { CustomAPIError, BadRequestError } = require("../errors")

module.exports = (err, req, res, next) => {
 let customError = {
  code: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || "Something Went Wrong"
 }
 if (err.code == 11000) { //keyvalue:{email:'fdas}
  customError.code = StatusCodes.BAD_REQUEST
  customError.msg = `Dublicate entered value for ${Object.keys(err.keyValue)} field please choose another value `
 }
 if (err.name == "CastError") {
  customError.msg = `no item found with id ${err.value}`;
  customError.code = StatusCodes.NOT_FOUND
 }
 res.status(customError.code).json({ msg: customError.msg })
}