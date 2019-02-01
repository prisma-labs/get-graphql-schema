import { getHeadersFromInput, printToFile, getRemoteSchema } from '..'

import * as fetch from 'jest-fetch-mock'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'

jest.setMock('node-fetch', fetch)

describe('core function works as expected', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  /**
   * getHeadersFromInput
   */
  test('getHeadersFromInput gets correct headers', async () => {
    const noheader = getHeadersFromInput({
      flags: {
        header: undefined,
      },
    } as any)

    const singleHeader = getHeadersFromInput({
      flags: {
        header: 'key=pass',
      },
    } as any)

    const multipleHeaders = getHeadersFromInput({
      flags: {
        header: ['key=pass', 'key=pass'],
      },
    } as any)

    const complexHeader = getHeadersFromInput({
      flags: {
        header: 'token=123fadshfkj=$',
      },
    } as any)

    const multipleComplexHeaders = getHeadersFromInput({
      flags: {
        header: ['token=123fadshfkj=$', 'token=123fadshfkj=$'],
      },
    } as any)

    expect(noheader).toEqual([])
    expect(singleHeader).toEqual([{ key: 'key', value: 'pass' }])
    expect(multipleHeaders).toEqual([
      { key: 'key', value: 'pass' },
      { key: 'key', value: 'pass' },
    ])
    expect(complexHeader).toEqual([{ key: 'token', value: '123fadshfkj=$' }])
    expect(multipleComplexHeaders).toEqual([
      { key: 'token', value: '123fadshfkj=$' },
      { key: 'token', value: '123fadshfkj=$' },
    ])
  })

  /**
   * getRemoteSchema
   */

  // TODO

  /**
   * printToFile
   */

  test("printToFile creates directory if it's missing", async () => {
    /**
     * Mocks
     */
    const fsExistsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    const mkdirpSyncMock = jest
      .spyOn(mkdirp, 'sync')
      .mockImplementation(() => {})
    const fsWriteFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})

    /**
     * Execution
     */

    const res = printToFile('/pass', 'schema')

    /**
     * Tests
     */

    expect(fsExistsSyncMock).toBeCalledWith('/pass')
    expect(mkdirpSyncMock).toBeCalledWith('/pass')
    expect(fsWriteFileSyncMock).toBeCalledWith('/pass', 'schema')
    expect(res).toEqual({ status: 'ok', path: '/pass' })
  })

  test("printToFile doesn't create directory if it already exists", async () => {
    /**
     * Mocks
     */
    const fsExistsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    const mkdirpSyncMock = jest
      .spyOn(mkdirp, 'sync')
      .mockImplementation(() => {})
    const fsWriteFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})

    /**
     * Execution
     */

    const res = printToFile('/pass', 'schema')

    /**
     * Tests
     */

    expect(fsExistsSyncMock).toBeCalledWith('/pass')
    expect(mkdirpSyncMock).toBeCalledTimes(0)
    expect(fsWriteFileSyncMock).toBeCalledWith('/pass', 'schema')
    expect(res).toEqual({ status: 'ok', path: '/pass' })
  })

  test('printToFile returns error message on error', async () => {
    /**
     * Mocks
     */
    const fsExistsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    const mkdirpSyncMock = jest.spyOn(mkdirp, 'sync')
    const fsWriteFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {
        throw new Error('pass')
      })

    /**
     * Execution
     */

    const res = printToFile('/pass', 'schema')

    /**
     * Tests
     */

    expect(fsExistsSyncMock).toBeCalledWith('/pass')
    expect(mkdirpSyncMock).toBeCalledTimes(0)
    expect(fsWriteFileSyncMock).toBeCalledTimes(1)
    expect(res).toEqual({ status: 'err', message: 'pass' })
  })
})
