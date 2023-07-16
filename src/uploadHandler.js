import Busboy from "busboy";
import fs from 'fs'
import {pipeline} from 'stream/promises'
import { logger } from "./logger.js";
export default class UploadHandler {
    constructor({io, socketId, downloadsFolder, messageTimeDelay = 200}){
        this.io = io
        this.socketId = socketId
        this.downloadsFolder = downloadsFolder
        this.ON_UPLOAD_EVENT = 'file-upload'
        this.messageTimeDelay = messageTimeDelay
    }
    canExecute(lastExecution){
       return (Date.now() - lastExecution) >= this.messageTimeDelay
    }

    handleFileBytes(filename){
        this.lastMessageSent = Date.now()

        async function* handleData(source){
            let processedAlready = 0

            for await (const chunk of source){
                yield chunk

                processedAlready += chunk.length
                if(!this.canExecute(this.lastMessageSent)){
                    continue;
                }

                this.lastMessageSent = Date.now()

                this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, {processedAlready, filename})
                logger.info(`File [${this.fileName}] got ${processedAlready} bytes to ${this.socketId}`)
            }
        }
        return handleData.bind(this)

    }

    async onFile(fieldName, file, fileName ){
        const saveTo = `${this.downloadsFolder}/${fileName}`
        await pipeline(
            file,
            
            this.handleFileBytes.apply(this, [fileName]),  // same as this.handleFileBytes(fileName)
            fs.createWriteStream(saveTo)
            
        )

        logger.info(`File [${fileName}] finished`)

    }

    registerEvents(headers, onFinish) {
        const busboyInstance = new Busboy({ headers })
        busboyInstance.on('file', this.onFile.bind(this))
        busboyInstance.on('finish', onFinish)
        return busboyInstance
    }
}