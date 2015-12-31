'use strict';

const Bluebird = module.exports = require('bluebird');
const isGenerator = require('is-es6-generators');
const isGeneratorFunction = require('is-es6-generators').fn;
const isIteratorLike = require('is-iterator-like');

Bluebird.coroutine.addYieldHandler(function bluebird$yield (value) {
   // Generator function
   if ( isGeneratorFunction(value) ) {
      return Bluebird.coroutine(value).call();
   }

   // Iterator
   if ( isGenerator(value) || isIteratorLike(value) ) {
      return Bluebird.coroutine(function *wrap () {
         return yield* value;
      }).call();
   }

   // Thunk (Function that accepts a node-style callback)
   if ( typeof value === 'function' ) {
      return Bluebird.fromNode(value);
   }

   // Array
   if ( Array.isArray(value) ) {
      return Bluebird.all(value);
   }

   // Object
   if ( typeof value === 'object' ) {
      return Bluebird.props(value);
   }
});
