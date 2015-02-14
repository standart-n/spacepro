
var _ = require('lodash');

var Ini = function() {};

Ini.prototype.parse = function(data, options) {
  var lines, line, key, value, caption, iterator,
    issue = [],
    ms = {},
    json = {};

  options = _.defaults(options || {}, {
    textFields:     [],
    registerFields: []
  });

  if (data == null) {
    data = '';
  }

  data = data.replace(/\r/g,"\n");
  data =  data + "\n";
  lines = data.match(/(.*?)\n/g);
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
            if (_.indexOf(options.registerFields, key) > -1) {
              json[caption] = issue.join(" ");
            } else {
              json[caption] = issue.join(" ").toString().toLowerCase();
            }
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
          if (_.indexOf(options.registerFields, key) > -1) {
            value = line.replace(/(.*?)\=(.*)/,'$2').toString().trim();
          } else {
            value = line.replace(/(.*?)\=(.*)/,'$2').toString().toLowerCase().trim();
          }
          ms[key] = value;
        }
      }
    }
  }
  return json;
};


exports = module.exports = new Ini();
