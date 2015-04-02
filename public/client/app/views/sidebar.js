
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

  el: "#main-menu-toggle",

  initialize: function() {
    var _this = this,
      $content = $('#content'),
      $sidebar = $('#sidebar-left'),
      $brand = $('.navbar-brand');

    // $sidebar.on('transform', function() {
    //   $sidebar.css({
    //     height: $bottom.offset().top + $bottom.height() - $sidebar.offset().top
    //   });
    // });

    // $(window).on('resize', function() {
    //   $sidebar.trigger('transform');
    // });

    // $sidebar.trigger('transform');

    this.$el.on('click', function() {

      var span, spanNum, newSpa, newSpanNum;
      
      if ($(this).hasClass('open')) {

        $(this).removeClass('open').addClass('close');

        span =        $content.attr('class');
        spanNum =     parseInt(span.replace( /^\D+/g, ''));
        newSpanNum =  spanNum + 2;
        newSpan =     'span' + newSpanNum;
        
        $brand.addClass('noBg');
        $sidebar.hide();
        $content.addClass('full').trigger('transform');

      } else {

        $(this).removeClass('close').addClass('open');
      
        span =        $content.attr('class');
        spanNum =     parseInt(span.replace( /^\D+/g, ''));
        newSpanNum =  spanNum - 2;
        newSpan =     'span' + newSpanNum;
        
        $brand.removeClass('noBg');
        $sidebar.show();
        $content.removeClass('full').trigger('transform');

      }

    });

  }

});
