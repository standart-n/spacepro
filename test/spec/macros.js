
var assert, Macros;

process.env.APP_DIR = '../..';

assert = require('chai').assert;

Macros = require(process.env.APP_DIR + '/lib/controllers/macros');

describe('Macros:', function() {

  describe('Parsing string:', function() {

    it('Simple string', function() {
      var macros,
        string = 'b_id=building_d$uuid,ap=APARTMENT',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      macros = new Macros();

      assert.deepEqual(json, macros.parseString(string));
    });

    it('Simple string whith null param', function() {
      var macros,
        string = 'b_id=building_d$uuid,ap=APARTMENT,QWERTY',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      macros = new Macros();

      assert.deepEqual(json, macros.parseString(string));
    });

    it('Simple string whith null param and "," in the end', function() {
      var macros,
        string = 'b_id=building_d$uuid,ap=APARTMENT,QWERTY,',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      macros = new Macros();

      assert.deepEqual(json, macros.parseString(string));
    });

  });

  describe('Parsing sql:', function() {

    it('Sql with no vals', function() {
      var macros,
        sql_in =    'select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid',
        sql_out =   'select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid';

      macros = new Macros({
        vals: {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        }
      });

      assert.deepEqual(sql_out, macros.parseSql(sql_in));
    });

    it('Sql with params', function() {
      var macros,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=0 order by ' +
                    'insertdt desc',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=32 ' +
                    'and APARTMENT=12  and status=0 order by ' +
                    'insertdt desc';

      macros = new Macros({
        vals: {
          'b_id': '32',
          'ap': '12'
        }
      });

      assert.deepEqual(sql_out, macros.parseSql(sql_in));
    });

    it('Sql with repeat vals', function() {
      var macros,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=32 ' +
                    'and APARTMENT=12  and status=12 order by ' +
                    'insertdt 32';

      macros = new Macros({
        vals: {
          'b_id': '32',
          'ap': '12'
        }
      });

      assert.deepEqual(sql_out, macros.parseSql(sql_in));
    });


  });

});
