const test = require('ava');
const { _typeof, jsonMatch } = require('../src/json-pattern-match.js');
const _ = require( 'loadsh' );

test( '#_typeof', t => {
  t.plan( 8 );
  t.is( _typeof( function(t) { return t; } ), 'function' );
  t.is( _typeof( [] ), 'array' );
  t.is( _typeof( {} ), 'plain-object' );
  t.is( _typeof( true ), 'boolean' );
  t.is( _typeof( false ), 'boolean' );
  t.is( _typeof( 'string' ), 'string' );
  t.is( _typeof( 112.1 ), 'number' );
  t.is( _typeof( /http/ ), 'regexp' );
} );

test( '#jsonMatch', t => {
  const json = [
    {
      a: 1,
      b: '2',
      c: [3, 4],
      d: {
        aa: 11,
        nn: false,
      }
    }
  ]
  const pattern = [
    {
      a: _.isNumber,
      b: _.isString,
      c: _.isArray,
      d: {
        aa: _.isNumber,
        nn: _.isBoolean,
      }
    }
  ]

  t.deepEqual( jsonMatch( json, pattern ), [] )

  t.deepEqual(
    jsonMatch(
      {
        'a:i': 1,
      },
      {
        'a:i': _.isNumber,
      }
    ),
    []
  );

  t.deepEqual(
    jsonMatch(
      {
        'a.i': 1,
      },
      {
        'a.i': _.isNumber,
      },
    ),
    []
  );

  t.deepEqual(
    jsonMatch(
      {
        a: [
          {
            n: 1,
          },
          {
            n: 2,
          }
        ]
      },
      {
        a: [
          _.isPlainObject,
          _.isPlainObject,
        ]
      }
    ),
    [],
  );
} );

