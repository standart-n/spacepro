jade.templates = jade.templates || {};
jade.templates['navbar'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<header class="navbar"><div class="container"><button type="button" data-toggle="collapse" data-target=".sidebar-nav.nav-collapse" class="navbar-toggle"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a id="main-menu-toggle" class="hidden-xs open"><i class="fa fa-bars"></i></a><a href="/" class="navbar-brand col-lg-2 col-sm-1 col-xs-12"><i class="fa fa-rocket fa-lg fa-inverse fa-fw"></i><span class="hidden-sm">SpacePro</span></a><div class="header-nav nav-no-collapse"><ul class="nav navbar-nav pull-right"><li><a href="#auth/logout" class="btn"><i class="fa fa-power-off fa-fw"></i>&nbsp;<small>' + escape((interp = gettext('Logout')) == null ? '' : interp) + '</small></a></li></ul></div></div></header>');
}
return buf.join("");
};
})();