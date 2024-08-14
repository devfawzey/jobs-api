const mongoose = require("mongoose")

module.exports = async (URL = process.env.MONGO_URL) => {
 await mongoose.connect(URL).then(() => console.log('db connected √√√')).catch((err) => { console.log({ msg: "'db doesn't connect", reason: err }) })
}