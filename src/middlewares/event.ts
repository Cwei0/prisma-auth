import { format } from "date-fns";
import EventEmitter from "events";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path"

interface Date {
    timestamps: string
}

interface IRequest {
    url: string,
    method: string,
    headers: {
        origin: string | undefined
    }
}
interface IErrors {
    name: string,
    stack: string,
    message: string,
}

const dateTime: Date['timestamps'] = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`

class Logger extends EventEmitter {
    private requestLogStream: fs.WriteStream
    private errorLogStream: fs.WriteStream

    constructor() {
        super()

        
        const logDir = path.join(__dirname, '..', 'logs')
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir)
        }
        
        const requestLogFilePath = path.join(logDir, 'request.log')
        this.requestLogStream = fs.createWriteStream(requestLogFilePath, { flags: 'a' })
        
        const errorLogFilePath = path.join(logDir, 'error.log')
        this.errorLogStream = fs.createWriteStream(errorLogFilePath, { flags: 'a' })
        
    }
    logRequest(req: IRequest) {
        this.emit('request.log', req)
        this.requestLogStream.write(`${dateTime}\t${req.url}\t${req.method}\t${req.headers.origin}\n`)
    }

    logError(err: IErrors) {
        this.emit('error.log', err)
        this.errorLogStream.write(`${dateTime}\t${err.name}:${err.message}\n ${err.stack}`)
    }
    
}

const logger = new Logger()

async function logRequest(req:Request, res: Response, next: NextFunction) {
    const requestLog: IRequest = {
        url:req.url,
        method: req.method,
        headers:{
            origin: req.headers.origin 
        }
    }
    await logger.logRequest(requestLog)

    next ()
}

async function logError(err: any, req:Request, res: Response, next: NextFunction) {
    const errorLog: IErrors = {
        name: err.name,
        message: err.message,
        stack: err.stack
    }
    await logger.logError(errorLog)

    next()
}

export {logError, logRequest}