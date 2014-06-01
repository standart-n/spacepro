var Schema;

Schema = require('mongoose').Schema;

module.exports = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  dict_id: {
    type:   Number,
    index:  true
  },
  sid: {
    type:   String,
    index:  true
  },
  parent_id: {
    type:   Number,
    index:  true
  },
  caption: {
    type:   String,
    index:  true
  },
  status: {
    type:   Number,
    index:  true
  },
  description: {
    type:   String,
    index:  true
  },
  settings: {
    id: {
      type: Schema.Types.ObjectId
    },
    // type: Object
    main: {
      sourcetablename:       String,
      returnfieldname:       String,
      captionfieldname:      String,
      keyfieldname:          String,
      viewid:                String,
      rootgrouptablename:    String,
      showcaption:           String,
      getcaption:            String,
      groupselect:           Number,
      foldergroup:           String,
      initfolder_id:         Number,
      dataset:               Number,
      inittmsgroup:          Number,
      folders_visible:       Boolean,
      canfloating:           Boolean,
      hidetoppanel:          Boolean,
      activatedictaction:    Boolean,
      fa_icon: {
        type:                String,
        "default":           'fa-table'
      },
      hidden_xs:             [String],
      hidden_sm:             [String],
      hidden_md:             [String],
      hidden_lg:             [String]
    },
    insertsql:               String,
    deletesql_selected:      String,
    deletesql:               String,
    refreshsql:              String,
    selectsqlwithdeleted:    String,
    selectsql:               String,
    cfselect: {
      selectfieldexpression: String,
      allwayspartial:        Boolean
    },
    form_show: {
      position:              Number,
      left:                  Number,
      top:                   Number,
      width:                 Number,
      height:                Number,
      maxwidth:              Number,
      maxheight:             Number,
      minwidth:              Number,
      minheight:             Number
    },
    form_get: {
      position:              Number,
      left:                  Number,
      top:                   Number,
      width:                 Number,
      height:                Number,
      maxwidth:              Number,
      maxheight:             Number,
      minwidth:              Number,
      minheight:             Number
    },
    editfields: {
      type: Object
    },
    addfields: {
      type: Object
    },
    childs: {
      bottomdock_units:      Number,
      bottomdock_size:       Number,
      rightdock_units:       Number,
      rightdock_size:        Number
    },
    child_0: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_1: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_2: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_3: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_4: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_5: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_6: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_7: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_8: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    },
    child_9: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String,
      fa_icon:               String
    }
  },
  insertdt: {
    type: Date,
    "default": Date.now
  },
  post_dt: {
    type: Date,
    "default": Date.now
  }
});
