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


const jsonMatch = ( json, pattern ) => {
  let errors = [];

  const match = ( json, pattern, path = '$' ) => {
    const target = jp.query( json, path )[0];
    const _type = _typeof( pattern );

    switch ( _type ) {
      case 'array':
        if ( _typeof( target ) !== 'array' || target.length !== pattern.length ) {
          errors.push({
            path: path,
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
          errors.push( {
            path: path,
            expect: pattern,
            actual: target,
          } );
        }
        break;
      case 'plain-object':
        if ( _typeof( target ) !== 'plain-object' ) {
          errors.push( {
            path: path,
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
              errors.push( {
                path: `${path}.${key}`,
                expect: pattern[key],
                actual: target[key],
              } );
            }
          }
        }
        break;
      case 'string':
      case 'number':
      case 'boolean':
        if ( _typeof( target ) !== _type || target !== pattern ) {
          errors.push({
            path: path,
            expect: pattern,
            actual: target,
          });
        }
        break;
      default:
        break;
    }

  }

  match( json, pattern );

  return errors;
}


exports._typeof = _typeof;
exports.jsonMatch  = jsonMatch;
