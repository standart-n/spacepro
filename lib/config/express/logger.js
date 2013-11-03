var bytes, colors, moment;

colors = require('colors');

bytes = require('bytes');

moment = require('moment');

module.exports = function(token, req, res) {
  var color, dt, len, result, status, tm, _ref;
  status = res.statusCode;
  len = parseInt(res.getHeader('Content-Length'), 10);
  color = 32;
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
  len = isNaN(len) ? '' : len = bytes(len);
  tm = (new Date() - req._startTime).toString() + 'ms';
  dt = new Date().toString();
  result = "" + (moment().format('HH:mm:ss.SSS').blue) + " " + (moment().format('DD/MM/YYYY').magenta) + " \x1b[" + color + "m" + req.method + " \x1b[" + color + "m" + res.statusCode + " " + tm.cyan + " " + len.yellow + " " + req.originalUrl.grey;
  if (((_ref = req.session) != null ? _ref.id : void 0) != null) {
    result += " " + (req.session.id.toString().grey);
  }
  return result;
};
