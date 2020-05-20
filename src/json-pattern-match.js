const _ = require( 'loadsh' );
const jp = require( 'jsonpath' );

const _typeof = ( obj ) => {

  if ( _.isFunction( obj ) ) {
    return 'function';
  }

  if ( _.isBoolean( obj ) ) {
    return 'boolean';
  }

  if ( _.isArray( obj ) ) {
    return 'array';
  }

  if ( _.isPlainObject( obj ) ) {
    return 'plain-object';
  }

  if ( _.isString( obj ) ) {
    return 'string';
  }

  if ( _.isNumber( obj ) ) {
    return 'number';
  }

  if ( _.isRegExp( obj ) ) {
    return 'regexp';
  }

  return '';

}


const matchPattern = ( json, pattern ) => {
  let pass = [];
  let miss = [];
  let pending = [];

  const match = ( json, pattern, path = '$' ) => {
    const target = jp.query( json, path )[0];
    const _type = _typeof( pattern );

    switch ( _type ) {
      case 'array':
        if ( _typeof( target ) !== 'array' || target.length !== pattern.length ) {
          miss.push({
            path: path,
            type: 'array',
            expect: pattern,
            actual: target,
          });
        } else {
          pattern.forEach( ( val, i ) => {
            match( json, val, `${path}[${i}]` );
          } );
        }
        break;
      case 'function':
        if ( ! pattern.call( null, target )  ) {
          miss.push( {
            path: path,
            type: 'function',
            expect: pattern,
            actual: target,
          } );
        } else {
          pass.push( {
            path: path,
            type: 'function',
            expect: pattern,
            actual: target,
          } );
        }
        break;
      case 'plain-object':
        if ( _typeof( target ) !== 'plain-object' ) {
          miss.push( {
            path: path,
            type: 'plain-object',
            expect: pattern,
            actual: target,
          } );
        } else {
          for ( const key in pattern ) {
            if ( target[key] !== undefined ) {
              let key2;
              if ( key.indexOf( ':' ) > -1 || key.indexOf( '.' ) > -1 ) {
                key2 = `['${key}']`;
              } else {
                key2 = `.${key}`;
              }
              match( json, pattern[key], `${path}${key2}` );
            } else {
              miss.push( {
                path: `${path}.${key}`,
                type: 'plain-object',
                expect: pattern[key],
                actual: target[key],
              } );
            }
          }
        }
        break;
      case 'regexp':
        if ( pattern.test( target ) ) {
          pass.push( {
            path: path,
            type: 'regexp',
            expect: pattern,
            actual: target,
          } );
        } else {
          miss.push({
            path: path,
            type: 'regexp',
            expect: pattern,
            actual: target,
          });
        }
        break;
      case 'string':
      case 'number':
      case 'boolean':
        if ( _typeof( target ) !== _type || target !== pattern ) {
          miss.push({
            path: path,
            type: _type,
            expect: pattern,
            actual: target,
          });
        } else {
          pass.push( {
            path: path,
            type: _type,
            expect: pattern,
            actual: target,
          } );
        }
        break;
      default:
        pending.push({
          path: path,
          expect: pattern,
          actual: target,
        });
        break;
    }

  }

  match( json, pattern );

  return {
    miss: miss,
    pass: pass,
    pending: pending,
  }
}


exports._typeof = _typeof;
exports.matchPattern  = matchPattern;
exports.__pattern = {
  function: _.isFunction,
  array: _.isArray,
  plainobject: _.isPlainObject,
  boolean: _.isBoolean,
  number: _.isNumber,
  string: _.isString,
  regexp: _.isRegExp,
}
