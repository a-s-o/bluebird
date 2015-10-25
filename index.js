'use strict';

const Bluebird = module.exports = require('bluebird');

Bluebird.coroutine.addYeildHandler(function bluebird$yield (value) {
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
      const deferred = Bluebird.defer();
      try { value(deferred.callback); } catch(e) { deferred.reject(e); }
      return deferred.promise;
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
