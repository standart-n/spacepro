
var Schema = require('mongoose').Schema;

module.exports = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  dict_id: {
    type:   String,
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
      returnfieldname: {
        type:                String,
        lowercase:           true 
      },
      captionfieldname: {
        type:                String,
        lowercase:           true 
      },
      keyfieldname: {
        type:                String,
        lowercase:           true 
      },
      viewid:                String,
      rootgrouptablename:    String,
      showcaption:           String,
      getcaption:            String,
      groupselect:           Number,
      foldergroup: {
        type:                String,
        lowercase:           true 
      },
      initfolder_id:         Number,
      mmbshgroup: {
        type:                String,
        lowercase:           true 
      },
      groupfield:            String,
      initgroup_id:          Number,
      dataset:               Number,
      inittmsgroup:          Number,
      folders_visible:       Boolean,
      canfloating:           Boolean,
      hidetoppanel:          Boolean,
      activatedictaction:    Boolean,
      showintheweb: {
        type:                Boolean,
        "default":           false
      },
      fa_icon: {
        type:                String,
        "default":           'fa-table'
      },
      hidden_xs:             [String],
      hidden_sm:             [String],
      hidden_md:             [String],
      hidden_lg:             [String],
      visible_xs:            [String],
      visible_sm:            [String],
      visible_md:            [String],
      visible_lg:            [String],
      visible_columns:       [String]
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
    renderitemsearch: {
      type:      String,
      lowercase: true
    },
    renderoptionsearch: {
      type:      String,
      lowercase: true
    },
    filters: [{
      id:                    Number,
      wdict_id:              Number,
      user_id:               Number,
      caption:               String,
      sqltext:               String,
      insertdt:              Date,
      systemflag:            Boolean
    }],
    folders: [{
      id:                    Number,
      parent_id:             Number,
      sid:                   String,
      caption:               String,
      depth:                 Number,
      color:                 Number,
      hex:                   String,
      sorting:               Number
    }],
    groups: [{
      id:                    Number,
      parent_id:             Number,
      sid:                   String,
      caption:               String,
      depth:                 Number,
      color:                 Number,
      hex:                   String,
      sorting:               Number
    }],
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
      afterupd:              String
    },
    child_1: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_2: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_3: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_4: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_5: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_6: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_7: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_8: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
    },
    child_9: {
      caption:               String,
      wdict:                 String,
      oninit:                String,
      afterscroll:           String,
      onselectedchange:      String,
      defaultdocksite:       String,
      shortcut:              String,
      afterupd:              String
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
