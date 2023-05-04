import pino from "pino"

const log = pino({
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: true,
            ignore: "pid,hostname"
        }
    }
    
})


export default log