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
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
// const Yaml = require("yaml")
const yamlJS = require("yamljs")
// const swaggerDocument = yamlJS.load("./swagger.yaml")
// const swaggerDocument = require("./swagger.json")
const options = {
 definition: {
  openapi: "3.0.0",
  info: {
   title: "Library API",
   version: "1.0.0",
   description: "A simple Express Library API",
   termsOfService: "http://example.com/terms/",
   contact: {
    name: "API Support",
    url: "http://www.exmaple.com/support",
    email: "support@example.com",
   },
  },
  servers: [
   {
    url: "https://jobs-api-topaz.vercel.app/",
    description: "My API Documentation",
   },
  ],
 },
 // This is to call all the file
 apis: ["routes/*.js"],
};

const specs = swaggerJsDoc(options);
const CSS_URL =
 "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

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
app.get("/", (req, res) => res.send("<h1>Jobs Api</h1> <a href='/api-docs'>API-Documents</a>"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { customCssUrl: CSS_URL }))
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
module.exports = app