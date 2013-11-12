
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


  describe('Limit / First:', function() {

    it('Without "first" in query', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=1",
        sql_out = "select first 40 * from VW_DEVICE where status=1";

      sqlmaster = new Sqlmaster();

      assert.deepEqual(sql_out, sqlmaster.limit(sql_in, 40));
    });

    it('With "first" in query', function() {
      var sqlmaster,
        sql_in =  "select first 60 * from VW_DEVICE where status=1",
        sql_out = "select first 40 * from VW_DEVICE where status=1";

      sqlmaster = new Sqlmaster();

      assert.deepEqual(sql_out, sqlmaster.limit(sql_in, 40));
    });

  });

  describe('Containing:', function() {

    it('One word', function() {
      var sqlmaster,
        query = 'myQuery',
        cfselect = 'selectcaption',
        str_out = 'selectcaption containing \'myQuery\'';

      sqlmaster = new Sqlmaster();

      assert.equal(str_out, sqlmaster.containing(query, cfselect));
    });

    it('Any words', function() {
      var sqlmaster,
        query = 'my first query',
        cfselect = 'caption',
        str_out = 'caption containing \'my\' and caption containing \'first\' and caption containing \'query\'';

      sqlmaster = new Sqlmaster();

      assert.equal(str_out, sqlmaster.containing(query, cfselect));
    });

  });

  describe('Search:', function() {

    it('Simple query without "where"', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE",
        sql_out = "select * from VW_DEVICE where selectcaption containing 'myQuery'";

      sqlmaster = new Sqlmaster({
        cfselect: 'selectcaption',
        query:    'myQuery'
      });

      assert.deepEqual(sql_out, sqlmaster.search(sql_in));
    });

    it('Simple query with "where"', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=1",
        sql_out = "select * from VW_DEVICE where selectcaption containing 'myQuery' and status=1";

      sqlmaster = new Sqlmaster({
        cfselect: 'selectcaption',
        query:    'myQuery'
      });

      assert.deepEqual(sql_out, sqlmaster.search(sql_in));
    });

    it('Simple query with only "order by"', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE ORDER by id DESC",
        sql_out = "select * from VW_DEVICE where selectcaption containing 'myQuery' ORDER by id DESC";

      sqlmaster = new Sqlmaster({
        cfselect: 'selectcaption',
        query:    'myQuery'
      });

      assert.deepEqual(sql_out, sqlmaster.search(sql_in));
    });

    it('Simple query with "group by" and "order by"', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE GROUP by id ORDER by id DESC",
        sql_out = "select * from VW_DEVICE where selectcaption containing 'myQuery' GROUP by id ORDER by id DESC";

      sqlmaster = new Sqlmaster({
        cfselect: 'selectcaption',
        query:    'myQuery'
      });

      assert.deepEqual(sql_out, sqlmaster.search(sql_in));
    });


  });


  describe('Extend values:', function() {

    it('Simple test', function() {
      var sqlmaster,
        vals = {
          'bp': 200,
          'cp': 300
        },
        vals_out = {
          'ap': 10,
          'bp': 200,
          'cp': 300
        };

      sqlmaster = new Sqlmaster({
        vals: {
          'ap': 10,
          'bp': 20
        }
      });

      assert.deepEqual(vals_out, sqlmaster.extVals(vals));
    });

    it('Simple test whithout first vals', function() {
      var sqlmaster,
        vals = 'string',
        vals_out = {
          'ap': 10,
          'bp': 20
        };

      sqlmaster = new Sqlmaster({
        vals: {
          'ap': 10,
          'bp': 20
        }
      });

      assert.deepEqual(vals_out, sqlmaster.extVals(vals));
    });

  });


  describe('Select:', function() {

    it('Simple test', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=0 order by street",
        sql_out = "select * from VW_DEVICE where status=0 order by street";

      sqlmaster = new Sqlmaster({
        selectsql: sql_in
      });

      assert.equal(sql_out, sqlmaster.select());
    });

    it('Test with limit', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=0 order by street",
        sql_out = "select first 40 * from VW_DEVICE where status=0 order by street";

      sqlmaster = new Sqlmaster({
        sql: sql_in,
        limit: 40
      });

      assert.equal(sql_out, sqlmaster.select());
    });

    it('Test with limit and keys', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=:st order by street",
        sql_out = "select first 40 * from VW_DEVICE where status=1 order by street";

      sqlmaster = new Sqlmaster({
        sql: sql_in,
        limit: 40,
        keys: {
          'st': 'status'
        },
        vals: {
          'status': 1
        }
      });

      assert.equal(sql_out, sqlmaster.select());
    });

    it('Test with limit, keys and query', function() {
      var sqlmaster,
        sql_in =  "select * from VW_DEVICE where status=:st order by street",
        sql_out = "select first 40 * from VW_DEVICE where selectcaption containing 'myQuery' and status=1 order by street";

      sqlmaster = new Sqlmaster({
        sql: sql_in,
        limit: 40,
        keys: {
          'st': 'status'
        },
        vals: {
          'status': 1
        },
        cfselect: 'selectcaption',
        query:    'myQuery'
      });

      assert.equal(sql_out, sqlmaster.select());
    });


  });

});
