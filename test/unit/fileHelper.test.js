import { describe, it, expect, jest } from '@jest/globals'
import fs, { stat } from 'fs'
import FileHelper from './../../src/fileHelper.js'

describe('#FileHelper test suite', () => {
    it( 'should return files statuses in correct format', async () => {
        const statMock = { 
            dev: 2,
            mode: 33188,
            nlink: 1,
            uid: 1000,
            gid: 1000,
            rdev: 0,
            blksize: 512,
            ino: 2251799816039185,
            size: 28802,
            blocks: 64,
            atimeMs: 1689424998215.805,
            mtimeMs: 1689424841010.996,
            ctimeMs: 1689424841010.996,
            birthtimeMs: 1689424841010.996,
            atime: '2023-07-15T12:43:18.216Z',
            mtime: '2023-07-15T12:40:41.011Z',
            ctime: '2023-07-15T12:40:41.011Z',
            birthtime: '2023-07-15T12:40:41.011Z'
        }
        const mockUser = 'giordani'
        process.env.USER = mockUser
        const filename = 'file.png'

        jest.spyOn(fs.promises, fs.promises.stat.name)
            .mockResolvedValue(statMock)
        jest.spyOn(fs.promises, fs.promises.readdir.name)
            .mockResolvedValue([filename])
        
        const result = await FileHelper.getFilesStatus("/tmp")

        const expectedResult = [
            {

                size: "28.8 kB",
                lastModified: statMock.birthtime,
                owner: mockUser,
                file: filename
            }
        ]

        expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
        expect(result).toMatchObject(expectedResult)
    })
})