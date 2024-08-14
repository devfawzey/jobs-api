// configs
require('dotenv').config();
require('express-async-errors');

const express = require("express")
const app = express()
const connectDB = require("./db/connect")
const jobRoute = require("./routes/job")
const authRoute = require("./routes/auth")
const authenticatedUser = require("./middleware/auth")

// security
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")


// 

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// security
app.set("trust proxy", 1)
app.use(cors())
app.use(helmet())
app.use(xss())
app.use(rateLimiter({
 windowMs: 1000 * 60 * 15, //15min
 max: 100, //100 ip request per 15min
}))

// 
const { errorHandlerMiddleware, notFoundMiddleware } = require("./middleware")

// routes
app.use("/api/v1/jobs/", authenticatedUser, jobRoute)
app.use("/api/v1/auth", authRoute)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)




const start = async () => {
 try {
  await connectDB()
  app.listen(process.env.PORT, () => console.log(`app start on http://localhost:${process.env.PORT}`))
 } catch (err) {
  console.log({ err })
 }
}

start()