const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { sign } = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, 'please provide username'],
  minLength: [5, 'username must be more than 5 characters'],
  maxLength: [30, 'username must be less than 30 characters']
 },
 password: {
  type: String,
  required: [true, 'password must be provided'],
  minLength: [5, 'password must be more than 5 characters'],
  // maxLength: [50, 'password must be less than 50 characters']
 },
 email: {
  type: String,
  required: [true, 'email must be provided'],
  match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'invalid email'],
  unique: true
 },
 role: {
  type: String,
  enum: {
   values: ["user", "admin"],
   default: "user"
  }
 }
})
UserSchema.pre("save", async function (next) {
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
 next()
})

UserSchema.methods.getName = function () {
 return this.name
}
UserSchema.methods.isPasswordMatch = async function (credentialPassword) {
 return await bcrypt.compare(credentialPassword, this.password)
}

UserSchema.methods.createJWT = function () {
 return sign({ name: this.name, _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

module.exports = mongoose.model("User", UserSchema)