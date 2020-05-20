const test = require('ava');
const { _typeof, matchPattern, __pattern } = require('../src/json-pattern-match.js');
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

test( '#matchPattern', t => {
  const matcher = matchPattern(
    [
      {
        a: 1,
        b: {
          c: 'https://google.com/',
        }
      }
    ],
    [
      {
        a: _.isNumber,
        b: {
          c: /https:\/\/google.com\//,
        }
      }
    ]
  )

  t.deepEqual( matcher.miss, [] );
  t.deepEqual( matcher.pending, [] );
  t.deepEqual( matcher.pass, [
    {
      actual: 1,
      expect: __pattern.number,
      path: '$[0].a',
      type: 'function',
    },
    {
      actual: 'https://google.com/',
      expect: /https:\/\/google.com\//,
      path: '$[0].b.c',
      type: 'regexp',
    }
  ] );
} );

