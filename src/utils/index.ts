import express, { Express } from "express"
import { logError, logRequest } from "../middlewares/event"
import routes from "../routes"
import deserializerUser from "../middlewares/deserializeUser"
import cookieParser from "cookie-parser"

function startServer() {
    const app: Express = express()

    app.use(logRequest)

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(cookieParser())

    app.use(deserializerUser)

    routes(app)

    app.use(logError)

    return app
}

export default startServer