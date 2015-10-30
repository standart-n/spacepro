
var _ =       require('_');
var Common =  require('common');

var GroupEdit = Common.extend({

  el: "[data-view=\"group\"]",

  initialize: function() {
    var _this = this;

    this.allGroups =     _.indexBy(this.options.groups,      'id')  || {};
    this.checkGroups =   _.indexBy(this.options.checkGroups, 'id')  || {};

    if (this.options.value) {
      this.checkGroups = _.indexBy(parseGroupLine(this.options.value), 'id');
    }

    this.$allGroups =    this.$el.find("[data-view=\"all-groups\"]");
    this.$checkGroups =  this.$el.find("[data-view=\"check-groups\"]");

    this.$checkGroups.append( this.render("check", this.checkGroups, "success", true));
    this.$allGroups.append(   this.render("all",   this.allGroups,   "default", true));

    this.$el.on('click', '[data-action=\"group-edit\"]', function(e) {
      e.preventDefault();
      var $line =  $(this).parent().parent();
      var id =     $line.data('group-id');
      var type =   $line.data('group-type');
      var groups = {};
      groups[id] = _this.allGroups[id] || {};
      $line.remove();
      if (type === 'all') {
        _this.$checkGroups.append( _this.render("check", groups, "success", true));
      } else {
        _this.$allGroups.append(   _this.render("all",   groups, "default", true));
      }
      // _this.result();
    });

  }
});

GroupEdit.prototype.result = function() {
  var old = _.keys(this.checkGroups);
  var add = [];
  var del = [];
  var now = [];
  this.$checkGroups.find('.row').each(function() {
    var id = $(this).data('group-id');
    now.push(id.toString());    
  });
  del = _.difference(old, now);
  add = _.difference(now, old);
  return {
    old: old,
    now: now,
    add: add,
    del: del
  };
};

GroupEdit.prototype.render = function(type, ms, cl, colorize) {
  var _this = this;
  var s = '';
  if (type == null) {
    type = "all";
  }
  if (ms == null) {
    ms = {};
  }
  if (cl == null) {
    cl = 'default';
  }
  if (colorize == null) {
    colorize = false;
  }
  _.each(ms, function(group, key) {
    group = _this.allGroups[key];
    if (group) {
      if ((type !== 'all') || (!$(_this.$checkGroups).find('[data-group-id=\"' + group.id + '\"]').length)) {
        if (group.depth > 1) {
          s += '<div class = "row", data-group-id = "#{group.id}", data-group-type = "#{type}">';
          if (colorize) {
            s +=   '<div class = "col-sm-1">';
            s +=     '<span class = "badge-group", style = "color:#000; background-color:##{group.hex};">';
            s +=       '&nbsp;';
            s +=     '</span>';
            s +=   '</div>';
          }
          s +=   '<div class = "col-sm-10">';
          s +=     '<a class = "btn btn-xs btn-#{class}", data-action = "group-edit", href = "#">';
          s +=       '#{group.caption}';
          s +=     '</a>';
          s +=   '</div>';
          s += '</div>';
          s = s.replace(/\#\{class}/g,           cl);
          s = s.replace(/\#\{type}/g,            type);
          s = s.replace(/\#\{group\.id\}/g,      group.id);
          s = s.replace(/\#\{group\.hex\}/g,     group.hex);
          s = s.replace(/\#\{group\.caption\}/g, group.caption);
        }
      }
    }
  });
  return s;  
};


module.exports = GroupEdit;
