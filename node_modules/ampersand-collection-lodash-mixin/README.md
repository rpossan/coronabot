# ampersand-collection-lodash-mixin

Lead Maintainer: [Clemens Stolle](https://github.com/klaemo)

A mixin for extending ampersand-collection with a bunch of lodash methods.

If you're using an [ampersand-rest-collection](http://ampersandjs.com/docs/#ampersand-rest-collection) this is already mixed in for you.

Out of the box, ampersand-collections proxy the [ES5 iteration methods already](http://ampersandjs.com/docs/#ampersand-collection-proxied-es5-array-methods-9) so you don't _have_ to use this mixin, but if you want lodash methods, or better browser support, you can use this.

This mixin adds the following lodash methods:

```
countBy, difference, drop, each, every, filter, find, findWhere, first,
forEach, groupBy, includes, indexOf, initial, invoke, invokeMap, isEmpty, keyBy, last,
lastIndexOf, map, max, min, partition, pluck, reduce, reduceRight, reject,
sample, shuffle, size, some, sortBy, take, tail, where, without
```

It weighs in at about `7.5kb` gzipped.

## install

```
npm install ampersand-collection-lodash-mixin
```

## example

```javascript
var Collection = require('ampersand-collection');
var lodashMixin = require('ampersand-collection-lodash-mixin');


module.exports = Collection.extend(lodashMixin, {
    sampleMethod: function () {
        // now we've got lodash methods
        // we can call that are applied to models
        // in the collection.
        this.filter( ... );
        this.some( ... );
        this.each( ... )
    }
});
```

## credits

All credit for underscore and this approach in backbone goes to Jeremy Ashkenas and the rest of the Backbone and Underscore authors.
All credit for lodash goes to John-David Dalton.

Big thanks to [@STRML](https://github.com/STRML) who generously gave us this module name on npm. If you're interested in his version, it's still there public, you can just keep using version `1.0.2`.

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) and/or [@klaemo](http://twitter.com/klaemo) on twitter.

## license

MIT
