
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors")
const User = require("../model/User")
const bcrypt = require("bcryptjs")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
 // const { name, email, password } = req.body
 // if (!name || !email || !password) throw new BadRequestError('email, name, password must be provided');


 const user = await User.create({ ...req.body })
 const token = user.createJWT()
 return res.status(StatusCodes.CREATED).json({ msg: 'user created', user, token })

}
const login = async (req, res) => {
 const { email, password } = req.body
 if (!email || !password) {
  throw new BadRequestError('please provide email and password')
 }
 const user = await User.findOne({ email })
 if (!user) throw new NotFoundError(`invalid credentials`);
 const isPasswordMatch = await user.isPasswordMatch(password)
 // check
 if (!isPasswordMatch) throw new BadRequestError('password doesnt match');

 // you can create token
 const token = user.createJWT()
 res.status(StatusCodes.OK).json({ msg: "logged success", user, token })
}

const showCurrentUser = async (req, res) => {
 const authHeader = req.headers.authorization

 if (!authHeader || !authHeader.startsWith("Bearer ")) throw new BadRequestError("token is not provided");

 try {
  const token = authHeader.split("Bearer ")[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  // get current user from db
  const user = await User.findById(payload._id).select("-password")
  if (!user) throw new NotFoundError('user not found');
  res.status(StatusCodes.OK).json({ logged: true, user })
 } catch (err) {
  throw new UnauthenticatedError("unauthorize to access this route")
 }
}

module.exports = { register, login, showCurrentUser }