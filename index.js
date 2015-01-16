module.exports = function urlCanon(rawUrl) {
  var parser = document.createElement('a');
  parser.href = rawUrl;
  parser.href = normalizeEscaped(parser.href);
  parser.href = removeTrailing(parser.href);
  parser.href = replaceSearch(parser.href, function (search) {
    return sortQuery(search);
  });
  return parser.href;
};

function sortQuery(query) {
  return query.split('&').sort().join('&');
}

function normalizeEscaped(href) {
  return href.replace(/(%[0-9a-f]{2})+/ig, function (match) {
    return encodeURIComponent(decodeURIComponent(match));
  });
}

function removeTrailing(href) {
  return href
    .replace(/^([^#]*)#$/, function (match, p1) { return p1; })
    .replace(/^([^?#]*)\?$/, function (match, p1) { return p1; })
    .replace(/^([^?]*)\?#/, function (match, p1) { return p1 + '#'; });
}

function replaceSearch(href, fn) {
  return href.replace(/\?([^?#]*)/, function (match, search) {
    return '?' + fn(search);
  });
}