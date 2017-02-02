#!/usr/bin/env node

import fetch from 'node-fetch'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: get-graphql-schema ENDPOINT_URL > schema.json')
    return
  }

  const endpoint = process.argv[2]

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

  console.log(JSON.stringify(data, null, 2))
}

main().catch(e => console.error(e))
