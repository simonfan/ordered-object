define(["lazy"], function(undef) {

    var Ordered = function Ordered(sequence, values, options) {
        this.sequence = sequence || [];
        this.values = values || {};
    };

    Ordered.prototype.lazy = function(property) {
        property = property || 'sequence';
        return Lazy(this[ property ]);
    };
    /**
    Returns a Lazy instance of the property.
    Defaults to the Lazy(this.sequence);

    @method lazy
    @param property {String}
    */

    Ordered.prototype.set = function(key, value, index) {
        // save the value
        this.value(key, value);

        arguments.length === 3 ? this.sequence.splice(index, 0, key) : this.sequence.push(key);

        return this;
    }
    /**
    @method set
    @param key {String}
    @param data {Object}
        @param [index] {Number}
        @param [value] {*}
    @param [at] {Number}
    @param [noDuplicate] {Boolean}
    */

    Ordered.prototype.value = function(key, value) {
        if (arguments.length === 2) this.values[ key ] = value;
        return this;
    };
    /**
    Exclusively sets the value on the values hash.
    @method value
    */

    Ordered.prototype.move = function(key, to) {
        var from = typeof key === 'number' ? key : this.indexOf(key);

        if (from !== -1) {
            // only move if the key exists
            this.sequence.splice(to, 0, this.sequence.splice(from, 1)[0]);
        }

        return this;
    }
    /**
    Move a key to another position in the sequence.

    @method move
    @param key {String}
    @param to {Number}
    */

    Ordered.prototype.unset = function(attributes) {
        var _this = this;

        this.sequence = this.lazy('sequence').without(attributes).toArray();

        Lazy(attributes).each(function(attribute) {
            delete _this.values[ attribute ];
        });

        return this;
    }

    Ordered.prototype.clear = function() {
        this.sequence = [];
        this.values = {};

        return this;
    };

    Ordered.prototype.get = function(key) {
        if (arguments.length > 0) {
            return typeof key === 'string' ? this.values[ key ] : this.values[ this.sequence[key] ];
        } else {
            return this.map(function(value, key, index) {
                return value;
            }).toArray();
        }
    };

    /**
    Methods that take iterator as first argument.
    */
    var iterationMethods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any'];

    // Mix in each Underscore method as a proxy to `Collection#models`.
    Lazy(iterationMethods).each(function(method) {
        Ordered.prototype[method] = function(iterator) {

            var lazy = Lazy(this.sequence),

                // the values hash
                values = this.values,

                // do not take the first argument
                args = Array.prototype.slice.call(arguments, 1);

                // build a custom iterator
                _iterator = function(name, index) {

                    var value = values[ name ];

                    // call the iterator
                    return iterator.call(this, value, name, index);
                };

            args.unshift(_iterator);

            return lazy[method].apply(lazy, args);
        };
    });


    Ordered.prototype.indexOf = function(value, isSorted) {
        return this.lazy('sequence').indexOf(value, isSorted);
    };

    return Ordered;

});
