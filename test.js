var IdbKeyStore = require('.')
var test = require('tape')

test('create/get/set pre-ready', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()
  store.set('abc', 'def', function (err) {
    t.equal(err, null)
    store.get('abc', function (err, result) {
      t.equal(err, null)
      t.equal(result, 'def')
      t.end()
    })
  })
})

test('create/get/set post-ready', function (t) {
  t.timeoutAfter(3000)
  var store = createStore({ onready: onready })

  function onready () {
    store.set('abc', 'def', function (err) {
      t.equal(err, null)
      store.get('abc', function (err, result) {
        t.equal(err, null)
        t.equal(result, 'def')
        t.end()
      })
    })
  }
})

test('set/get object', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()

  var val = {somekey: 'someval'}

  store.set('abc', val, function (err) {
    t.equal(err, null)
    store.get('abc', function (err, result) {
      t.equal(err, null)
      t.deepEqual(result, val)
      t.end()
    })
  })
})

test('get empty', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()
  store.get('badkey', function (err, result) {
    t.equal(err, null)
    t.equal(result, undefined)
    t.end()
  })
})

test('get multiple', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()
  store.set('a', 1, function (err) {
    t.equal(err, null)
    store.set('b', 2, function (err) {
      t.equal(err, null)
      store.get(['a', 'b'], function (err, result) {
        t.equal(err, null)
        t.deepEqual(result, [1, 2])
        t.end()
      })
    })
  })
})

test('promises', function (t) {
  t.timeoutAfter(3000)

  if (typeof Promise !== 'function') {
    t.skip('Promises not supported')
    t.end()
    return
  }

  var store = createStore()

  store.set('a', 1)
  .then(function () { return store.get('a') })
  .then(function (result) {
    t.equal(result, 1)
    return store.json()
  })
  .then(function (json) {
    t.deepEqual(json, {a: 1})
    return store.keys()
  }).then(function (keys) {
    t.deepEqual(keys, ['a'])
    t.end()
  })
  .catch(function (err) { t.fail(err) })
})

test('json()', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()
  store.json(function (err, json) {
    t.equal(err, null)
    t.deepEqual(json, {})
    store.set('abc', 'def', function (err) {
      t.equal(err, null)
      store.json(function (err, json) {
        t.equal(err, null)
        t.deepEqual(json, {abc: 'def'})
        t.end()
      })
    })
  })
})

test('keys()', function (t) {
  t.timeoutAfter(3000)
  var store = createStore()
  store.keys(function (err, keys) {
    t.equal(err, null)
    t.deepEqual(keys, [])
    store.set('abc', 'def', function (err) {
      t.equal(err, null)
      store.keys(function (err, keys) {
        t.equal(err, null)
        t.deepEqual(keys, ['abc'])
        t.end()
      })
    })
  })
})

test('error cases', function (t) {
  t.throws(function () { return new IdbKeyStore() })
  t.throws(function () { return new IdbKeyStore({}) })
  t.end()
})

function createStore (opts) {
  var name = '' + (Math.round(9e16 * Math.random()))
  return new IdbKeyStore(name, opts)
}
