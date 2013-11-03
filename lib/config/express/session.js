var Memory, body, express, loaders, options, query, session;

express = require('express');

session = require('connect-session').session;

Memory = require(process.env.APP_DIR + '/lib/controllers/memory')(express);

body = function(options) {
  var paramName;
  if (options == null) {
    options = {};
  }
  paramName = options.param != null ? options.param : 'sessid';
  return function(req) {
    if (req.body != null) {
      return req.body[paramName];
    }
  };
};

query = function(options) {
  var paramName;
  if (options == null) {
    options = {};
  }
  paramName = options.param != null ? options.param : 'sessid';
  return function(req) {
    if (req.query != null) {
      return req.query[paramName];
    }
  };
};

loaders = [query(), body()];

options = {
  store: new Memory()
};

module.exports = session(loaders, options);
