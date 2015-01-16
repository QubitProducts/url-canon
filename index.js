module.exports = function urlCanon(rawUrl) {
  var parser = document.createElement('a');
  parser.href = rawUrl;
  if (Boolean(parser.search) === true) {
    parser.search = '?' + sortQuery(parser.search.replace(/^\?/, ''));
  }
  parser.href = normalizeEscaped(parser.href);
  parser.href = removeTrailing(parser.href);
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
    .replace(/#$/, '')
    .replace(/\?$/, '')
    .replace(/\?#/, '#');
}