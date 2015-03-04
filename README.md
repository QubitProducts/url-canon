![url-canon](https://cloud.githubusercontent.com/assets/823104/6485788/0f8784ae-c27e-11e4-9ba5-be08bb7cc852.png)

Normalizes URL's to prevent duplicates that point to the same server resource.

```javascript
var urlCanon = require('url-canon')
urlCanon('http://www.google.com/?b=hey&a=yo&#')
// => returns 'http://www.google.com/?&a=yo&b=hey'
```

## Installation
```bash
npm install qubitdigital/url-canon
```

## Features

* Sorts query parameters into alphabetical order
* Decodes needlessly percent-encoded ASCII
* Removes default ports for http/https
* Lowercases the protocol and hostname
* Removes trailing `#` and `?`
* Uppercases percent encoded bytes

## Compatibility

Tests pass in
* IE8+
* Chrome
* Firefox
* Opera

Does not support Node.js (as it uses an anchor element for parsing).

## Known issues

Internationalised URLs such as `http://見.香港/` are converted to punycode form in Chrome but not in Firefox and IE. Conversely punycode such as `http://xn--nw2a.xn--j6w193g/` is decoded automatically in Firefox and IE to `http://見.香港/`. It is very hard to standardise these URLs and they have not been handled.
