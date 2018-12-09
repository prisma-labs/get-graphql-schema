import { main } from '../bin'

import * as index from '../'

describe('bin', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('warns on missing endpoint', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)
    const getHeadersFromInputMock = jest.spyOn(index, 'getHeadersFromInput')
    const getRemoteSchemaMock = jest.spyOn(index, 'getRemoteSchema')
    const printToFileMock = jest.spyOn(index, 'printToFile')

    /**
     * Execution
     */

    await main({ input: [] } as any)

    /**
     * Tests
     */

    expect(consoleWarnMock).toBeCalledWith('No endpoint provided')
    expect(consoleWarnMock).toBeCalledTimes(1)
    expect(consoleLogMock).toBeCalledTimes(0)
    expect(getHeadersFromInputMock).toBeCalledTimes(0)
    expect(getRemoteSchemaMock).toBeCalledTimes(0)
    expect(printToFileMock).toBeCalledTimes(0)
  })

  test('warns on fetch error', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)
    const getHeadersFromInputMock = jest.spyOn(index, 'getHeadersFromInput')
    const getRemoteSchemaMock = jest
      .spyOn(index, 'getRemoteSchema')
      .mockResolvedValue({ status: 'err', message: 'pass' })
    const printToFileMock = jest.spyOn(index, 'printToFile')

    /**
     * Execution
     */

    await main({
      input: ['pass'],
      flags: { method: 'POST', json: false },
    } as any)

    /**
     * Tests
     */
    expect(consoleWarnMock).toBeCalledWith('pass')
    expect(consoleWarnMock).toBeCalledTimes(1)
    expect(consoleLogMock).toBeCalledTimes(0)
    expect(getHeadersFromInputMock).toBeCalledTimes(1)
    expect(getRemoteSchemaMock).toBeCalledTimes(1)
    expect(printToFileMock).toBeCalledTimes(0)
  })

  test('logs obtained schema when no output', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)
    const getHeadersFromInputMock = jest.spyOn(index, 'getHeadersFromInput')
    const getRemoteSchemaMock = jest
      .spyOn(index, 'getRemoteSchema')
      .mockResolvedValue({ status: 'ok', schema: 'pass' })
    const printToFileMock = jest.spyOn(index, 'printToFile')

    /**
     * Execution
     */

    await main({
      input: ['pass'],
      flags: { method: 'POST', json: false },
    } as any)

    /**
     * Tests
     */
    expect(consoleLogMock).toBeCalledWith('pass')
    expect(consoleWarnMock).toBeCalledTimes(0)
    expect(consoleLogMock).toBeCalledTimes(1)
    expect(getHeadersFromInputMock).toBeCalledTimes(1)
    expect(getRemoteSchemaMock).toBeCalledTimes(1)
    expect(printToFileMock).toBeCalledTimes(0)
  })

  test('prints obtained schema when output is defined', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)
    const getHeadersFromInputMock = jest.spyOn(index, 'getHeadersFromInput')
    const getRemoteSchemaMock = jest
      .spyOn(index, 'getRemoteSchema')
      .mockResolvedValue({ status: 'ok', schema: 'pass' })
    const printToFileMock = jest
      .spyOn(index, 'printToFile')
      .mockImplementation(() => false)

    /**
     * Execution
     */

    await main({
      input: ['pass'],
      flags: { method: 'POST', json: false, output: 'path' },
    } as any)

    /**
     * Tests
     */
    expect(consoleWarnMock).toBeCalledTimes(0)
    expect(consoleLogMock).toBeCalledTimes(0)
    expect(getHeadersFromInputMock).toBeCalledTimes(1)
    expect(getRemoteSchemaMock).toBeCalledTimes(1)
    expect(printToFileMock).toBeCalledTimes(1)
  })

  test('correctly reduces headers', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)
    const getHeadersFromInputMock = jest.spyOn(index, 'getHeadersFromInput')
    const getRemoteSchemaMock = jest
      .spyOn(index, 'getRemoteSchema')
      .mockResolvedValue({ status: 'ok', schema: 'pass' })
    const printToFileMock = jest
      .spyOn(index, 'printToFile')
      .mockImplementation(() => false)

    /**
     * Execution
     */

    await main({
      input: ['pass'],
      flags: {
        method: 'POST',
        json: false,
        output: 'path',
        header: ['key=value'],
      },
    } as any)

    /**
     * Tests
     */
    expect(consoleWarnMock).toBeCalledTimes(0)
    expect(consoleLogMock).toBeCalledTimes(0)
    expect(getHeadersFromInputMock).toBeCalledTimes(1)
    expect(getRemoteSchemaMock).toBeCalledTimes(1)
    expect(getRemoteSchemaMock).toBeCalledWith('pass', {
      method: 'POST',
      json: false,
      headers: {
        'Content-Type': 'application/json',
        key: 'value',
      },
    })
    expect(printToFileMock).toBeCalledTimes(1)
  })
})
