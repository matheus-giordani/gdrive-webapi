import { logger } from "./logger.js";
import fileHelper from "./fileHelper.js";
import { dirname, resolve } from 'path';
import { fileURLToPath, parse    } from 'url';
import UploadHandler from "./uploadHandler.js";
import { pipeline } from "stream/promises";
const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads');

export default class Routes {
    constructor(downloadFolder = defaultDownloadsFolder) {
        this.downloadFolder = downloadFolder;
        this.io = {};
        this.fileHelper = fileHelper;
    }

    setSocketInstance(io) {
        this.io = io;
    }

    async defaultRoute(req, res) {

        res.end('Hello World!');
    }
    async options(req, res) {
        res.writeHead(204, { 'Content-Type': 'text/html' });
        res.end('Hello World!');
    }
    async post(req, res) {
        const { headers } = req;

        const { query: { socketId } } = parse(req.url, true);
        const uploadHandler = new UploadHandler({
                socketId, 
                io: this.io, 
                downloadsFolder: this.downloadFolder
            });

        const onFinish = (response) => () => {
            response.writeHead(200);
            const data = JSON.stringify({ result: 'Files uploaded with success!' });
            response.end(data);
        };

        const busboyInstance = uploadHandler.registerEvents(headers, onFinish(res));
        await pipeline(
            req,
            busboyInstance
        )
        logger.info('Request finished with success!');

    }

    async get(req, res) {
        const files = await this.fileHelper.getFilesStatus(this.downloadFolder);
        res.writeHead(200);
        res.end(JSON.stringify(files));
    }

    async handler(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const chosen = this[req.method.toLowerCase()] || this.defaultRoute
        return chosen.apply(this, [req, res]); // same as chosen(req, res);
    }
}