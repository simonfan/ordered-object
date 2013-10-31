define(['ordered-object'], function(OrderedObject) {

return function() {

    QUnit.module('Base');

    test('Initialize', function() {
        var sequence = ['first','second','third'],
            values = {
                first: 1,
                second: 2,
                third: 3
            },
            ordered = new OrderedObject(sequence, values);

        ok(ordered);

        deepEqual(ordered.sequence, sequence);
        deepEqual(ordered.values, values);
    });

    test('set, get', function() {

        var ordered = new OrderedObject();

        ordered.set('first-key','first-value');

        equal(ordered.get('first-key'), 'first-value');
    });

    test('iterate', function() {
        var ordered = new OrderedObject(),
            orderedValues = ['first-value','second-value','third-value'];

        ordered.set('first-key','first-value');
        ordered.set('second-key','second-value');
        ordered.set('third-key','third-value');

        ordered.each(function(value, name, index) {
            deepEqual(value, orderedValues[ index ]);
        });
    });

    test('set(key, value, at)', function() {
        var sequence = ['first','second','third'],
            values = {
                first: 1,
                second: 2,
                third: 3
            },
            ordered = new OrderedObject(sequence, values);


        var newOrder = _.clone(sequence);
        newOrder.splice(1, 0, 'between-first-and-second');
        newOrder.push('last');

        // insert a value between the first and the second
        ordered.set('between-first-and-second', 3/2, 1);
        ordered.set('last', 100, 1000)

        deepEqual(ordered.sequence, newOrder);
    });

    test('move(key, to)', function() {
        var sequence = ['first','second','third'],
            values = {
                first: 1,
                second: 2,
                third: 3
            },
            ordered = new OrderedObject(sequence, values);

        ordered.move('first', 2);

        deepEqual(ordered.sequence, ['second','third','first']);
    });

    test('unset(attributes)', function() {
        var sequence = ['first','second','third'],
            values = {
                first: 1,
                second: 2,
                third: 3
            },
            ordered = new OrderedObject(sequence, values);

        ordered.unset(['first','second']);

        deepEqual(ordered.values, { third: 3 });
        deepEqual(ordered.sequence, ['third']);
    });


    test('get() [no parameters]', function() {
        var sequence = ['first','second','third'],
            values = {
                first: 1,
                second: 2,
                third: 3
            },
            ordered = new OrderedObject(sequence, values);

        ordered.move('second', 2).move('first', 1);

        deepEqual(ordered.get(), [3,1,2])
    })

}
});
