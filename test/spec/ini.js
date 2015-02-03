
var assert, ini;

process.env.APP_DIR = '../..';

assert = require('chai').assert;

ini = require(process.env.APP_DIR + '/lib/controllers/ini');

describe('Ini:', function() {

  describe('Parsing ini:', function() {

    it('Simple string', function() {
      var 
        text =  "[insertsql] \r\n" +
                "\r\n" +
                "select D$UUID from pr_add_device(:vid,:building_d$uuid,:APARTMENT)\r\n",

        json = {
            "insertsql" : "select D$UUID from pr_add_device(:vid,:building_d$uuid,:APARTMENT)"
        };

      assert.deepEqual(json, ini.parse(text, {
        textFields: ['insertsql']
      }));
    });

    it('Simple string with "="', function() {
      var 
        text =  "[deletesql_selected]\r\n" +
                "update VW_DEVICE set status=iif(status=1,0,1) where d$uuid in (:selected_ids: )\r\n",

        json = {
            "deletesql_selected" : "update VW_DEVICE set status=iif(status=1,0,1) where d$uuid in (:selected_ids: )"
        };

      assert.deepEqual(json, ini.parse(text, {
        textFields: ['deletesql_selected']
      }));
    });

    it('One string and empty part', function() {
      var
        text =  "[refreshsql]\r\n" +
                "select * from VW_DEVICE where d$uuid=:d$uuid\r\n" +
                "\r\n" +
                "[selectsql]\r\n" +
                "\r\n",

        json = {
            "refreshsql" : "select * from VW_DEVICE where d$uuid=:d$uuid",
            "selectsql": {}
        };

      assert.deepEqual(json, ini.parse(text, {
        textFields: ['refreshsql']
      }));
    });

    it('Key-value', function() {
      var
        text =  "[cfSelect]\r\n" +
                "selectfieldexpression=SELECTCAPTION\r\n" +
                "AllwaysPartial=1\r\n" +
                "\r\n" +
                "[form_show]\r\n" +
                "position=0\r\n" +
                "left=1\r\n" +
                "\r\n",

        json = {
            "cfselect": {
              "selectfieldexpression": "SELECTCAPTION",
              "allwayspartial": "1"
            },
            "form_show": {
              "position": "0",
              "left": "1"
            }
        };

      assert.deepEqual(json, ini.parse(text));
    });

    it('Key-value and strings', function() {
      var
        text =  "[cfSelect]\r\n" +
                "selectfieldexpression=SELECTCAPTION\r\n" +
                "AllwaysPartial=1\r\n" +
                "\r\n" +
                "[selectsql]\r\n" +
                "select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid\r\n" +
                "\r\n",

        json = {
            "cfselect": {
              "selectfieldexpression": "SELECTCAPTION",
              "allwayspartial": "1"
            },
            "selectsql": "select * from VW_DEVICE where status=0 order by street, sortedcaptionb, sortedcaptiona,d$uuid"
        };

      assert.deepEqual(json, ini.parse(text, {
        textFields: ['selectsql']
      }));
    });


    it('Parse text fields', function() {
      var
        text =  "[deletesql_selected]\r\n" +
                "update VW_DEVICE\r\n" +
                "set status=iif(status=1,0,1)\r\n" +
                "where d$uuid in (:selected_ids: )\r\n",

        json = {
            "deletesql_selected" : "update VW_DEVICE set status=iif(status=1,0,1) where d$uuid in (:selected_ids: )"
        };

      assert.deepEqual(json, ini.parse(text, {textFields: ['deletesql_selected']}));
    });

    it('Strings whith multiplie "="', function() {
      var
        text =  "[cfSelect]\r\n" +
                "select=field=expression=SELECTCAPTION\r\n" +
                "Allways=Partial=1\r\n" +
                "\r\n",

        json = {
            "cfselect": {
              "select": "field=expression=SELECTCAPTION",
              "allways": "Partial=1"
            }
        };

      assert.deepEqual(json, ini.parse(text));
    });


  });

});
