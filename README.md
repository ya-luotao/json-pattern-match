# Json Pattern Match

```
npm install json-pattern-match --save-dev
```

```javascript
const { matchPattern, __pattern } = require('json-pattern-match'); 

const data = {
  title: 'Json Pattern Match',
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
```
