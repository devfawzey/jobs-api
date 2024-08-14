const { verify } = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")
const User = require("../model/User")
module.exports = async (req, res, next) => {
 const authHeader = req.headers.authorization
 if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('unauthorize to access this router')
 const token = authHeader.split("Bearer ")[1]

 try {
  const payload = verify(token, process.env.JWT_SECRET)
  const user = await User.findById(payload._id).select("-password")
  req.user = user
  next()
 }
 catch (err) {
  throw new UnauthenticatedError('unauthenticated to access,invalid token')
 }


}