const { sign } = require("jsonwebtoken")
module.exports = ({ name, userId }) => {
 const token = sign({ name, userId }, process.env.JWT_SECRET, { expiresIn: '20s' })
 return token
}