
var _ =             require('lodash');
var program =       require('commander');
var pkg =           require(__dirname + '/package.json');
var pkg_units =     require(__dirname + '/public/units/package.json');

var defaults = {
  name: 'app',
  author: '',
  description: '',
  keywords: [],
  version: '0.0.0'
};

pkg =       _.extend({}, defaults, pkg);
pkg_units = _.extend({}, defaults, pkg_units);

if (!process.env.PROFILE) {
  process.env.PROFILE = "default";
}

process.env.COMMAND =                 "help";
process.env.APP_DIR =                 __dirname;
process.env.APP_NAME =                pkg.name;
process.env.APP_AUTHOR =              pkg.author;
process.env.APP_DESCRIPTION =         pkg.description;
process.env.APP_KEYWORDS =            pkg.keywords.join(', ');
process.env.APP_VERSION =             pkg.version;
process.env.APP_USR =                 "/usr/lib/" + process.env.APP_NAME;
process.env.APP_EXEC =                "" + process.env.APP_DIR + "/" + process.env.APP_NAME;
process.env.APP_CONF =                "" + process.env.APP_USR + "/" + process.env.PROFILE;
process.env.APP_STORE =               "" + process.env.APP_CONF + "/store.json";

process.env.APP_UNITS_DIR =           __dirname + '/public/units';
process.env.APP_UNITS_NAME =          pkg_units.name;
process.env.APP_UNITS_CLIENT =        "units" + "/" + 'js' + "/" + 'app.lmd.' + pkg_units.version + '.js';
process.env.APP_UNITS_ROUTES =        "" + process.env.APP_UNITS_DIR + "/" + 'routes.js';
process.env.APP_UNITS_AUTHOR =        pkg_units.author;
process.env.APP_UNITS_DESCRIPTION =   pkg_units.description;
process.env.APP_UNITS_KEYWORDS =      pkg_units.keywords.join(', ');
process.env.APP_UNITS_VERSION =       pkg_units.version;

program.version(process.env.APP_VERSION);

require(process.env.APP_DIR + '/lib/config/program/server')(program);

program.parse(process.argv);

if (process.env.COMMAND === 'help') {
  program.help();
}
