import express, { Express } from "express"
import { logError, logRequest } from "../middlewares/event"
import routes from "../routes"

function startServer() {
    const app: Express = express()

    app.use(logRequest)

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    routes(app)

    app.use(logError)

    return app
}

export default startServer