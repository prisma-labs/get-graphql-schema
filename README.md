# get-graphql-schema [![npm version](https://badge.fury.io/js/get-graphql-schema.svg)](https://badge.fury.io/js/get-graphql-schema)

Fetch and print the GraphQL schema from a GraphQL HTTP endpoint. (Can be used for Relay Modern.)


> **Note**: Consider using [`graphql-cli`](https://github.com/graphcool/graphql-cli) instead for improved workflows.

## Install

```sh
npm install -g get-graphql-schema
```

## Usage

```sh
  Usage: get-graphql-schema  "your GraphQL server http url" --output "your path/schema.graphql" -h "a=b(your http header of auth)"

  Fetch and print the GraphQL schema from a GraphQL HTTP endpoint
  (Outputs schema in IDL syntax by default)

  Options:
    --header, -h    Add a custom header (ex. 'X-API-KEY=ABC123'), can be used multiple times
    --json, -j      Output in JSON format (based on introspection query)
    --version, -v   Print version of get-graphql-schema
    --output        Save schema to file.
```

## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
