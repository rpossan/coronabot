var test = require('tape');
var AmpersandState = require('ampersand-state');
var AmpersandCollection = require('ampersand-collection');
var AmpersandLodashMixins = require('../ampersand-collection-lodash-mixin');
var without = require('lodash/without');
var collection;

var Model = AmpersandState.extend({
    props: {
        id: 'number',
        foo: 'string',
        bar: 'string'
    }
});

var Collection = AmpersandCollection.extend(AmpersandLodashMixins, {
    model: Model
});

var methods = ['forEach', 'each', 'map', 'reduce',
    'reduceRight', 'find', 'filter',
    'reject', 'every', 'some', 'includes', 'invoke', 'invokeMap',
    'max', 'min', 'size', 'first', 'take', 'initial', 'tail',
    'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'sample', 'partition',
    'groupBy', 'countBy', 'sortBy', 'keyBy'
];

test('extended collection contains all necessary methods', function (t) {
    methods.forEach(function (method) {
        t.ok(Collection.prototype[method], 'extended collection contains ' + method + ' method');
    });
    t.end();
});

test('methods should be callable on the collection instance', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'baz' },
        { id: 2, foo: 'baz', bar: 'baz' },
    ]);
    without(methods, 'groupBy', 'countBy', 'sortBy', 'keyBy').forEach(function (method) {
        t.doesNotThrow(function () { collection[method](); }, method + ' should be callable');
    });
    t.end();
});

test('groupBy, countBy, sortBy, keyBy should be callable on the collection instance', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'baz' },
        { id: 2, foo: 'baz', bar: 'baz' },
    ]);
    ['groupBy', 'countBy', 'sortBy', 'keyBy'].forEach(function (method) {
        t.doesNotThrow(function () {
            collection[method]('foo');
        }, method + ' should be callable');
    });
    t.end();
});

test('`where` and `findWhere` methods should filter a collection based on a given attributes', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'baz' },
        { id: 2, foo: 'baz', bar: 'baz' },
        { id: 3, foo: 'baz', bar: 'qux' },
        { id: 4, foo: 'qux', bar: 'qux' },
        { id: 5, foo: 'qux', bar: 'qux' },
        { id: 6, foo: 'qux', bar: 'baz' }
    ]);

    var whereSingleAttr = collection.where({
        foo: 'baz'
    });
    t.equal(whereSingleAttr.length, 3, 'find all matching models for a given attribute');

    var whereMultipleAttr = collection.where({
        foo: 'qux',
        bar: 'qux'
    });
    t.equal(whereMultipleAttr.length, 2, 'find all matching models for a given attributes');

    var findWhereSingleAttr = collection.findWhere({
        foo: 'baz'
    });
    t.ok(findWhereSingleAttr, 'return first matching model for a given attribute');
    t.equal(findWhereSingleAttr.get('id'), 1, 'verify that returned model is indeed first possible match');

    var findWhereMultipleAttr = collection.findWhere({
        foo: 'qux',
        bar: 'qux'
    });
    t.ok(findWhereMultipleAttr, 'return first matching model for a given attributes');
    t.equal(findWhereMultipleAttr.get('id'), 4, 'verify that returned model is indeed first possible match');

    t.end();
});

test('`pluck` method should get attribute value from each model', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'qux' },
        { id: 2, foo: 'qux', bar: 'baz' }
    ]);

    var foo = collection.pluck('foo');
    t.deepEqual(foo, ['baz', 'qux'], 'verify that returned attribute values are correct');

    var bar = collection.pluck('bar');
    t.deepEqual(bar, ['qux', 'baz'], 'verify that returned attribute values are correct');

    t.end();
});

test('`first` method should return first model', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'qux' },
        { id: 2, foo: 'qux', bar: 'baz' }
    ]);

    var first = collection.first().toJSON();
    t.deepEqual(first, { id: 1, foo: 'baz', bar: 'qux' }, 'verify that returned attribute values are correct');

    collection = new Collection();
    t.strictEqual(collection.first(), undefined, 'verify that returned attribute values are correct');

    t.end();
});

test('`last` method should return last model', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'qux' },
        { id: 2, foo: 'qux', bar: 'baz' }
    ]);

    var last = collection.last().toJSON();
    t.deepEqual(last, { id: 2, foo: 'qux', bar: 'baz' }, 'verify that returned attribute values are correct');

    collection = new Collection();
    t.strictEqual(collection.last(), undefined, 'verify that returned attribute values are correct');

    t.end();
});

test('`size` method should return size of collection', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'qux' },
        { id: 2, foo: 'qux', bar: 'baz' }
    ]);

    var foo = collection.pluck('foo');
    t.strictEqual(collection.size(), 2, 'verify that returned size is correct');

    collection = new Collection();
    t.strictEqual(collection.size(), 0, 'verify that returned size is correct');

    t.end();
});
