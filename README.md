# elasticsearch-batch-stream

[![Travis](https://img.shields.io/travis/com/ovhemert/elasticsearch-batch-stream.svg?branch=master&logo=travis)](https://travis-ci.com/ovhemert/elasticsearch-batch-stream)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2b7f2dae5ec947d8a46362314bd90e53)](https://www.codacy.com/app/ovhemert/elasticsearch-batch-stream?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ovhemert/elasticsearch-batch-stream&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/npm/elasticsearch-batch-stream/badge.svg)](https://snyk.io/test/npm/elasticsearch-batch-stream)
[![Coverage Status](https://coveralls.io/repos/github/ovhemert/elasticsearch-batch-stream/badge.svg?branch=master)](https://coveralls.io/github/ovhemert/elasticsearch-batch-stream?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/ovhemert/elasticsearch-batch-stream.svg)](https://greenkeeper.io/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

A write stream that creates batches of elasticsearch bulk operations.

## Example

The ElasticSearch library has a function to [bulk](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-bulk) write documents, but since a stream emits a write for each document, we cannot group multiple operations together.

This package wraps the `bulk` function in a writestream to help buffer the operations and passing them on as batches to the bulk function. For example, we can now create batches of 500 docs each and reduce the number of API calls to ElasticSearch from 100.000 to 200, which will improve speed.

```js
  const docTransformStream = through2.obj(function (chunk, enc, callback) {
    // convert chunk => doc
    const doc = { index: 'myindex', type: 'mytype', id: '12345', action: 'index', doc: { name: 'test' } }
    callback(null, doc)
  })

  sourceReadStream().pipe(docTransformStream()).pipe(bulkWriteStream({ client, size: 500 }))
```

## Installation

```bash
$ npm install elasticsearch-batch-stream
```

## API

<b><code>bulkWriteStream(options = { client, size })</code></b>

Creates the write stream to ElasticSearch.

### options

The options object argument is required and should at least include the ElasticSearch client object.

#### client

An instance of the ElasticSearch client i.e. `new elasticsearch.Client()`

#### size

Number of stream operations to group together in the bulk command (default = 100).

## Maintainers

Osmond van Hemert
[![Github](https://img.shields.io/badge/-website.svg?style=social&logoColor=333&logo=github)](https://github.com/ovhemert)
[![Web](https://img.shields.io/badge/-website.svg?style=social&logoColor=333&logo=nextdoor)](https://ovhemert.dev)

## Contributing

If you would like to help out with some code, check the [details](./docs/CONTRIBUTING.md).

Not a coder, but still want to support? Have a look at the options available to [donate](https://ovhemert.dev/donate).

## License

Licensed under [MIT](./LICENSE).
