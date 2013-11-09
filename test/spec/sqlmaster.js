
var assert, Sqlmaster;

process.env.APP_DIR = '../..';

assert = require('chai').assert;

Sqlmaster = require(process.env.APP_DIR + '/lib/controllers/sqlmaster');

describe('Sqlmaster:', function() {

  describe('Parsing string:', function() {

    it('Simple string', function() {
      var sqlmaster,
        string = 'b_id=building_d$uuid,ap=APARTMENT',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      sqlmaster = new Sqlmaster();

      assert.deepEqual(json, sqlmaster.parseString(string));
    });

    it('Simple string whith null param', function() {
      var sqlmaster,
        string = 'b_id=building_d$uuid,ap=APARTMENT,QWERTY',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      sqlmaster = new Sqlmaster();

      assert.deepEqual(json, sqlmaster.parseString(string));
    });

    it('Simple string whith null param and "," in the end', function() {
      var sqlmaster,
        string = 'b_id=building_d$uuid,ap=APARTMENT,QWERTY,',
        json = {
          'b_id': 'building_d$uuid',
          'ap': 'APARTMENT'
        };

      sqlmaster = new Sqlmaster();

      assert.deepEqual(json, sqlmaster.parseString(string));
    });

  });

  describe('Parsing params:', function() {

    it('Sql with no keys', function() {
      var sqlmaster,
        sql_in =    'select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid',
        sql_out =   'select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid';

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'BUILDING': 32,
          'APARTMENT': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in));
    });

    it('Sql with params', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=0 order by ' +
                    'insertdt desc',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=32 ' +
                    'and APARTMENT=12  and status=0 order by ' +
                    'insertdt desc';

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'BUILDING': 32,
          'APARTMENT': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in));
    });

    it('Sql with repeat keys', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=\'dom\' ' +
                    'and APARTMENT=12  and status=12 order by ' +
                    'insertdt \'dom\'';

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'BUILDING': 'dom',
          'APARTMENT': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in));
    });

    it('If vals not exists', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=32 ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt 32';

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'BUILDING': 32
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in));
    });

    it('Set vals as params', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=\'dom\' ' +
                    'and APARTMENT=24  and status=24 order by ' +
                    'insertdt \'dom\'',
        local = {
          'APARTMENT': 24
        };

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'BUILDING': 'dom',
          'APARTMENT': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in, local));
    });

    it('Set vals only as params', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=\'dom\' ' +
                    'and APARTMENT=24  and status=24 order by ' +
                    'insertdt \'dom\'',
        local = {
          'BUILDING': 'dom',
          'APARTMENT': 24
        };

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in, local));
    });

    it('Set vals in difference case', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:ap  and status=:ap order by ' +
                    'insertdt :b_id',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=\'dom\' ' +
                    'and APARTMENT=24  and status=24 order by ' +
                    'insertdt \'dom\'',
        local = {
          'APARTMENT': 24
        };

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'building': 'dom',
          'apartment': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in, local));
    });

    it('Set vals and keys in difference case', function() {
      var sqlmaster,
        sql_in =    'select * from VW_ACCOUNT_DATA where building_d$uuid=:b_id ' +
                    'and APARTMENT=:AP  and status=:ap order by ' +
                    'insertdt :B_ID',
        sql_out =   'select * from VW_ACCOUNT_DATA where building_d$uuid=\'dom\' ' +
                    'and APARTMENT=24  and status=24 order by ' +
                    'insertdt \'dom\'',
        local = {
          'APARTMENT': 24
        };

      sqlmaster = new Sqlmaster({
        keys: {
          'b_id': 'BUILDING',
          'ap': 'APARTMENT'
        },
        vals: {
          'building': 'dom',
          'apartment': 12
        }
      });

      assert.deepEqual(sql_out, sqlmaster.setParams(sql_in, local));
    });


  });

});
