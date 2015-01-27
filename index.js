module.exports = function urlCanon(rawUrl) {
  return compose(
    replaceSearch(sortQuery),
    removeTrailing,
    normalizeEscaped,
    parse
  )(rawUrl);
};

function parse(href) {
  var parser = document.createElement('a');
  parser.href = href;
  return parser.href;
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

function replaceSearch(fn) {
  return function (href) {
    return href.replace(/\?([^?#]*)/, function (match, search) {
      return '?' + fn(search);
    });
  };
}

function sortQuery(query) {
  return query.split('&').sort().join('&');
}

function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) {
      result = args[i].call(this, result);
    }
    return result;
  };
}