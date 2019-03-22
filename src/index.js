'use strict'

const batch2 = require('batch2')
const pumpify = require('pumpify')
const stream = require('stream')

class ElasticSearch {
  constructor ({ client } = {}) {
    this._client = client
  }
  bulkWriteStream (options = {}) {
    const self = this
    const size = options.size || 100

    const bulkStream = batch2({ size })

    let writeStream = new stream.Writable({ objectMode: true, highWaterMark: 1 })
    writeStream._write = function (chunk, encoding, callback) {
      const body = chunk.reduce((prev, curr) => {
        if (['index', 'update', 'delete'].indexOf(curr.action) < 0) { return prev }
        if (!curr.index || !curr.type || !curr.id || !curr.doc) { return prev }
        if (curr.action === 'index') { prev.push({ index: { _index: curr.index, _type: curr.type, _id: curr.id } }, curr.doc) }
        if (curr.action === 'update') { prev.push({ update: { _index: curr.index, _type: curr.type, _id: curr.id } }, { doc: curr.doc }) }
        if (curr.action === 'delete') { prev.push({ delete: { _index: curr.index, _type: curr.type, _id: curr.id } }) }
        return prev
      }, [])
      self._client.bulk({ body }, callback)
    }

    return pumpify(bulkStream, writeStream)
  }
}

module.exports = ElasticSearch
