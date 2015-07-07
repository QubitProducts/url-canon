var urlCanon = require('../url-canon');

describe('url-canon', function () {

  /**
   * These tests don't pass because IE and Firefox treat internationalised
   * urls differently to chrome.
   *
   * IE and Firefox convert http://xn--nw2a.xn--j6w193g/ to http://見.香港/
   * Chrome converts http://見.香港/ to http://xn--nw2a.xn--j6w193g/
   *
   * With this difference it is hard to normalize internationalised url's
   * without adding much more code.
   */
  it.skip('should convert internationalised urls', function () {
    expect(urlCanon('http://見.香港/')).to.be('http://xn--nw2a.xn--j6w193g/');
  });
  it.skip('should not change converted internationalised urls', function () {
    expect(urlCanon('http://xn--nw2a.xn--j6w193g/')).to.be('http://xn--nw2a.xn--j6w193g/');
  });
  it.skip('should encode internationalised pathnames', function () {
    expect(urlCanon('http://example.com/引き割り.html'))
      .to.be('http://example.com/%E5%BC%95%E3%81%8D%E5%89%B2%E3%82%8A.html');
  });


  it('should re-order query params alphabetically', function () {
    expect(urlCanon('http://example.com/?bre=con&ponty=pool&aber=gavenny'))
      .to.be('http://example.com?aber=gavenny&bre=con&ponty=pool');
  });
  it('should convert needlessly percent-encoded bytes to the corresponding ASCII char', function () {
    expect(urlCanon('http://example.com/%7efoo%2Ebar')).to.be('http://example.com/~foo.bar');
  });
  it('should remove port 80 for http', function () {
    expect(urlCanon('http://example.com:80/?hey=you')).to.be('http://example.com?hey=you');
  });
  it('should not remove port 80 for https', function () {
    expect(urlCanon('https://example.com:80/?hey=you')).to.be('https://example.com:80?hey=you');
  });
  it('should remove port 443 for http', function () {
    expect(urlCanon('https://example.com:443/?hey=you')).to.be('https://example.com?hey=you');
  });
  it('should not remove port 443 for https', function () {
    expect(urlCanon('http://example.com:443/?hey=you')).to.be('http://example.com:443?hey=you');
  });
  it('should lowercase the protocol', function () {
    expect(urlCanon('hTTp://example.com?hey=you')).to.be('http://example.com?hey=you');
  });
  it('should lowercase the hostname', function () {
    expect(urlCanon('http://eXAmple.COm?hey=you')).to.be('http://example.com?hey=you');
  });
  it('should remove trailing hash', function () {
    expect(urlCanon('http://example.com?hey=you#')).to.be('http://example.com?hey=you');
  });
  it('should remove trailing ?', function () {
    expect(urlCanon('http://example.com?')).to.be('http://example.com');
  });
  it('should remove trailing ? and hash', function () {
    expect(urlCanon('http://example.com?#')).to.be('http://example.com');
  });
  it('should not remove trailing hash if part of the hash', function () {
    expect(urlCanon('http://example.com##')).to.be('http://example.com##');
    expect(urlCanon('http://example.com#yo#')).to.be('http://example.com#yo#');
    expect(urlCanon('http://example.com?no=way#yo#')).to.be('http://example.com?no=way#yo#');
  });
  it('should not remove trailing ? if part of the hash', function () {
    expect(urlCanon('http://example.com#?')).to.be('http://example.com#?');
    expect(urlCanon('http://example.com#yo?')).to.be('http://example.com#yo?');
    expect(urlCanon('http://example.com?no=way#yo?')).to.be('http://example.com?no=way#yo?');
  });
  it('should not remove trailing ? if part of the query', function () {
    expect(urlCanon('http://example.com??')).to.be('http://example.com??');
    expect(urlCanon('http://example.com?yo?')).to.be('http://example.com?yo?');
    expect(urlCanon('http://example.com?no=way?yo#')).to.be('http://example.com?no=way?yo');
  });
  it('should remove trailing /', function () {
    expect(urlCanon('http://example.com/')).to.be('http://example.com');
  });
  it('should remove trailing / when a path is present', function () {
    expect(urlCanon('http://example.com/path/')).to.be('http://example.com/path');
  });
  it('should not change encoded internationalised pathnames', function () {
    expect(urlCanon('http://example.com/%E5%BC%95%E3%81%8D%E5%89%B2%E3%82%8A.html'))
      .to.be('http://example.com/%E5%BC%95%E3%81%8D%E5%89%B2%E3%82%8A.html');
  });
  it('should uppercase encoded internationalised pathnames', function () {
    expect(urlCanon('http://example.com/%e5%BC%95%E3%81%8d%E5%89%B2%e3%82%8a.html'))
      .to.be('http://example.com/%E5%BC%95%E3%81%8D%E5%89%B2%E3%82%8A.html');
  });
  it('should uppercase percent encoded bytes', function () {
    expect(urlCanon('http://example.com/foo%c2%b5bar/')).to.be('http://example.com/foo%C2%B5bar');
  });
  it('should throw error for malformed percent encoded bytes', function () {
    expect(urlCanon).withArgs('http://example.com/foo%fbbar/').to.throwException();
  });

  it('should leave additional ? characters alone in the query string', function () {
    expect(urlCanon('http://example.com/?hey?there')).to.be('http://example.com?hey?there');
  });
  it('should leave ? alone in the fragment identifier', function () {
    expect(urlCanon('http://example.com/#foo?hey')).to.be('http://example.com#foo?hey');
  });
  it('should leave additional # characters alone in the fragment identifier', function () {
    expect(urlCanon('http://example.com/#foo#hey')).to.be('http://example.com#foo#hey');
  });
  it('should leave equal signs not in GET parameters alone', function () {
    expect(urlCanon('http://example.com/pi=ng')).to.be('http://example.com/pi=ng');
  });
  it('should leave equal signs in GET parameters alone', function () {
    expect(urlCanon('http://example.com/ping?the=thing')).to.be('http://example.com/ping?the=thing');
  });
  it('should normalize percent encoded equal signs in GET parameters', function () {
    expect(urlCanon('http://example.com/ping?the%3dthing%3D')).to.be('http://example.com/ping?the%3Dthing%3D');
  });
  it('should leave equal signs in the fragment identifier alone', function () {
    expect(urlCanon('http://example.com/ping#the=thing')).to.be('http://example.com/ping#the=thing');
  });
  it('should normalize percent encoded equal signs in the fragment identifier', function () {
    expect(urlCanon('http://example.com/ping#the%3dthing%3D')).to.be('http://example.com/ping#the%3Dthing%3D');
  });
  it('should normalize percent encoded equal signs in the path', function () {
    expect(urlCanon('http://example.com/pi%3dng%3D')).to.be('http://example.com/pi%3Dng%3D');
  });
  it('should not percent encode the colon separating the host name and the port number', function () {
    expect(urlCanon('http://example.com:1234/')).to.be('http://example.com:1234');
  });
  it('should not percent encode the colon separating the ip and the port number', function () {
    expect(urlCanon('http://0.0.0.0:1234/')).to.be('http://0.0.0.0:1234');
  });

});