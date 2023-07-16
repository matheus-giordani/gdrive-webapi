import {
    describe,
    test,
    expect,
    beforeAll,
    afterAll,
    jest
} from '@jest/globals'
import fs from 'fs'

import FormData from 'form-data'
import { tmpdir } from 'os'
import { join } from 'path'
import { logger } from '../../src/logger.js'
import TestUtil from '../util/testUtil.js'
import Routes from './../../src/routes.js'

describe('#Routes Integration test suite', () => {
   
    let defaultDownloadsFolder = ''
    beforeAll(async () => {
        defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
    })
    
    beforeEach(() => {
        jest.spyOn(logger, 'info')
            .mockImplementation()
    })

    afterAll(async () => {
        await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
    })

    describe('#getFileStatus', () => {
        const ioObj = {
            to: (id) => ioObj,
            emit: (event, message) => { }
        }

        it('should upload file to the folder', async () => {
            const filename = 'tste.pdf'
            const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
            const response = TestUtil.generateWritableStream(() => { })

            const form = new FormData()
            form.append('photo', fileStream)

            const defaultParams = {
                request: Object.assign(form, {
                    headers: form.getHeaders(),
                    method: 'POST',
                    url: '?socketId=10'
                }),
                response: Object.assign(response, {
                    setHeader: jest.fn(),
                    writeHead: jest.fn(),
                    end: jest.fn()
                }),
                values: () => Object.values(defaultParams)
            }

            const routes = new Routes(defaultDownloadsFolder)
            routes.setSocketInstance(ioObj)

            const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirBeforeRun).toEqual([])

            await routes.handler(...defaultParams.values())

            const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirAfterRun).toEqual([filename])

            expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200)
            const expectedResult = JSON.stringify({ result: 'Files uploaded with success!'})
            expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult)



        })
    })

    
})