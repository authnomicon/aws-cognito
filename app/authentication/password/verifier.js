exports = module.exports = function() {
  var uri = require('url')
    , PasswordVerifier = require('../../../lib/pwver/password')
    , SRPVerifier = require('../../../lib/pwver/srp')
  
  
  return {
    canCreate: function(options) {
      var url = options.url
        , hostnames;
      if (!url) { return false; }
      
      url = uri.parse(url);
      hostnames = url.hostname.split('.');
      
      // https://docs.aws.amazon.com/general/latest/gr/rande.html#cognito_identity_region
      // cognito-idp.{region}.amazonaws.com
      if (hostnames.length == 4
          && hostnames[hostnames.length - 2] == 'amazonaws' && hostnames[hostnames.length - 1] == 'com'
          && hostnames[0] == 'cognito-idp') {
        return true;
      }
      return false;
    },
    
    create: function(options) {
      var url = uri.parse(options.url)
        , hostnames, segments;
      
      hostnames = url.hostname.split('.');
      segments = url.pathname.split('/');
      
      return new PasswordVerifier(segments[1], hostnames[1]);
      //return new SRPVerifier(segments[1], hostnames[1]);
    }
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/ds/authentication/password/VerifierProvider';
exports['@name'] = 'amazon-cognito';
exports['@require'] = [];
