
var colors =  require('colors');
var bytes =   require('bytes');
var moment =  require('moment');

module.exports = function(express) {

  return express.logger(function(token, req, res) {

    var dt, result, tm, _ref;

    var status = res.statusCode;
    var len =    parseInt(res.getHeader('Content-Length'), 10);
    var color =  32;

    if (status >= 500) {
      color = 31;
    } else {
      if (status >= 400) {
        color = 33;
      } else {
        if (status >= 300) {
          color = 36;
        }
      }
    }

    len =  isNaN(len) ? '' : len = bytes(len);
    tm =   (new Date() - req._startTime).toString() + 'ms';
    dt =   new Date().toString();

    result = (moment().format('HH:mm:ss.SSS').blue)      + " " + 
             (moment().format('DD/MM/YYYY').magenta)     + " " +
             "\x1b[" + color + "m" + req.method          + " " +
             "\x1b[" + color + "m" + res.statusCode      + " " + 
             tm.cyan                                     + " " + 
             len.yellow                                  + " " + 
             req.originalUrl.grey;

    if (((_ref = req.session) != null ? _ref.id : void 0) != null) {
      result += " " + (req.session.id.toString().grey);
    }

    return result;

  });

};

