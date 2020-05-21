# JSON Pattern Match

![npm](https://img.shields.io/npm/v/json-pattern-match)

## Basic Usage

```
npm install json-pattern-match --save-dev
```

```javascript
const { matchPattern, __pattern } = require('json-pattern-match'); 

const data = {
  title: 'JSON Pattern Match',
  url: 'http://localhost/',
  author: 'luotaorr',
  published: true,
  size: 11,
  files: [],
}

const pattern = {
  title: __pattern.string,
  url: /http:\/\/localhost\//,
  author: 'luotaorr',
  published: __pattern.boolean,
  size: __pattern.number,
  files: __pattern.array,
}

const matcher = matchPattern( data, pattern );

// `matcher.miss === []` means pass
console.log( matcher.miss );

// otherwise:
[
  {
    actual: 'http://google.com',
    expect: /https:\/\/google.com/,
    path: '$[0].a', // JSON Path
    type: 'regexp'
  }
]
```

## Built-in types

- `_pattern.string`
- `_pattern.number`
- `_pattern.boolean`
- `_pattern.array`
- `_pattern.plainobject`
- `_pattern.regexp`
- `_pattern.null`
