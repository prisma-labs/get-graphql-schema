#!/usr/bin/env node

import meow = require('meow')
import { getHeadersFromInput, getRemoteSchema, printToFile } from '.'

const cli = meow(
  `
Usage: 
  $ get-graphql-schema ENDPOINT_URL > schema.graphql

Fetch and print the GraphQL schema from a GraphQL HTTP endpoint (Outputs schema in IDL syntax by default).

Options:
  --header, -h    Add a custom header (ex. 'X-API-KEY=ABC123'), can be used multiple times
  --json, -j      Output in JSON format (based on introspection query)
  --method        Use method (GET,POST, PUT, DELETE)
  --output       Save schema to file.
`,
  {
    flags: {
      header: {
        type: 'string',
        alias: 'h',
      },
      json: {
        type: 'boolean',
        alias: 'j',
        default: false,
      },
      method: {
        type: 'string',
        default: 'POST',
      },
      output: {
        type: 'string',
      },
    },
  },
)

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') main(cli)

/**
 * Main
 */
export async function main(cli: meow.Result): Promise<void> {
  /* Get remote endpoint from args */
  const [endpoint] = cli.input

  if (!endpoint) {
    console.warn('No endpoint provided')
    return
  }

  /* Headers */
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const headers = getHeadersFromInput(cli).reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    defaultHeaders,
  )

  /* Fetch schema */
  const schema = await getRemoteSchema(endpoint, {
    method: cli.flags.method,
    headers,
    json: cli.flags.json,
  })

  if (schema.status === 'err') {
    console.warn(schema.message)
    return
  }

  if (cli.flags.output !== undefined) {
    printToFile(cli.flags.output, schema.schema)
  } else {
    console.log(schema.schema)
  }
}
