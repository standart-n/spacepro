
var _, Ini;

_ = require('lodash');

Ini = function() {};

Ini.prototype.parse = function(data, options) {
  var lines, line, key, value, caption, iterator,
    issue = [],
    ms = {},
    json = {};

  options = _.defaults(options || {}, {
    textFields: []
  });

  if (data == null) {
    data = '';
  }

  data =  data + "\r";
  lines = data.match(/(.*?)\r/g);
  lines.push('[end]');

  iterator = function(caption) {
    return function(field) {
      return field == caption ? true : false;
    };
  };

  for (var i = 0; i < lines.length; i++) {
    line = lines[i];
    line = line.replace('\r','');
    line = line.replace('\n','');
    if (line !== '') {
      if (line.match(/\[(.*?)\]/)) {
        if (caption != null) {
          if (_.find(options.textFields, iterator(caption))) {
            json[caption] = issue.join(" ");
          } else {
            json[caption] = ms;
          }
        }
        issue =   [];
        ms =      {};
        caption = line.toLowerCase().trim();
        caption = caption.replace('[','');
        caption = caption.replace(']','');
      } else {
        issue.push(line);
        if (line.match(/\=/)) {
          key = line.replace(/(.*?)\=(.*)/,'$1').toLowerCase().trim();
          value = line.replace(/(.*?)\=(.*)/,'$2').trim();
          ms[key] = value;
        }
      }
    }
  }
  return json;
};


exports = module.exports = new Ini();
