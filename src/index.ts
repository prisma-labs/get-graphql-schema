#!/usr/bin/env node

import fetch from 'node-fetch'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import * as minimist from 'minimist'
import * as chalk from 'chalk'

const {version} = require('../package.json')

const usage = `  Usage: get-graphql-schema ENDPOINT_URL > schema.graphql

  ${chalk.bold('Fetch and print the GraphQL schema from a GraphQL HTTP endpoint')}
  (Outputs schema in IDL syntax by default)

  Options:
    --json, -j      Output in JSON format (based on introspection query)
    --version, -v   Print version of get-graphql-schema
`

async function main() {
  const argv = minimist(process.argv.slice(2))

  if (argv._.length < 1) {
    console.log(usage)
    return
  }

  if (argv['version'] || argv['v']) {
    console.log(version)
    process.exit(0)
  }

  const endpoint = argv._[0]

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: introspectionQuery }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    throw new Error(JSON.stringify(errors, null, 2))
  }

  if (argv['j'] || argv['json']) {
    console.log(JSON.stringify(data, null, 2))
  } else {
    const schema = buildClientSchema(data)
    console.log(printSchema(schema))
  }

}

main().catch(e => console.error(e))
