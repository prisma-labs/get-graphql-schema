#!/usr/bin/env node

import fetch from 'node-fetch'
import { graphql } from 'graphql'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'
import { buildSchema } from 'graphql/utilities/buildASTSchema'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import * as minimist from 'minimist'
import * as chalk from 'chalk'
import * as fs from 'fs'
import * as url from 'url'

const { version } = require('../package.json')

const usage = `  Usage: get-graphql-schema ENDPOINT_URL > schema.graphql

  ${chalk.bold(
    'Fetch and print the GraphQL schema from a GraphQL HTTP endpoint',
  )}
  (Outputs schema in IDL syntax by default)

  If ENDPOINT_URL has file: protocol, it should point to a local schema in .json or .graphql (IDL) syntax.

  Options:
    --header, -h    Add a custom header (ex. 'X-API-KEY=ABC123'), can be used multiple times
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

  const { data, errors } = await fetchSchema(argv)

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

async function fetchSchema(argv) {
  const endpoint = argv._[0]

  const endpointUrl = url.parse(endpoint)
  if(endpointUrl.protocol == "file:") {
    // Reading the schema from a file allows for conversion between .json and
    // .graphql formats without needing to fetch the schema via HTTP first
    const schemaPath = endpointUrl.path as string
    if(fs.existsSync(schemaPath)) {
      const contents = fs.readFileSync(schemaPath, 'utf8')
      if(schemaPath.endsWith(".json")) {
        return {data: JSON.parse(contents)}
      } else if(schemaPath.endsWith(".graphql")) {
        const schema = buildSchema(contents)
        var introspectionResult = await graphql(schema, introspectionQuery)
        return introspectionResult
      }
      return {errors: "file: protocol only supports reading .json or .graphql (IDL) schemas"}
    } else {
      return {errors: schemaPath + " does not exist"}
    }
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const headers = toArray(argv['header'])
    .concat(toArray(argv['h']))
    .reduce((obj, header: string) => {
      const [key, value] = header.split('=')
      obj[key] = value
      return obj
    }, defaultHeaders)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query: introspectionQuery }),
  })
  return response.json()
}

function toArray(value = []) {
  return Array.isArray(value) ? value : [value]
}

main().catch(e => console.error(e))
