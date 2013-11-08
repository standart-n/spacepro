
var _, async, Ini;

_ =          require('lodash');
async =      require('async');

Ini = function() {};

Ini.prototype.parse = function(data, options) {
  var lines, line, key, value, caption,
    issue = [],
    ms = {},
    json = {};

  options = _.defaults(options || {}, {
    textFields: []
  });

  if (data == null) {
    data = '';
  }

  lines = data.match(/(.*?)\r/g);
  lines.push('[end]');

  for (i = 0; i < lines.length; i++) {
    line = lines[i];
    line = line.replace('\r','');
    line = line.replace('\n','');
    if (line !== '') {
      if (line.match(/\[(.*?)\]/)) {
        if (caption != null) {
          if (_.find(options.textFields, function(field) {return field == caption})) {
            json[caption] = issue.join(" ");
          } else {
            if (issue.length == 1) {
              json[caption] = issue[0];
            } else {
              json[caption] = ms;
            }
          }
        }
        issue =   [];
        ms =      {};
        caption = line.trim();
        caption = caption.replace('[','');
        caption = caption.replace(']','');
      } else {
        issue.push(line);
        if (line.match(/\=/)) {
          key = line.replace(/(.*?)\=(.*)/,'$1').trim();
          value = line.replace(/(.*?)\=(.*)/,'$2').trim();
          ms[key] = value;
        }
      }
    }
  }
  return json;
};


exports = module.exports = new Ini();
