'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.4.1';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    selector = selector === '#' ? [] : selector;
    var $parent = $(document).find(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.4.1';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.4.1';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      if ((typeof $next === 'undefined' ? 'undefined' : _typeof($next)) === 'object' && $next.length) {
        $next[0].offsetWidth; // force reflow
      }
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var $this = $(this);
    var href = $this.attr('href');
    if (href) {
      href = href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    }

    var target = $this.attr('data-target') || href;
    var $target = $(document).find(target);

    if (!$target.hasClass('carousel')) return;

    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.4.1';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(document).find(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.4.1';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null;

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.4.1';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    var scrollbarWidth = this.scrollbarWidth;
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth);
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight;
        var calculatedPadding = $(element).css('padding-right');
        $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
      });
    }
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right');
      $(element).removeData('padding-right');
      element.style.paddingRight = padding ? padding : '';
    });
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var target = $this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    var $target = $(document).find(target);
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []

    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
  };var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp;
    });

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    // IE 8 and below don't support createHTMLDocument
    if (!document.implementation || !document.implementation.createHTMLDocument) {
      return unsafeHtml;
    }

    var createdDocument = document.implementation.createHTMLDocument('sanitization');
    createdDocument.body.innerHTML = unsafeHtml;

    var whitelistKeys = $.map(whiteList, function (el, i) {
      return i;
    });
    var elements = $(createdDocument.body).find('*');

    for (var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if ($.inArray(elName, whitelistKeys) === -1) {
        el.parentNode.removeChild(el);

        continue;
      }

      var attributeList = $.map(el.attributes, function (el) {
        return el;
      });
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

      for (var j = 0, len2 = attributeList.length; j < len2; j++) {
        if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
          el.removeAttribute(attributeList[j].nodeName);
        }
      }
    }

    return createdDocument.body.innerHTML;
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.4.1';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.$element.data();

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr];
      }
    }

    options = $.extend({}, this.getDefaults(), dataAttributes, options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    if (options.sanitize) {
      options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    if (this.options.html) {
      if (this.options.sanitize) {
        title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
      }

      $tip.find('.tooltip-inner').html(title);
    } else {
      $tip.find('.tooltip-inner').text(title);
    }

    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
    return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.4.1';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    if (this.options.html) {
      var typeContent = typeof content === 'undefined' ? 'undefined' : _typeof(content);

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title);

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content);
        }
      }

      $tip.find('.popover-title').html(title);
      $tip.find('.popover-content').children().detach().end()[typeContent === 'string' ? 'html' : 'append'](content);
    } else {
      $tip.find('.popover-title').text(title);
      $tip.find('.popover-content').children().detach().end().text(content);
    }

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.4.1';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.4.1';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(document).find(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);

    this.$target = target.on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.4.1';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
'use strict';

jQuery(function ($) {
  'use strict';

  // Enable tooltips.

  $('[data-toggle="tooltip"]').tooltip();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJFcnJvciIsIiQiLCJ2ZXJzaW9uIiwiZm4iLCJqcXVlcnkiLCJzcGxpdCIsInRyYW5zaXRpb25FbmQiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInRyYW5zRW5kRXZlbnROYW1lcyIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwiT1RyYW5zaXRpb24iLCJ0cmFuc2l0aW9uIiwibmFtZSIsInN0eWxlIiwidW5kZWZpbmVkIiwiZW5kIiwiZW11bGF0ZVRyYW5zaXRpb25FbmQiLCJkdXJhdGlvbiIsImNhbGxlZCIsIiRlbCIsIm9uZSIsImNhbGxiYWNrIiwidHJpZ2dlciIsInN1cHBvcnQiLCJzZXRUaW1lb3V0IiwiZXZlbnQiLCJzcGVjaWFsIiwiYnNUcmFuc2l0aW9uRW5kIiwiYmluZFR5cGUiLCJkZWxlZ2F0ZVR5cGUiLCJoYW5kbGUiLCJlIiwidGFyZ2V0IiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJkaXNtaXNzIiwiQWxlcnQiLCJvbiIsImNsb3NlIiwiVkVSU0lPTiIsIlRSQU5TSVRJT05fRFVSQVRJT04iLCJwcm90b3R5cGUiLCIkdGhpcyIsInNlbGVjdG9yIiwiYXR0ciIsInJlcGxhY2UiLCIkcGFyZW50IiwiZmluZCIsInByZXZlbnREZWZhdWx0IiwibGVuZ3RoIiwiY2xvc2VzdCIsIkV2ZW50IiwiaXNEZWZhdWx0UHJldmVudGVkIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVFbGVtZW50IiwiZGV0YWNoIiwicmVtb3ZlIiwiaGFzQ2xhc3MiLCJQbHVnaW4iLCJvcHRpb24iLCJlYWNoIiwiZGF0YSIsImNhbGwiLCJvbGQiLCJhbGVydCIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIkJ1dHRvbiIsImVsZW1lbnQiLCJvcHRpb25zIiwiJGVsZW1lbnQiLCJleHRlbmQiLCJERUZBVUxUUyIsImlzTG9hZGluZyIsImxvYWRpbmdUZXh0Iiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCJ2YWwiLCJyZXNldFRleHQiLCJwcm94eSIsImFkZENsYXNzIiwicHJvcCIsInJlbW92ZUF0dHIiLCJ0b2dnbGUiLCJjaGFuZ2VkIiwiJGlucHV0IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCIkYnRuIiwiZmlyc3QiLCJ0ZXN0IiwidHlwZSIsIkNhcm91c2VsIiwiJGluZGljYXRvcnMiLCJwYXVzZWQiLCJzbGlkaW5nIiwiaW50ZXJ2YWwiLCIkYWN0aXZlIiwiJGl0ZW1zIiwia2V5Ym9hcmQiLCJrZXlkb3duIiwicGF1c2UiLCJkb2N1bWVudEVsZW1lbnQiLCJjeWNsZSIsIndyYXAiLCJ0YWdOYW1lIiwid2hpY2giLCJwcmV2IiwibmV4dCIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImdldEl0ZW1JbmRleCIsIml0ZW0iLCJwYXJlbnQiLCJjaGlsZHJlbiIsImluZGV4IiwiZ2V0SXRlbUZvckRpcmVjdGlvbiIsImRpcmVjdGlvbiIsImFjdGl2ZSIsImFjdGl2ZUluZGV4Iiwid2lsbFdyYXAiLCJkZWx0YSIsIml0ZW1JbmRleCIsImVxIiwidG8iLCJwb3MiLCJ0aGF0Iiwic2xpZGUiLCIkbmV4dCIsImlzQ3ljbGluZyIsInJlbGF0ZWRUYXJnZXQiLCJzbGlkZUV2ZW50IiwiJG5leHRJbmRpY2F0b3IiLCJzbGlkRXZlbnQiLCJvZmZzZXRXaWR0aCIsImpvaW4iLCJhY3Rpb24iLCJjYXJvdXNlbCIsImNsaWNrSGFuZGxlciIsImhyZWYiLCIkdGFyZ2V0Iiwic2xpZGVJbmRleCIsIndpbmRvdyIsIiRjYXJvdXNlbCIsIkNvbGxhcHNlIiwiJHRyaWdnZXIiLCJpZCIsInRyYW5zaXRpb25pbmciLCJnZXRQYXJlbnQiLCJhZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MiLCJkaW1lbnNpb24iLCJoYXNXaWR0aCIsInNob3ciLCJhY3RpdmVzRGF0YSIsImFjdGl2ZXMiLCJzdGFydEV2ZW50IiwiY29tcGxldGUiLCJzY3JvbGxTaXplIiwiY2FtZWxDYXNlIiwiaGlkZSIsIm9mZnNldEhlaWdodCIsImkiLCJnZXRUYXJnZXRGcm9tVHJpZ2dlciIsImlzT3BlbiIsImNvbGxhcHNlIiwiYmFja2Ryb3AiLCJEcm9wZG93biIsImNsZWFyTWVudXMiLCJjb250YWlucyIsImlzQWN0aXZlIiwiaW5zZXJ0QWZ0ZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJkZXNjIiwiZHJvcGRvd24iLCJNb2RhbCIsIiRib2R5IiwiYm9keSIsIiRkaWFsb2ciLCIkYmFja2Ryb3AiLCJpc1Nob3duIiwib3JpZ2luYWxCb2R5UGFkIiwic2Nyb2xsYmFyV2lkdGgiLCJpZ25vcmVCYWNrZHJvcENsaWNrIiwiZml4ZWRDb250ZW50IiwicmVtb3RlIiwibG9hZCIsIkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04iLCJfcmVsYXRlZFRhcmdldCIsImNoZWNrU2Nyb2xsYmFyIiwic2V0U2Nyb2xsYmFyIiwiZXNjYXBlIiwicmVzaXplIiwiYXBwZW5kVG8iLCJzY3JvbGxUb3AiLCJhZGp1c3REaWFsb2ciLCJlbmZvcmNlRm9jdXMiLCJvZmYiLCJoaWRlTW9kYWwiLCJoYXMiLCJoYW5kbGVVcGRhdGUiLCJyZXNldEFkanVzdG1lbnRzIiwicmVzZXRTY3JvbGxiYXIiLCJyZW1vdmVCYWNrZHJvcCIsImFuaW1hdGUiLCJkb0FuaW1hdGUiLCJjdXJyZW50VGFyZ2V0IiwiZm9jdXMiLCJjYWxsYmFja1JlbW92ZSIsIm1vZGFsSXNPdmVyZmxvd2luZyIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsImNzcyIsInBhZGRpbmdMZWZ0IiwiYm9keUlzT3ZlcmZsb3dpbmciLCJwYWRkaW5nUmlnaHQiLCJmdWxsV2luZG93V2lkdGgiLCJpbm5lcldpZHRoIiwiZG9jdW1lbnRFbGVtZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInJpZ2h0IiwiTWF0aCIsImFicyIsImxlZnQiLCJjbGllbnRXaWR0aCIsIm1lYXN1cmVTY3JvbGxiYXIiLCJib2R5UGFkIiwicGFyc2VJbnQiLCJhY3R1YWxQYWRkaW5nIiwiY2FsY3VsYXRlZFBhZGRpbmciLCJwYXJzZUZsb2F0IiwicGFkZGluZyIsInJlbW92ZURhdGEiLCJzY3JvbGxEaXYiLCJjbGFzc05hbWUiLCJhcHBlbmQiLCJyZW1vdmVDaGlsZCIsIm1vZGFsIiwic2hvd0V2ZW50IiwiRElTQUxMT1dFRF9BVFRSSUJVVEVTIiwidXJpQXR0cnMiLCJBUklBX0FUVFJJQlVURV9QQVRURVJOIiwiRGVmYXVsdFdoaXRlbGlzdCIsImEiLCJhcmVhIiwiYiIsImJyIiwiY29sIiwiY29kZSIsImRpdiIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJpbWciLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJOYW1lIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImluQXJyYXkiLCJCb29sZWFuIiwibm9kZVZhbHVlIiwibWF0Y2giLCJyZWdFeHAiLCJmaWx0ZXIiLCJ2YWx1ZSIsIlJlZ0V4cCIsImwiLCJzYW5pdGl6ZUh0bWwiLCJ1bnNhZmVIdG1sIiwid2hpdGVMaXN0Iiwic2FuaXRpemVGbiIsImltcGxlbWVudGF0aW9uIiwiY3JlYXRlSFRNTERvY3VtZW50IiwiY3JlYXRlZERvY3VtZW50IiwiaW5uZXJIVE1MIiwid2hpdGVsaXN0S2V5cyIsIm1hcCIsImVsZW1lbnRzIiwibGVuIiwiZWxOYW1lIiwicGFyZW50Tm9kZSIsImF0dHJpYnV0ZUxpc3QiLCJhdHRyaWJ1dGVzIiwid2hpdGVsaXN0ZWRBdHRyaWJ1dGVzIiwiY29uY2F0IiwiaiIsImxlbjIiLCJyZW1vdmVBdHRyaWJ1dGUiLCJUb29sdGlwIiwiZW5hYmxlZCIsInRpbWVvdXQiLCJob3ZlclN0YXRlIiwiaW5TdGF0ZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJodG1sIiwiY29udGFpbmVyIiwidmlld3BvcnQiLCJzYW5pdGl6ZSIsImdldE9wdGlvbnMiLCIkdmlld3BvcnQiLCJpc0Z1bmN0aW9uIiwiY2xpY2siLCJob3ZlciIsImNvbnN0cnVjdG9yIiwidHJpZ2dlcnMiLCJldmVudEluIiwiZXZlbnRPdXQiLCJlbnRlciIsImxlYXZlIiwiX29wdGlvbnMiLCJmaXhUaXRsZSIsImdldERlZmF1bHRzIiwiZGF0YUF0dHJpYnV0ZXMiLCJkYXRhQXR0ciIsImhhc093blByb3BlcnR5IiwiZ2V0RGVsZWdhdGVPcHRpb25zIiwiZGVmYXVsdHMiLCJrZXkiLCJvYmoiLCJzZWxmIiwidGlwIiwiY2xlYXJUaW1lb3V0IiwiaXNJblN0YXRlVHJ1ZSIsImhhc0NvbnRlbnQiLCJpbkRvbSIsIm93bmVyRG9jdW1lbnQiLCIkdGlwIiwidGlwSWQiLCJnZXRVSUQiLCJzZXRDb250ZW50IiwiYXV0b1Rva2VuIiwiYXV0b1BsYWNlIiwidG9wIiwiZGlzcGxheSIsImdldFBvc2l0aW9uIiwiYWN0dWFsV2lkdGgiLCJhY3R1YWxIZWlnaHQiLCJvcmdQbGFjZW1lbnQiLCJ2aWV3cG9ydERpbSIsImJvdHRvbSIsIndpZHRoIiwiY2FsY3VsYXRlZE9mZnNldCIsImdldENhbGN1bGF0ZWRPZmZzZXQiLCJhcHBseVBsYWNlbWVudCIsInByZXZIb3ZlclN0YXRlIiwib2Zmc2V0IiwiaGVpZ2h0IiwibWFyZ2luVG9wIiwibWFyZ2luTGVmdCIsImlzTmFOIiwic2V0T2Zmc2V0IiwidXNpbmciLCJwcm9wcyIsInJvdW5kIiwiZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhIiwiaXNWZXJ0aWNhbCIsImFycm93RGVsdGEiLCJhcnJvd09mZnNldFBvc2l0aW9uIiwicmVwbGFjZUFycm93IiwiYXJyb3ciLCJnZXRUaXRsZSIsInRleHQiLCIkZSIsImlzQm9keSIsImVsUmVjdCIsImlzU3ZnIiwiU1ZHRWxlbWVudCIsImVsT2Zmc2V0Iiwic2Nyb2xsIiwib3V0ZXJEaW1zIiwidmlld3BvcnRQYWRkaW5nIiwidmlld3BvcnREaW1lbnNpb25zIiwidG9wRWRnZU9mZnNldCIsImJvdHRvbUVkZ2VPZmZzZXQiLCJsZWZ0RWRnZU9mZnNldCIsInJpZ2h0RWRnZU9mZnNldCIsIm8iLCJwcmVmaXgiLCJyYW5kb20iLCJnZXRFbGVtZW50QnlJZCIsIiRhcnJvdyIsImVuYWJsZSIsImRpc2FibGUiLCJ0b2dnbGVFbmFibGVkIiwiZGVzdHJveSIsInRvb2x0aXAiLCJQb3BvdmVyIiwiY29udGVudCIsImdldENvbnRlbnQiLCJ0eXBlQ29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCIkc2Nyb2xsRWxlbWVudCIsIm9mZnNldHMiLCJ0YXJnZXRzIiwiYWN0aXZlVGFyZ2V0IiwicHJvY2VzcyIsInJlZnJlc2giLCJnZXRTY3JvbGxIZWlnaHQiLCJtYXgiLCJvZmZzZXRNZXRob2QiLCJvZmZzZXRCYXNlIiwiaXNXaW5kb3ciLCIkaHJlZiIsInNvcnQiLCJwdXNoIiwibWF4U2Nyb2xsIiwiYWN0aXZhdGUiLCJjbGVhciIsInBhcmVudHMiLCJwYXJlbnRzVW50aWwiLCJzY3JvbGxzcHkiLCIkc3B5IiwiVGFiIiwiJHVsIiwiJHByZXZpb3VzIiwiaGlkZUV2ZW50IiwidGFiIiwiQWZmaXgiLCJjaGVja1Bvc2l0aW9uIiwiY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AiLCJhZmZpeGVkIiwidW5waW4iLCJwaW5uZWRPZmZzZXQiLCJSRVNFVCIsImdldFN0YXRlIiwib2Zmc2V0VG9wIiwib2Zmc2V0Qm90dG9tIiwicG9zaXRpb24iLCJ0YXJnZXRIZWlnaHQiLCJpbml0aWFsaXppbmciLCJjb2xsaWRlclRvcCIsImNvbGxpZGVySGVpZ2h0IiwiZ2V0UGlubmVkT2Zmc2V0IiwiYWZmaXgiLCJhZmZpeFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7O0FBTUEsSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFFBQU0sSUFBSUMsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxDQUFDLFVBQVVDLENBQVYsRUFBYTtBQUNaOztBQUNBLE1BQUlDLFVBQVVELEVBQUVFLEVBQUYsQ0FBS0MsTUFBTCxDQUFZQyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCQSxLQUExQixDQUFnQyxHQUFoQyxDQUFkO0FBQ0EsTUFBS0gsUUFBUSxDQUFSLElBQWEsQ0FBYixJQUFrQkEsUUFBUSxDQUFSLElBQWEsQ0FBaEMsSUFBdUNBLFFBQVEsQ0FBUixLQUFjLENBQWQsSUFBbUJBLFFBQVEsQ0FBUixLQUFjLENBQWpDLElBQXNDQSxRQUFRLENBQVIsSUFBYSxDQUExRixJQUFpR0EsUUFBUSxDQUFSLElBQWEsQ0FBbEgsRUFBc0g7QUFDcEgsVUFBTSxJQUFJRixLQUFKLENBQVUsMkZBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FOQSxDQU1DRCxNQU5ELENBQUQ7O0FBUUE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVRSxDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLFdBQVNLLGFBQVQsR0FBeUI7QUFDdkIsUUFBSUMsS0FBS0MsU0FBU0MsYUFBVCxDQUF1QixXQUF2QixDQUFUOztBQUVBLFFBQUlDLHFCQUFxQjtBQUN2QkMsd0JBQW1CLHFCQURJO0FBRXZCQyxxQkFBbUIsZUFGSTtBQUd2QkMsbUJBQW1CLCtCQUhJO0FBSXZCQyxrQkFBbUI7QUFKSSxLQUF6Qjs7QUFPQSxTQUFLLElBQUlDLElBQVQsSUFBaUJMLGtCQUFqQixFQUFxQztBQUNuQyxVQUFJSCxHQUFHUyxLQUFILENBQVNELElBQVQsTUFBbUJFLFNBQXZCLEVBQWtDO0FBQ2hDLGVBQU8sRUFBRUMsS0FBS1IsbUJBQW1CSyxJQUFuQixDQUFQLEVBQVA7QUFDRDtBQUNGOztBQUVELFdBQU8sS0FBUCxDQWhCdUIsQ0FnQlY7QUFDZDs7QUFFRDtBQUNBZCxJQUFFRSxFQUFGLENBQUtnQixvQkFBTCxHQUE0QixVQUFVQyxRQUFWLEVBQW9CO0FBQzlDLFFBQUlDLFNBQVMsS0FBYjtBQUNBLFFBQUlDLE1BQU0sSUFBVjtBQUNBckIsTUFBRSxJQUFGLEVBQVFzQixHQUFSLENBQVksaUJBQVosRUFBK0IsWUFBWTtBQUFFRixlQUFTLElBQVQ7QUFBZSxLQUE1RDtBQUNBLFFBQUlHLFdBQVcsU0FBWEEsUUFBVyxHQUFZO0FBQUUsVUFBSSxDQUFDSCxNQUFMLEVBQWFwQixFQUFFcUIsR0FBRixFQUFPRyxPQUFQLENBQWV4QixFQUFFeUIsT0FBRixDQUFVWixVQUFWLENBQXFCSSxHQUFwQztBQUEwQyxLQUFwRjtBQUNBUyxlQUFXSCxRQUFYLEVBQXFCSixRQUFyQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBUEQ7O0FBU0FuQixJQUFFLFlBQVk7QUFDWkEsTUFBRXlCLE9BQUYsQ0FBVVosVUFBVixHQUF1QlIsZUFBdkI7O0FBRUEsUUFBSSxDQUFDTCxFQUFFeUIsT0FBRixDQUFVWixVQUFmLEVBQTJCOztBQUUzQmIsTUFBRTJCLEtBQUYsQ0FBUUMsT0FBUixDQUFnQkMsZUFBaEIsR0FBa0M7QUFDaENDLGdCQUFVOUIsRUFBRXlCLE9BQUYsQ0FBVVosVUFBVixDQUFxQkksR0FEQztBQUVoQ2Msb0JBQWMvQixFQUFFeUIsT0FBRixDQUFVWixVQUFWLENBQXFCSSxHQUZIO0FBR2hDZSxjQUFRLGdCQUFVQyxDQUFWLEVBQWE7QUFDbkIsWUFBSWpDLEVBQUVpQyxFQUFFQyxNQUFKLEVBQVlDLEVBQVosQ0FBZSxJQUFmLENBQUosRUFBMEIsT0FBT0YsRUFBRUcsU0FBRixDQUFZQyxPQUFaLENBQW9CQyxLQUFwQixDQUEwQixJQUExQixFQUFnQ0MsU0FBaEMsQ0FBUDtBQUMzQjtBQUwrQixLQUFsQztBQU9ELEdBWkQ7QUFjRCxDQWpEQSxDQWlEQ3pDLE1BakRELENBQUQ7O0FBbURBOzs7Ozs7OztBQVNBLENBQUMsVUFBVUUsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxNQUFJd0MsVUFBVSx3QkFBZDtBQUNBLE1BQUlDLFFBQVUsU0FBVkEsS0FBVSxDQUFVbkMsRUFBVixFQUFjO0FBQzFCTixNQUFFTSxFQUFGLEVBQU1vQyxFQUFOLENBQVMsT0FBVCxFQUFrQkYsT0FBbEIsRUFBMkIsS0FBS0csS0FBaEM7QUFDRCxHQUZEOztBQUlBRixRQUFNRyxPQUFOLEdBQWdCLE9BQWhCOztBQUVBSCxRQUFNSSxtQkFBTixHQUE0QixHQUE1Qjs7QUFFQUosUUFBTUssU0FBTixDQUFnQkgsS0FBaEIsR0FBd0IsVUFBVVYsQ0FBVixFQUFhO0FBQ25DLFFBQUljLFFBQVcvQyxFQUFFLElBQUYsQ0FBZjtBQUNBLFFBQUlnRCxXQUFXRCxNQUFNRSxJQUFOLENBQVcsYUFBWCxDQUFmOztBQUVBLFFBQUksQ0FBQ0QsUUFBTCxFQUFlO0FBQ2JBLGlCQUFXRCxNQUFNRSxJQUFOLENBQVcsTUFBWCxDQUFYO0FBQ0FELGlCQUFXQSxZQUFZQSxTQUFTRSxPQUFULENBQWlCLGdCQUFqQixFQUFtQyxFQUFuQyxDQUF2QixDQUZhLENBRWlEO0FBQy9EOztBQUVERixlQUFjQSxhQUFhLEdBQWIsR0FBbUIsRUFBbkIsR0FBd0JBLFFBQXRDO0FBQ0EsUUFBSUcsVUFBVW5ELEVBQUVPLFFBQUYsRUFBWTZDLElBQVosQ0FBaUJKLFFBQWpCLENBQWQ7O0FBRUEsUUFBSWYsQ0FBSixFQUFPQSxFQUFFb0IsY0FBRjs7QUFFUCxRQUFJLENBQUNGLFFBQVFHLE1BQWIsRUFBcUI7QUFDbkJILGdCQUFVSixNQUFNUSxPQUFOLENBQWMsUUFBZCxDQUFWO0FBQ0Q7O0FBRURKLFlBQVEzQixPQUFSLENBQWdCUyxJQUFJakMsRUFBRXdELEtBQUYsQ0FBUSxnQkFBUixDQUFwQjs7QUFFQSxRQUFJdkIsRUFBRXdCLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCTixZQUFRTyxXQUFSLENBQW9CLElBQXBCOztBQUVBLGFBQVNDLGFBQVQsR0FBeUI7QUFDdkI7QUFDQVIsY0FBUVMsTUFBUixHQUFpQnBDLE9BQWpCLENBQXlCLGlCQUF6QixFQUE0Q3FDLE1BQTVDO0FBQ0Q7O0FBRUQ3RCxNQUFFeUIsT0FBRixDQUFVWixVQUFWLElBQXdCc0MsUUFBUVcsUUFBUixDQUFpQixNQUFqQixDQUF4QixHQUNFWCxRQUNHN0IsR0FESCxDQUNPLGlCQURQLEVBQzBCcUMsYUFEMUIsRUFFR3pDLG9CQUZILENBRXdCdUIsTUFBTUksbUJBRjlCLENBREYsR0FJRWMsZUFKRjtBQUtELEdBbENEOztBQXFDQTtBQUNBOztBQUVBLFdBQVNJLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBS0MsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSWxCLFFBQVEvQyxFQUFFLElBQUYsQ0FBWjtBQUNBLFVBQUlrRSxPQUFRbkIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLENBQVo7O0FBRUEsVUFBSSxDQUFDQSxJQUFMLEVBQVduQixNQUFNbUIsSUFBTixDQUFXLFVBQVgsRUFBd0JBLE9BQU8sSUFBSXpCLEtBQUosQ0FBVSxJQUFWLENBQS9CO0FBQ1gsVUFBSSxPQUFPdUIsTUFBUCxJQUFpQixRQUFyQixFQUErQkUsS0FBS0YsTUFBTCxFQUFhRyxJQUFiLENBQWtCcEIsS0FBbEI7QUFDaEMsS0FOTSxDQUFQO0FBT0Q7O0FBRUQsTUFBSXFCLE1BQU1wRSxFQUFFRSxFQUFGLENBQUttRSxLQUFmOztBQUVBckUsSUFBRUUsRUFBRixDQUFLbUUsS0FBTCxHQUF5Qk4sTUFBekI7QUFDQS9ELElBQUVFLEVBQUYsQ0FBS21FLEtBQUwsQ0FBV0MsV0FBWCxHQUF5QjdCLEtBQXpCOztBQUdBO0FBQ0E7O0FBRUF6QyxJQUFFRSxFQUFGLENBQUttRSxLQUFMLENBQVdFLFVBQVgsR0FBd0IsWUFBWTtBQUNsQ3ZFLE1BQUVFLEVBQUYsQ0FBS21FLEtBQUwsR0FBYUQsR0FBYjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQXBFLElBQUVPLFFBQUYsRUFBWW1DLEVBQVosQ0FBZSx5QkFBZixFQUEwQ0YsT0FBMUMsRUFBbURDLE1BQU1LLFNBQU4sQ0FBZ0JILEtBQW5FO0FBRUQsQ0FyRkEsQ0FxRkM3QyxNQXJGRCxDQUFEOztBQXVGQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVFLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSXdFLFNBQVMsU0FBVEEsTUFBUyxDQUFVQyxPQUFWLEVBQW1CQyxPQUFuQixFQUE0QjtBQUN2QyxTQUFLQyxRQUFMLEdBQWlCM0UsRUFBRXlFLE9BQUYsQ0FBakI7QUFDQSxTQUFLQyxPQUFMLEdBQWlCMUUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFULEVBQWFKLE9BQU9LLFFBQXBCLEVBQThCSCxPQUE5QixDQUFqQjtBQUNBLFNBQUtJLFNBQUwsR0FBaUIsS0FBakI7QUFDRCxHQUpEOztBQU1BTixTQUFPNUIsT0FBUCxHQUFrQixPQUFsQjs7QUFFQTRCLFNBQU9LLFFBQVAsR0FBa0I7QUFDaEJFLGlCQUFhO0FBREcsR0FBbEI7O0FBSUFQLFNBQU8xQixTQUFQLENBQWlCa0MsUUFBakIsR0FBNEIsVUFBVUMsS0FBVixFQUFpQjtBQUMzQyxRQUFJQyxJQUFPLFVBQVg7QUFDQSxRQUFJN0QsTUFBTyxLQUFLc0QsUUFBaEI7QUFDQSxRQUFJUSxNQUFPOUQsSUFBSWMsRUFBSixDQUFPLE9BQVAsSUFBa0IsS0FBbEIsR0FBMEIsTUFBckM7QUFDQSxRQUFJK0IsT0FBTzdDLElBQUk2QyxJQUFKLEVBQVg7O0FBRUFlLGFBQVMsTUFBVDs7QUFFQSxRQUFJZixLQUFLa0IsU0FBTCxJQUFrQixJQUF0QixFQUE0Qi9ELElBQUk2QyxJQUFKLENBQVMsV0FBVCxFQUFzQjdDLElBQUk4RCxHQUFKLEdBQXRCOztBQUU1QjtBQUNBekQsZUFBVzFCLEVBQUVxRixLQUFGLENBQVEsWUFBWTtBQUM3QmhFLFVBQUk4RCxHQUFKLEVBQVNqQixLQUFLZSxLQUFMLEtBQWUsSUFBZixHQUFzQixLQUFLUCxPQUFMLENBQWFPLEtBQWIsQ0FBdEIsR0FBNENmLEtBQUtlLEtBQUwsQ0FBckQ7O0FBRUEsVUFBSUEsU0FBUyxhQUFiLEVBQTRCO0FBQzFCLGFBQUtILFNBQUwsR0FBaUIsSUFBakI7QUFDQXpELFlBQUlpRSxRQUFKLENBQWFKLENBQWIsRUFBZ0JqQyxJQUFoQixDQUFxQmlDLENBQXJCLEVBQXdCQSxDQUF4QixFQUEyQkssSUFBM0IsQ0FBZ0NMLENBQWhDLEVBQW1DLElBQW5DO0FBQ0QsT0FIRCxNQUdPLElBQUksS0FBS0osU0FBVCxFQUFvQjtBQUN6QixhQUFLQSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0F6RCxZQUFJcUMsV0FBSixDQUFnQndCLENBQWhCLEVBQW1CTSxVQUFuQixDQUE4Qk4sQ0FBOUIsRUFBaUNLLElBQWpDLENBQXNDTCxDQUF0QyxFQUF5QyxLQUF6QztBQUNEO0FBQ0YsS0FWVSxFQVVSLElBVlEsQ0FBWCxFQVVVLENBVlY7QUFXRCxHQXRCRDs7QUF3QkFWLFNBQU8xQixTQUFQLENBQWlCMkMsTUFBakIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJQyxVQUFVLElBQWQ7QUFDQSxRQUFJdkMsVUFBVSxLQUFLd0IsUUFBTCxDQUFjcEIsT0FBZCxDQUFzQix5QkFBdEIsQ0FBZDs7QUFFQSxRQUFJSixRQUFRRyxNQUFaLEVBQW9CO0FBQ2xCLFVBQUlxQyxTQUFTLEtBQUtoQixRQUFMLENBQWN2QixJQUFkLENBQW1CLE9BQW5CLENBQWI7QUFDQSxVQUFJdUMsT0FBT0osSUFBUCxDQUFZLE1BQVosS0FBdUIsT0FBM0IsRUFBb0M7QUFDbEMsWUFBSUksT0FBT0osSUFBUCxDQUFZLFNBQVosQ0FBSixFQUE0QkcsVUFBVSxLQUFWO0FBQzVCdkMsZ0JBQVFDLElBQVIsQ0FBYSxTQUFiLEVBQXdCTSxXQUF4QixDQUFvQyxRQUFwQztBQUNBLGFBQUtpQixRQUFMLENBQWNXLFFBQWQsQ0FBdUIsUUFBdkI7QUFDRCxPQUpELE1BSU8sSUFBSUssT0FBT0osSUFBUCxDQUFZLE1BQVosS0FBdUIsVUFBM0IsRUFBdUM7QUFDNUMsWUFBS0ksT0FBT0osSUFBUCxDQUFZLFNBQVosQ0FBRCxLQUE2QixLQUFLWixRQUFMLENBQWNiLFFBQWQsQ0FBdUIsUUFBdkIsQ0FBakMsRUFBbUU0QixVQUFVLEtBQVY7QUFDbkUsYUFBS2YsUUFBTCxDQUFjaUIsV0FBZCxDQUEwQixRQUExQjtBQUNEO0FBQ0RELGFBQU9KLElBQVAsQ0FBWSxTQUFaLEVBQXVCLEtBQUtaLFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixRQUF2QixDQUF2QjtBQUNBLFVBQUk0QixPQUFKLEVBQWFDLE9BQU9uRSxPQUFQLENBQWUsUUFBZjtBQUNkLEtBWkQsTUFZTztBQUNMLFdBQUttRCxRQUFMLENBQWMxQixJQUFkLENBQW1CLGNBQW5CLEVBQW1DLENBQUMsS0FBSzBCLFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixRQUF2QixDQUFwQztBQUNBLFdBQUthLFFBQUwsQ0FBY2lCLFdBQWQsQ0FBMEIsUUFBMUI7QUFDRDtBQUNGLEdBcEJEOztBQXVCQTtBQUNBOztBQUVBLFdBQVM3QixNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUtDLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlsQixRQUFVL0MsRUFBRSxJQUFGLENBQWQ7QUFDQSxVQUFJa0UsT0FBVW5CLE1BQU1tQixJQUFOLENBQVcsV0FBWCxDQUFkO0FBQ0EsVUFBSVEsVUFBVSxRQUFPVixNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUEzQzs7QUFFQSxVQUFJLENBQUNFLElBQUwsRUFBV25CLE1BQU1tQixJQUFOLENBQVcsV0FBWCxFQUF5QkEsT0FBTyxJQUFJTSxNQUFKLENBQVcsSUFBWCxFQUFpQkUsT0FBakIsQ0FBaEM7O0FBRVgsVUFBSVYsVUFBVSxRQUFkLEVBQXdCRSxLQUFLdUIsTUFBTCxHQUF4QixLQUNLLElBQUl6QixNQUFKLEVBQVlFLEtBQUtjLFFBQUwsQ0FBY2hCLE1BQWQ7QUFDbEIsS0FUTSxDQUFQO0FBVUQ7O0FBRUQsTUFBSUksTUFBTXBFLEVBQUVFLEVBQUYsQ0FBSzJGLE1BQWY7O0FBRUE3RixJQUFFRSxFQUFGLENBQUsyRixNQUFMLEdBQTBCOUIsTUFBMUI7QUFDQS9ELElBQUVFLEVBQUYsQ0FBSzJGLE1BQUwsQ0FBWXZCLFdBQVosR0FBMEJFLE1BQTFCOztBQUdBO0FBQ0E7O0FBRUF4RSxJQUFFRSxFQUFGLENBQUsyRixNQUFMLENBQVl0QixVQUFaLEdBQXlCLFlBQVk7QUFDbkN2RSxNQUFFRSxFQUFGLENBQUsyRixNQUFMLEdBQWN6QixHQUFkO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBcEUsSUFBRU8sUUFBRixFQUNHbUMsRUFESCxDQUNNLDBCQUROLEVBQ2tDLHlCQURsQyxFQUM2RCxVQUFVVCxDQUFWLEVBQWE7QUFDdEUsUUFBSTZELE9BQU85RixFQUFFaUMsRUFBRUMsTUFBSixFQUFZcUIsT0FBWixDQUFvQixNQUFwQixDQUFYO0FBQ0FRLFdBQU9JLElBQVAsQ0FBWTJCLElBQVosRUFBa0IsUUFBbEI7QUFDQSxRQUFJLENBQUU5RixFQUFFaUMsRUFBRUMsTUFBSixFQUFZQyxFQUFaLENBQWUsNkNBQWYsQ0FBTixFQUFzRTtBQUNwRTtBQUNBRixRQUFFb0IsY0FBRjtBQUNBO0FBQ0EsVUFBSXlDLEtBQUszRCxFQUFMLENBQVEsY0FBUixDQUFKLEVBQTZCMkQsS0FBS3RFLE9BQUwsQ0FBYSxPQUFiLEVBQTdCLEtBQ0tzRSxLQUFLMUMsSUFBTCxDQUFVLDhCQUFWLEVBQTBDMkMsS0FBMUMsR0FBa0R2RSxPQUFsRCxDQUEwRCxPQUExRDtBQUNOO0FBQ0YsR0FYSCxFQVlHa0IsRUFaSCxDQVlNLGtEQVpOLEVBWTBELHlCQVoxRCxFQVlxRixVQUFVVCxDQUFWLEVBQWE7QUFDOUZqQyxNQUFFaUMsRUFBRUMsTUFBSixFQUFZcUIsT0FBWixDQUFvQixNQUFwQixFQUE0QnFDLFdBQTVCLENBQXdDLE9BQXhDLEVBQWlELGVBQWVJLElBQWYsQ0FBb0IvRCxFQUFFZ0UsSUFBdEIsQ0FBakQ7QUFDRCxHQWRIO0FBZ0JELENBbkhBLENBbUhDbkcsTUFuSEQsQ0FBRDs7QUFxSEE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVRSxDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUlrRyxXQUFXLFNBQVhBLFFBQVcsQ0FBVXpCLE9BQVYsRUFBbUJDLE9BQW5CLEVBQTRCO0FBQ3pDLFNBQUtDLFFBQUwsR0FBbUIzRSxFQUFFeUUsT0FBRixDQUFuQjtBQUNBLFNBQUswQixXQUFMLEdBQW1CLEtBQUt4QixRQUFMLENBQWN2QixJQUFkLENBQW1CLHNCQUFuQixDQUFuQjtBQUNBLFNBQUtzQixPQUFMLEdBQW1CQSxPQUFuQjtBQUNBLFNBQUswQixNQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsT0FBTCxHQUFtQixJQUFuQjtBQUNBLFNBQUtDLFFBQUwsR0FBbUIsSUFBbkI7QUFDQSxTQUFLQyxPQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFtQixJQUFuQjs7QUFFQSxTQUFLOUIsT0FBTCxDQUFhK0IsUUFBYixJQUF5QixLQUFLOUIsUUFBTCxDQUFjakMsRUFBZCxDQUFpQixxQkFBakIsRUFBd0MxQyxFQUFFcUYsS0FBRixDQUFRLEtBQUtxQixPQUFiLEVBQXNCLElBQXRCLENBQXhDLENBQXpCOztBQUVBLFNBQUtoQyxPQUFMLENBQWFpQyxLQUFiLElBQXNCLE9BQXRCLElBQWlDLEVBQUUsa0JBQWtCcEcsU0FBU3FHLGVBQTdCLENBQWpDLElBQWtGLEtBQUtqQyxRQUFMLENBQy9FakMsRUFEK0UsQ0FDNUUsd0JBRDRFLEVBQ2xEMUMsRUFBRXFGLEtBQUYsQ0FBUSxLQUFLc0IsS0FBYixFQUFvQixJQUFwQixDQURrRCxFQUUvRWpFLEVBRitFLENBRTVFLHdCQUY0RSxFQUVsRDFDLEVBQUVxRixLQUFGLENBQVEsS0FBS3dCLEtBQWIsRUFBb0IsSUFBcEIsQ0FGa0QsQ0FBbEY7QUFHRCxHQWZEOztBQWlCQVgsV0FBU3RELE9BQVQsR0FBb0IsT0FBcEI7O0FBRUFzRCxXQUFTckQsbUJBQVQsR0FBK0IsR0FBL0I7O0FBRUFxRCxXQUFTckIsUUFBVCxHQUFvQjtBQUNsQnlCLGNBQVUsSUFEUTtBQUVsQkssV0FBTyxPQUZXO0FBR2xCRyxVQUFNLElBSFk7QUFJbEJMLGNBQVU7QUFKUSxHQUFwQjs7QUFPQVAsV0FBU3BELFNBQVQsQ0FBbUI0RCxPQUFuQixHQUE2QixVQUFVekUsQ0FBVixFQUFhO0FBQ3hDLFFBQUksa0JBQWtCK0QsSUFBbEIsQ0FBdUIvRCxFQUFFQyxNQUFGLENBQVM2RSxPQUFoQyxDQUFKLEVBQThDO0FBQzlDLFlBQVE5RSxFQUFFK0UsS0FBVjtBQUNFLFdBQUssRUFBTDtBQUFTLGFBQUtDLElBQUwsR0FBYTtBQUN0QixXQUFLLEVBQUw7QUFBUyxhQUFLQyxJQUFMLEdBQWE7QUFDdEI7QUFBUztBQUhYOztBQU1BakYsTUFBRW9CLGNBQUY7QUFDRCxHQVREOztBQVdBNkMsV0FBU3BELFNBQVQsQ0FBbUIrRCxLQUFuQixHQUEyQixVQUFVNUUsQ0FBVixFQUFhO0FBQ3RDQSxVQUFNLEtBQUttRSxNQUFMLEdBQWMsS0FBcEI7O0FBRUEsU0FBS0UsUUFBTCxJQUFpQmEsY0FBYyxLQUFLYixRQUFuQixDQUFqQjs7QUFFQSxTQUFLNUIsT0FBTCxDQUFhNEIsUUFBYixJQUNLLENBQUMsS0FBS0YsTUFEWCxLQUVNLEtBQUtFLFFBQUwsR0FBZ0JjLFlBQVlwSCxFQUFFcUYsS0FBRixDQUFRLEtBQUs2QixJQUFiLEVBQW1CLElBQW5CLENBQVosRUFBc0MsS0FBS3hDLE9BQUwsQ0FBYTRCLFFBQW5ELENBRnRCOztBQUlBLFdBQU8sSUFBUDtBQUNELEdBVkQ7O0FBWUFKLFdBQVNwRCxTQUFULENBQW1CdUUsWUFBbkIsR0FBa0MsVUFBVUMsSUFBVixFQUFnQjtBQUNoRCxTQUFLZCxNQUFMLEdBQWNjLEtBQUtDLE1BQUwsR0FBY0MsUUFBZCxDQUF1QixPQUF2QixDQUFkO0FBQ0EsV0FBTyxLQUFLaEIsTUFBTCxDQUFZaUIsS0FBWixDQUFrQkgsUUFBUSxLQUFLZixPQUEvQixDQUFQO0FBQ0QsR0FIRDs7QUFLQUwsV0FBU3BELFNBQVQsQ0FBbUI0RSxtQkFBbkIsR0FBeUMsVUFBVUMsU0FBVixFQUFxQkMsTUFBckIsRUFBNkI7QUFDcEUsUUFBSUMsY0FBYyxLQUFLUixZQUFMLENBQWtCTyxNQUFsQixDQUFsQjtBQUNBLFFBQUlFLFdBQVlILGFBQWEsTUFBYixJQUF1QkUsZ0JBQWdCLENBQXhDLElBQ0NGLGFBQWEsTUFBYixJQUF1QkUsZUFBZ0IsS0FBS3JCLE1BQUwsQ0FBWWxELE1BQVosR0FBcUIsQ0FENUU7QUFFQSxRQUFJd0UsWUFBWSxDQUFDLEtBQUtwRCxPQUFMLENBQWFvQyxJQUE5QixFQUFvQyxPQUFPYyxNQUFQO0FBQ3BDLFFBQUlHLFFBQVFKLGFBQWEsTUFBYixHQUFzQixDQUFDLENBQXZCLEdBQTJCLENBQXZDO0FBQ0EsUUFBSUssWUFBWSxDQUFDSCxjQUFjRSxLQUFmLElBQXdCLEtBQUt2QixNQUFMLENBQVlsRCxNQUFwRDtBQUNBLFdBQU8sS0FBS2tELE1BQUwsQ0FBWXlCLEVBQVosQ0FBZUQsU0FBZixDQUFQO0FBQ0QsR0FSRDs7QUFVQTlCLFdBQVNwRCxTQUFULENBQW1Cb0YsRUFBbkIsR0FBd0IsVUFBVUMsR0FBVixFQUFlO0FBQ3JDLFFBQUlDLE9BQWMsSUFBbEI7QUFDQSxRQUFJUCxjQUFjLEtBQUtSLFlBQUwsQ0FBa0IsS0FBS2QsT0FBTCxHQUFlLEtBQUs1QixRQUFMLENBQWN2QixJQUFkLENBQW1CLGNBQW5CLENBQWpDLENBQWxCOztBQUVBLFFBQUkrRSxNQUFPLEtBQUszQixNQUFMLENBQVlsRCxNQUFaLEdBQXFCLENBQTVCLElBQWtDNkUsTUFBTSxDQUE1QyxFQUErQzs7QUFFL0MsUUFBSSxLQUFLOUIsT0FBVCxFQUF3QixPQUFPLEtBQUsxQixRQUFMLENBQWNyRCxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxZQUFZO0FBQUU4RyxXQUFLRixFQUFMLENBQVFDLEdBQVI7QUFBYyxLQUFsRSxDQUFQLENBTmEsQ0FNOEQ7QUFDbkcsUUFBSU4sZUFBZU0sR0FBbkIsRUFBd0IsT0FBTyxLQUFLeEIsS0FBTCxHQUFhRSxLQUFiLEVBQVA7O0FBRXhCLFdBQU8sS0FBS3dCLEtBQUwsQ0FBV0YsTUFBTU4sV0FBTixHQUFvQixNQUFwQixHQUE2QixNQUF4QyxFQUFnRCxLQUFLckIsTUFBTCxDQUFZeUIsRUFBWixDQUFlRSxHQUFmLENBQWhELENBQVA7QUFDRCxHQVZEOztBQVlBakMsV0FBU3BELFNBQVQsQ0FBbUI2RCxLQUFuQixHQUEyQixVQUFVMUUsQ0FBVixFQUFhO0FBQ3RDQSxVQUFNLEtBQUttRSxNQUFMLEdBQWMsSUFBcEI7O0FBRUEsUUFBSSxLQUFLekIsUUFBTCxDQUFjdkIsSUFBZCxDQUFtQixjQUFuQixFQUFtQ0UsTUFBbkMsSUFBNkN0RCxFQUFFeUIsT0FBRixDQUFVWixVQUEzRCxFQUF1RTtBQUNyRSxXQUFLOEQsUUFBTCxDQUFjbkQsT0FBZCxDQUFzQnhCLEVBQUV5QixPQUFGLENBQVVaLFVBQVYsQ0FBcUJJLEdBQTNDO0FBQ0EsV0FBSzRGLEtBQUwsQ0FBVyxJQUFYO0FBQ0Q7O0FBRUQsU0FBS1AsUUFBTCxHQUFnQmEsY0FBYyxLQUFLYixRQUFuQixDQUFoQjs7QUFFQSxXQUFPLElBQVA7QUFDRCxHQVhEOztBQWFBSixXQUFTcEQsU0FBVCxDQUFtQm9FLElBQW5CLEdBQTBCLFlBQVk7QUFDcEMsUUFBSSxLQUFLYixPQUFULEVBQWtCO0FBQ2xCLFdBQU8sS0FBS2dDLEtBQUwsQ0FBVyxNQUFYLENBQVA7QUFDRCxHQUhEOztBQUtBbkMsV0FBU3BELFNBQVQsQ0FBbUJtRSxJQUFuQixHQUEwQixZQUFZO0FBQ3BDLFFBQUksS0FBS1osT0FBVCxFQUFrQjtBQUNsQixXQUFPLEtBQUtnQyxLQUFMLENBQVcsTUFBWCxDQUFQO0FBQ0QsR0FIRDs7QUFLQW5DLFdBQVNwRCxTQUFULENBQW1CdUYsS0FBbkIsR0FBMkIsVUFBVXBDLElBQVYsRUFBZ0JpQixJQUFoQixFQUFzQjtBQUMvQyxRQUFJWCxVQUFZLEtBQUs1QixRQUFMLENBQWN2QixJQUFkLENBQW1CLGNBQW5CLENBQWhCO0FBQ0EsUUFBSWtGLFFBQVlwQixRQUFRLEtBQUtRLG1CQUFMLENBQXlCekIsSUFBekIsRUFBK0JNLE9BQS9CLENBQXhCO0FBQ0EsUUFBSWdDLFlBQVksS0FBS2pDLFFBQXJCO0FBQ0EsUUFBSXFCLFlBQVkxQixRQUFRLE1BQVIsR0FBaUIsTUFBakIsR0FBMEIsT0FBMUM7QUFDQSxRQUFJbUMsT0FBWSxJQUFoQjs7QUFFQSxRQUFJRSxNQUFNeEUsUUFBTixDQUFlLFFBQWYsQ0FBSixFQUE4QixPQUFRLEtBQUt1QyxPQUFMLEdBQWUsS0FBdkI7O0FBRTlCLFFBQUltQyxnQkFBZ0JGLE1BQU0sQ0FBTixDQUFwQjtBQUNBLFFBQUlHLGFBQWF6SSxFQUFFd0QsS0FBRixDQUFRLG1CQUFSLEVBQTZCO0FBQzVDZ0YscUJBQWVBLGFBRDZCO0FBRTVDYixpQkFBV0E7QUFGaUMsS0FBN0IsQ0FBakI7QUFJQSxTQUFLaEQsUUFBTCxDQUFjbkQsT0FBZCxDQUFzQmlILFVBQXRCO0FBQ0EsUUFBSUEsV0FBV2hGLGtCQUFYLEVBQUosRUFBcUM7O0FBRXJDLFNBQUs0QyxPQUFMLEdBQWUsSUFBZjs7QUFFQWtDLGlCQUFhLEtBQUs1QixLQUFMLEVBQWI7O0FBRUEsUUFBSSxLQUFLUixXQUFMLENBQWlCN0MsTUFBckIsRUFBNkI7QUFDM0IsV0FBSzZDLFdBQUwsQ0FBaUIvQyxJQUFqQixDQUFzQixTQUF0QixFQUFpQ00sV0FBakMsQ0FBNkMsUUFBN0M7QUFDQSxVQUFJZ0YsaUJBQWlCMUksRUFBRSxLQUFLbUcsV0FBTCxDQUFpQnFCLFFBQWpCLEdBQTRCLEtBQUtILFlBQUwsQ0FBa0JpQixLQUFsQixDQUE1QixDQUFGLENBQXJCO0FBQ0FJLHdCQUFrQkEsZUFBZXBELFFBQWYsQ0FBd0IsUUFBeEIsQ0FBbEI7QUFDRDs7QUFFRCxRQUFJcUQsWUFBWTNJLEVBQUV3RCxLQUFGLENBQVEsa0JBQVIsRUFBNEIsRUFBRWdGLGVBQWVBLGFBQWpCLEVBQWdDYixXQUFXQSxTQUEzQyxFQUE1QixDQUFoQixDQTNCK0MsQ0EyQnFEO0FBQ3BHLFFBQUkzSCxFQUFFeUIsT0FBRixDQUFVWixVQUFWLElBQXdCLEtBQUs4RCxRQUFMLENBQWNiLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBNUIsRUFBNkQ7QUFDM0R3RSxZQUFNaEQsUUFBTixDQUFlVyxJQUFmO0FBQ0EsVUFBSSxRQUFPcUMsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFqQixJQUE2QkEsTUFBTWhGLE1BQXZDLEVBQStDO0FBQzdDZ0YsY0FBTSxDQUFOLEVBQVNNLFdBQVQsQ0FENkMsQ0FDeEI7QUFDdEI7QUFDRHJDLGNBQVFqQixRQUFSLENBQWlCcUMsU0FBakI7QUFDQVcsWUFBTWhELFFBQU4sQ0FBZXFDLFNBQWY7QUFDQXBCLGNBQ0dqRixHQURILENBQ08saUJBRFAsRUFDMEIsWUFBWTtBQUNsQ2dILGNBQU01RSxXQUFOLENBQWtCLENBQUN1QyxJQUFELEVBQU8wQixTQUFQLEVBQWtCa0IsSUFBbEIsQ0FBdUIsR0FBdkIsQ0FBbEIsRUFBK0N2RCxRQUEvQyxDQUF3RCxRQUF4RDtBQUNBaUIsZ0JBQVE3QyxXQUFSLENBQW9CLENBQUMsUUFBRCxFQUFXaUUsU0FBWCxFQUFzQmtCLElBQXRCLENBQTJCLEdBQTNCLENBQXBCO0FBQ0FULGFBQUsvQixPQUFMLEdBQWUsS0FBZjtBQUNBM0UsbUJBQVcsWUFBWTtBQUNyQjBHLGVBQUt6RCxRQUFMLENBQWNuRCxPQUFkLENBQXNCbUgsU0FBdEI7QUFDRCxTQUZELEVBRUcsQ0FGSDtBQUdELE9BUkgsRUFTR3pILG9CQVRILENBU3dCZ0YsU0FBU3JELG1CQVRqQztBQVVELEtBakJELE1BaUJPO0FBQ0wwRCxjQUFRN0MsV0FBUixDQUFvQixRQUFwQjtBQUNBNEUsWUFBTWhELFFBQU4sQ0FBZSxRQUFmO0FBQ0EsV0FBS2UsT0FBTCxHQUFlLEtBQWY7QUFDQSxXQUFLMUIsUUFBTCxDQUFjbkQsT0FBZCxDQUFzQm1ILFNBQXRCO0FBQ0Q7O0FBRURKLGlCQUFhLEtBQUsxQixLQUFMLEVBQWI7O0FBRUEsV0FBTyxJQUFQO0FBQ0QsR0F2REQ7O0FBMERBO0FBQ0E7O0FBRUEsV0FBUzlDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBS0MsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSWxCLFFBQVUvQyxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUlrRSxPQUFVbkIsTUFBTW1CLElBQU4sQ0FBVyxhQUFYLENBQWQ7QUFDQSxVQUFJUSxVQUFVMUUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFULEVBQWFzQixTQUFTckIsUUFBdEIsRUFBZ0M5QixNQUFNbUIsSUFBTixFQUFoQyxFQUE4QyxRQUFPRixNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUEzRSxDQUFkO0FBQ0EsVUFBSThFLFNBQVUsT0FBTzlFLE1BQVAsSUFBaUIsUUFBakIsR0FBNEJBLE1BQTVCLEdBQXFDVSxRQUFRMkQsS0FBM0Q7O0FBRUEsVUFBSSxDQUFDbkUsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxhQUFYLEVBQTJCQSxPQUFPLElBQUlnQyxRQUFKLENBQWEsSUFBYixFQUFtQnhCLE9BQW5CLENBQWxDO0FBQ1gsVUFBSSxPQUFPVixNQUFQLElBQWlCLFFBQXJCLEVBQStCRSxLQUFLZ0UsRUFBTCxDQUFRbEUsTUFBUixFQUEvQixLQUNLLElBQUk4RSxNQUFKLEVBQVk1RSxLQUFLNEUsTUFBTCxJQUFaLEtBQ0EsSUFBSXBFLFFBQVE0QixRQUFaLEVBQXNCcEMsS0FBS3lDLEtBQUwsR0FBYUUsS0FBYjtBQUM1QixLQVZNLENBQVA7QUFXRDs7QUFFRCxNQUFJekMsTUFBTXBFLEVBQUVFLEVBQUYsQ0FBSzZJLFFBQWY7O0FBRUEvSSxJQUFFRSxFQUFGLENBQUs2SSxRQUFMLEdBQTRCaEYsTUFBNUI7QUFDQS9ELElBQUVFLEVBQUYsQ0FBSzZJLFFBQUwsQ0FBY3pFLFdBQWQsR0FBNEI0QixRQUE1Qjs7QUFHQTtBQUNBOztBQUVBbEcsSUFBRUUsRUFBRixDQUFLNkksUUFBTCxDQUFjeEUsVUFBZCxHQUEyQixZQUFZO0FBQ3JDdkUsTUFBRUUsRUFBRixDQUFLNkksUUFBTCxHQUFnQjNFLEdBQWhCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBLE1BQUk0RSxlQUFlLFNBQWZBLFlBQWUsQ0FBVS9HLENBQVYsRUFBYTtBQUM5QixRQUFJYyxRQUFVL0MsRUFBRSxJQUFGLENBQWQ7QUFDQSxRQUFJaUosT0FBVWxHLE1BQU1FLElBQU4sQ0FBVyxNQUFYLENBQWQ7QUFDQSxRQUFJZ0csSUFBSixFQUFVO0FBQ1JBLGFBQU9BLEtBQUsvRixPQUFMLENBQWEsZ0JBQWIsRUFBK0IsRUFBL0IsQ0FBUCxDQURRLENBQ2tDO0FBQzNDOztBQUVELFFBQUloQixTQUFVYSxNQUFNRSxJQUFOLENBQVcsYUFBWCxLQUE2QmdHLElBQTNDO0FBQ0EsUUFBSUMsVUFBVWxKLEVBQUVPLFFBQUYsRUFBWTZDLElBQVosQ0FBaUJsQixNQUFqQixDQUFkOztBQUVBLFFBQUksQ0FBQ2dILFFBQVFwRixRQUFSLENBQWlCLFVBQWpCLENBQUwsRUFBbUM7O0FBRW5DLFFBQUlZLFVBQVUxRSxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYXNFLFFBQVFoRixJQUFSLEVBQWIsRUFBNkJuQixNQUFNbUIsSUFBTixFQUE3QixDQUFkO0FBQ0EsUUFBSWlGLGFBQWFwRyxNQUFNRSxJQUFOLENBQVcsZUFBWCxDQUFqQjtBQUNBLFFBQUlrRyxVQUFKLEVBQWdCekUsUUFBUTRCLFFBQVIsR0FBbUIsS0FBbkI7O0FBRWhCdkMsV0FBT0ksSUFBUCxDQUFZK0UsT0FBWixFQUFxQnhFLE9BQXJCOztBQUVBLFFBQUl5RSxVQUFKLEVBQWdCO0FBQ2RELGNBQVFoRixJQUFSLENBQWEsYUFBYixFQUE0QmdFLEVBQTVCLENBQStCaUIsVUFBL0I7QUFDRDs7QUFFRGxILE1BQUVvQixjQUFGO0FBQ0QsR0F2QkQ7O0FBeUJBckQsSUFBRU8sUUFBRixFQUNHbUMsRUFESCxDQUNNLDRCQUROLEVBQ29DLGNBRHBDLEVBQ29Ec0csWUFEcEQsRUFFR3RHLEVBRkgsQ0FFTSw0QkFGTixFQUVvQyxpQkFGcEMsRUFFdURzRyxZQUZ2RDs7QUFJQWhKLElBQUVvSixNQUFGLEVBQVUxRyxFQUFWLENBQWEsTUFBYixFQUFxQixZQUFZO0FBQy9CMUMsTUFBRSx3QkFBRixFQUE0QmlFLElBQTVCLENBQWlDLFlBQVk7QUFDM0MsVUFBSW9GLFlBQVlySixFQUFFLElBQUYsQ0FBaEI7QUFDQStELGFBQU9JLElBQVAsQ0FBWWtGLFNBQVosRUFBdUJBLFVBQVVuRixJQUFWLEVBQXZCO0FBQ0QsS0FIRDtBQUlELEdBTEQ7QUFPRCxDQTVPQSxDQTRPQ3BFLE1BNU9ELENBQUQ7O0FBOE9BOzs7Ozs7OztBQVFBOztBQUVBLENBQUMsVUFBVUUsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxNQUFJc0osV0FBVyxTQUFYQSxRQUFXLENBQVU3RSxPQUFWLEVBQW1CQyxPQUFuQixFQUE0QjtBQUN6QyxTQUFLQyxRQUFMLEdBQXFCM0UsRUFBRXlFLE9BQUYsQ0FBckI7QUFDQSxTQUFLQyxPQUFMLEdBQXFCMUUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFULEVBQWEwRSxTQUFTekUsUUFBdEIsRUFBZ0NILE9BQWhDLENBQXJCO0FBQ0EsU0FBSzZFLFFBQUwsR0FBcUJ2SixFQUFFLHFDQUFxQ3lFLFFBQVErRSxFQUE3QyxHQUFrRCxLQUFsRCxHQUNBLHlDQURBLEdBQzRDL0UsUUFBUStFLEVBRHBELEdBQ3lELElBRDNELENBQXJCO0FBRUEsU0FBS0MsYUFBTCxHQUFxQixJQUFyQjs7QUFFQSxRQUFJLEtBQUsvRSxPQUFMLENBQWE2QyxNQUFqQixFQUF5QjtBQUN2QixXQUFLcEUsT0FBTCxHQUFlLEtBQUt1RyxTQUFMLEVBQWY7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLQyx3QkFBTCxDQUE4QixLQUFLaEYsUUFBbkMsRUFBNkMsS0FBSzRFLFFBQWxEO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLN0UsT0FBTCxDQUFhZSxNQUFqQixFQUF5QixLQUFLQSxNQUFMO0FBQzFCLEdBZEQ7O0FBZ0JBNkQsV0FBUzFHLE9BQVQsR0FBb0IsT0FBcEI7O0FBRUEwRyxXQUFTekcsbUJBQVQsR0FBK0IsR0FBL0I7O0FBRUF5RyxXQUFTekUsUUFBVCxHQUFvQjtBQUNsQlksWUFBUTtBQURVLEdBQXBCOztBQUlBNkQsV0FBU3hHLFNBQVQsQ0FBbUI4RyxTQUFuQixHQUErQixZQUFZO0FBQ3pDLFFBQUlDLFdBQVcsS0FBS2xGLFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixPQUF2QixDQUFmO0FBQ0EsV0FBTytGLFdBQVcsT0FBWCxHQUFxQixRQUE1QjtBQUNELEdBSEQ7O0FBS0FQLFdBQVN4RyxTQUFULENBQW1CZ0gsSUFBbkIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJLEtBQUtMLGFBQUwsSUFBc0IsS0FBSzlFLFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixJQUF2QixDQUExQixFQUF3RDs7QUFFeEQsUUFBSWlHLFdBQUo7QUFDQSxRQUFJQyxVQUFVLEtBQUs3RyxPQUFMLElBQWdCLEtBQUtBLE9BQUwsQ0FBYXFFLFFBQWIsQ0FBc0IsUUFBdEIsRUFBZ0NBLFFBQWhDLENBQXlDLGtCQUF6QyxDQUE5Qjs7QUFFQSxRQUFJd0MsV0FBV0EsUUFBUTFHLE1BQXZCLEVBQStCO0FBQzdCeUcsb0JBQWNDLFFBQVE5RixJQUFSLENBQWEsYUFBYixDQUFkO0FBQ0EsVUFBSTZGLGVBQWVBLFlBQVlOLGFBQS9CLEVBQThDO0FBQy9DOztBQUVELFFBQUlRLGFBQWFqSyxFQUFFd0QsS0FBRixDQUFRLGtCQUFSLENBQWpCO0FBQ0EsU0FBS21CLFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0J5SSxVQUF0QjtBQUNBLFFBQUlBLFdBQVd4RyxrQkFBWCxFQUFKLEVBQXFDOztBQUVyQyxRQUFJdUcsV0FBV0EsUUFBUTFHLE1BQXZCLEVBQStCO0FBQzdCUyxhQUFPSSxJQUFQLENBQVk2RixPQUFaLEVBQXFCLE1BQXJCO0FBQ0FELHFCQUFlQyxRQUFROUYsSUFBUixDQUFhLGFBQWIsRUFBNEIsSUFBNUIsQ0FBZjtBQUNEOztBQUVELFFBQUkwRixZQUFZLEtBQUtBLFNBQUwsRUFBaEI7O0FBRUEsU0FBS2pGLFFBQUwsQ0FDR2pCLFdBREgsQ0FDZSxVQURmLEVBRUc0QixRQUZILENBRVksWUFGWixFQUUwQnNFLFNBRjFCLEVBRXFDLENBRnJDLEVBR0czRyxJQUhILENBR1EsZUFIUixFQUd5QixJQUh6Qjs7QUFLQSxTQUFLc0csUUFBTCxDQUNHN0YsV0FESCxDQUNlLFdBRGYsRUFFR1QsSUFGSCxDQUVRLGVBRlIsRUFFeUIsSUFGekI7O0FBSUEsU0FBS3dHLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsUUFBSVMsV0FBVyxTQUFYQSxRQUFXLEdBQVk7QUFDekIsV0FBS3ZGLFFBQUwsQ0FDR2pCLFdBREgsQ0FDZSxZQURmLEVBRUc0QixRQUZILENBRVksYUFGWixFQUUyQnNFLFNBRjNCLEVBRXNDLEVBRnRDO0FBR0EsV0FBS0gsYUFBTCxHQUFxQixDQUFyQjtBQUNBLFdBQUs5RSxRQUFMLENBQ0duRCxPQURILENBQ1csbUJBRFg7QUFFRCxLQVBEOztBQVNBLFFBQUksQ0FBQ3hCLEVBQUV5QixPQUFGLENBQVVaLFVBQWYsRUFBMkIsT0FBT3FKLFNBQVMvRixJQUFULENBQWMsSUFBZCxDQUFQOztBQUUzQixRQUFJZ0csYUFBYW5LLEVBQUVvSyxTQUFGLENBQVksQ0FBQyxRQUFELEVBQVdSLFNBQVgsRUFBc0JmLElBQXRCLENBQTJCLEdBQTNCLENBQVosQ0FBakI7O0FBRUEsU0FBS2xFLFFBQUwsQ0FDR3JELEdBREgsQ0FDTyxpQkFEUCxFQUMwQnRCLEVBQUVxRixLQUFGLENBQVE2RSxRQUFSLEVBQWtCLElBQWxCLENBRDFCLEVBRUdoSixvQkFGSCxDQUV3Qm9JLFNBQVN6RyxtQkFGakMsRUFFc0QrRyxTQUZ0RCxFQUVpRSxLQUFLakYsUUFBTCxDQUFjLENBQWQsRUFBaUJ3RixVQUFqQixDQUZqRTtBQUdELEdBakREOztBQW1EQWIsV0FBU3hHLFNBQVQsQ0FBbUJ1SCxJQUFuQixHQUEwQixZQUFZO0FBQ3BDLFFBQUksS0FBS1osYUFBTCxJQUFzQixDQUFDLEtBQUs5RSxRQUFMLENBQWNiLFFBQWQsQ0FBdUIsSUFBdkIsQ0FBM0IsRUFBeUQ7O0FBRXpELFFBQUltRyxhQUFhakssRUFBRXdELEtBQUYsQ0FBUSxrQkFBUixDQUFqQjtBQUNBLFNBQUttQixRQUFMLENBQWNuRCxPQUFkLENBQXNCeUksVUFBdEI7QUFDQSxRQUFJQSxXQUFXeEcsa0JBQVgsRUFBSixFQUFxQzs7QUFFckMsUUFBSW1HLFlBQVksS0FBS0EsU0FBTCxFQUFoQjs7QUFFQSxTQUFLakYsUUFBTCxDQUFjaUYsU0FBZCxFQUF5QixLQUFLakYsUUFBTCxDQUFjaUYsU0FBZCxHQUF6QixFQUFxRCxDQUFyRCxFQUF3RFUsWUFBeEQ7O0FBRUEsU0FBSzNGLFFBQUwsQ0FDR1csUUFESCxDQUNZLFlBRFosRUFFRzVCLFdBRkgsQ0FFZSxhQUZmLEVBR0dULElBSEgsQ0FHUSxlQUhSLEVBR3lCLEtBSHpCOztBQUtBLFNBQUtzRyxRQUFMLENBQ0dqRSxRQURILENBQ1ksV0FEWixFQUVHckMsSUFGSCxDQUVRLGVBRlIsRUFFeUIsS0FGekI7O0FBSUEsU0FBS3dHLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsUUFBSVMsV0FBVyxTQUFYQSxRQUFXLEdBQVk7QUFDekIsV0FBS1QsYUFBTCxHQUFxQixDQUFyQjtBQUNBLFdBQUs5RSxRQUFMLENBQ0dqQixXQURILENBQ2UsWUFEZixFQUVHNEIsUUFGSCxDQUVZLFVBRlosRUFHRzlELE9BSEgsQ0FHVyxvQkFIWDtBQUlELEtBTkQ7O0FBUUEsUUFBSSxDQUFDeEIsRUFBRXlCLE9BQUYsQ0FBVVosVUFBZixFQUEyQixPQUFPcUosU0FBUy9GLElBQVQsQ0FBYyxJQUFkLENBQVA7O0FBRTNCLFNBQUtRLFFBQUwsQ0FDR2lGLFNBREgsRUFDYyxDQURkLEVBRUd0SSxHQUZILENBRU8saUJBRlAsRUFFMEJ0QixFQUFFcUYsS0FBRixDQUFRNkUsUUFBUixFQUFrQixJQUFsQixDQUYxQixFQUdHaEosb0JBSEgsQ0FHd0JvSSxTQUFTekcsbUJBSGpDO0FBSUQsR0FwQ0Q7O0FBc0NBeUcsV0FBU3hHLFNBQVQsQ0FBbUIyQyxNQUFuQixHQUE0QixZQUFZO0FBQ3RDLFNBQUssS0FBS2QsUUFBTCxDQUFjYixRQUFkLENBQXVCLElBQXZCLElBQStCLE1BQS9CLEdBQXdDLE1BQTdDO0FBQ0QsR0FGRDs7QUFJQXdGLFdBQVN4RyxTQUFULENBQW1CNEcsU0FBbkIsR0FBK0IsWUFBWTtBQUN6QyxXQUFPMUosRUFBRU8sUUFBRixFQUFZNkMsSUFBWixDQUFpQixLQUFLc0IsT0FBTCxDQUFhNkMsTUFBOUIsRUFDSm5FLElBREksQ0FDQywyQ0FBMkMsS0FBS3NCLE9BQUwsQ0FBYTZDLE1BQXhELEdBQWlFLElBRGxFLEVBRUp0RCxJQUZJLENBRUNqRSxFQUFFcUYsS0FBRixDQUFRLFVBQVVrRixDQUFWLEVBQWE5RixPQUFiLEVBQXNCO0FBQ2xDLFVBQUlFLFdBQVczRSxFQUFFeUUsT0FBRixDQUFmO0FBQ0EsV0FBS2tGLHdCQUFMLENBQThCYSxxQkFBcUI3RixRQUFyQixDQUE5QixFQUE4REEsUUFBOUQ7QUFDRCxLQUhLLEVBR0gsSUFIRyxDQUZELEVBTUoxRCxHQU5JLEVBQVA7QUFPRCxHQVJEOztBQVVBcUksV0FBU3hHLFNBQVQsQ0FBbUI2Ryx3QkFBbkIsR0FBOEMsVUFBVWhGLFFBQVYsRUFBb0I0RSxRQUFwQixFQUE4QjtBQUMxRSxRQUFJa0IsU0FBUzlGLFNBQVNiLFFBQVQsQ0FBa0IsSUFBbEIsQ0FBYjs7QUFFQWEsYUFBUzFCLElBQVQsQ0FBYyxlQUFkLEVBQStCd0gsTUFBL0I7QUFDQWxCLGFBQ0czRCxXQURILENBQ2UsV0FEZixFQUM0QixDQUFDNkUsTUFEN0IsRUFFR3hILElBRkgsQ0FFUSxlQUZSLEVBRXlCd0gsTUFGekI7QUFHRCxHQVBEOztBQVNBLFdBQVNELG9CQUFULENBQThCakIsUUFBOUIsRUFBd0M7QUFDdEMsUUFBSU4sSUFBSjtBQUNBLFFBQUkvRyxTQUFTcUgsU0FBU3RHLElBQVQsQ0FBYyxhQUFkLEtBQ1IsQ0FBQ2dHLE9BQU9NLFNBQVN0RyxJQUFULENBQWMsTUFBZCxDQUFSLEtBQWtDZ0csS0FBSy9GLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUEvQixDQUR2QyxDQUZzQyxDQUdvQzs7QUFFMUUsV0FBT2xELEVBQUVPLFFBQUYsRUFBWTZDLElBQVosQ0FBaUJsQixNQUFqQixDQUFQO0FBQ0Q7O0FBR0Q7QUFDQTs7QUFFQSxXQUFTNkIsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLQyxJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJbEIsUUFBVS9DLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSWtFLE9BQVVuQixNQUFNbUIsSUFBTixDQUFXLGFBQVgsQ0FBZDtBQUNBLFVBQUlRLFVBQVUxRSxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYTBFLFNBQVN6RSxRQUF0QixFQUFnQzlCLE1BQU1tQixJQUFOLEVBQWhDLEVBQThDLFFBQU9GLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNFLENBQWQ7O0FBRUEsVUFBSSxDQUFDRSxJQUFELElBQVNRLFFBQVFlLE1BQWpCLElBQTJCLFlBQVlPLElBQVosQ0FBaUJoQyxNQUFqQixDQUEvQixFQUF5RFUsUUFBUWUsTUFBUixHQUFpQixLQUFqQjtBQUN6RCxVQUFJLENBQUN2QixJQUFMLEVBQVduQixNQUFNbUIsSUFBTixDQUFXLGFBQVgsRUFBMkJBLE9BQU8sSUFBSW9GLFFBQUosQ0FBYSxJQUFiLEVBQW1CNUUsT0FBbkIsQ0FBbEM7QUFDWCxVQUFJLE9BQU9WLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JFLEtBQUtGLE1BQUw7QUFDaEMsS0FSTSxDQUFQO0FBU0Q7O0FBRUQsTUFBSUksTUFBTXBFLEVBQUVFLEVBQUYsQ0FBS3dLLFFBQWY7O0FBRUExSyxJQUFFRSxFQUFGLENBQUt3SyxRQUFMLEdBQTRCM0csTUFBNUI7QUFDQS9ELElBQUVFLEVBQUYsQ0FBS3dLLFFBQUwsQ0FBY3BHLFdBQWQsR0FBNEJnRixRQUE1Qjs7QUFHQTtBQUNBOztBQUVBdEosSUFBRUUsRUFBRixDQUFLd0ssUUFBTCxDQUFjbkcsVUFBZCxHQUEyQixZQUFZO0FBQ3JDdkUsTUFBRUUsRUFBRixDQUFLd0ssUUFBTCxHQUFnQnRHLEdBQWhCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBcEUsSUFBRU8sUUFBRixFQUFZbUMsRUFBWixDQUFlLDRCQUFmLEVBQTZDLDBCQUE3QyxFQUF5RSxVQUFVVCxDQUFWLEVBQWE7QUFDcEYsUUFBSWMsUUFBVS9DLEVBQUUsSUFBRixDQUFkOztBQUVBLFFBQUksQ0FBQytDLE1BQU1FLElBQU4sQ0FBVyxhQUFYLENBQUwsRUFBZ0NoQixFQUFFb0IsY0FBRjs7QUFFaEMsUUFBSTZGLFVBQVVzQixxQkFBcUJ6SCxLQUFyQixDQUFkO0FBQ0EsUUFBSW1CLE9BQVVnRixRQUFRaEYsSUFBUixDQUFhLGFBQWIsQ0FBZDtBQUNBLFFBQUlGLFNBQVVFLE9BQU8sUUFBUCxHQUFrQm5CLE1BQU1tQixJQUFOLEVBQWhDOztBQUVBSCxXQUFPSSxJQUFQLENBQVkrRSxPQUFaLEVBQXFCbEYsTUFBckI7QUFDRCxHQVZEO0FBWUQsQ0F6TUEsQ0F5TUNsRSxNQXpNRCxDQUFEOztBQTJNQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVFLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSTJLLFdBQVcsb0JBQWY7QUFDQSxNQUFJbEYsU0FBVywwQkFBZjtBQUNBLE1BQUltRixXQUFXLFNBQVhBLFFBQVcsQ0FBVW5HLE9BQVYsRUFBbUI7QUFDaEN6RSxNQUFFeUUsT0FBRixFQUFXL0IsRUFBWCxDQUFjLG1CQUFkLEVBQW1DLEtBQUsrQyxNQUF4QztBQUNELEdBRkQ7O0FBSUFtRixXQUFTaEksT0FBVCxHQUFtQixPQUFuQjs7QUFFQSxXQUFTOEcsU0FBVCxDQUFtQjNHLEtBQW5CLEVBQTBCO0FBQ3hCLFFBQUlDLFdBQVdELE1BQU1FLElBQU4sQ0FBVyxhQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDRCxRQUFMLEVBQWU7QUFDYkEsaUJBQVdELE1BQU1FLElBQU4sQ0FBVyxNQUFYLENBQVg7QUFDQUQsaUJBQVdBLFlBQVksWUFBWWdELElBQVosQ0FBaUJoRCxRQUFqQixDQUFaLElBQTBDQSxTQUFTRSxPQUFULENBQWlCLGdCQUFqQixFQUFtQyxFQUFuQyxDQUFyRCxDQUZhLENBRStFO0FBQzdGOztBQUVELFFBQUlDLFVBQVVILGFBQWEsR0FBYixHQUFtQmhELEVBQUVPLFFBQUYsRUFBWTZDLElBQVosQ0FBaUJKLFFBQWpCLENBQW5CLEdBQWdELElBQTlEOztBQUVBLFdBQU9HLFdBQVdBLFFBQVFHLE1BQW5CLEdBQTRCSCxPQUE1QixHQUFzQ0osTUFBTXdFLE1BQU4sRUFBN0M7QUFDRDs7QUFFRCxXQUFTc0QsVUFBVCxDQUFvQjVJLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUlBLEtBQUtBLEVBQUUrRSxLQUFGLEtBQVksQ0FBckIsRUFBd0I7QUFDeEJoSCxNQUFFMkssUUFBRixFQUFZOUcsTUFBWjtBQUNBN0QsTUFBRXlGLE1BQUYsRUFBVXhCLElBQVYsQ0FBZSxZQUFZO0FBQ3pCLFVBQUlsQixRQUFnQi9DLEVBQUUsSUFBRixDQUFwQjtBQUNBLFVBQUltRCxVQUFnQnVHLFVBQVUzRyxLQUFWLENBQXBCO0FBQ0EsVUFBSXlGLGdCQUFnQixFQUFFQSxlQUFlLElBQWpCLEVBQXBCOztBQUVBLFVBQUksQ0FBQ3JGLFFBQVFXLFFBQVIsQ0FBaUIsTUFBakIsQ0FBTCxFQUErQjs7QUFFL0IsVUFBSTdCLEtBQUtBLEVBQUVnRSxJQUFGLElBQVUsT0FBZixJQUEwQixrQkFBa0JELElBQWxCLENBQXVCL0QsRUFBRUMsTUFBRixDQUFTNkUsT0FBaEMsQ0FBMUIsSUFBc0UvRyxFQUFFOEssUUFBRixDQUFXM0gsUUFBUSxDQUFSLENBQVgsRUFBdUJsQixFQUFFQyxNQUF6QixDQUExRSxFQUE0Rzs7QUFFNUdpQixjQUFRM0IsT0FBUixDQUFnQlMsSUFBSWpDLEVBQUV3RCxLQUFGLENBQVEsa0JBQVIsRUFBNEJnRixhQUE1QixDQUFwQjs7QUFFQSxVQUFJdkcsRUFBRXdCLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCVixZQUFNRSxJQUFOLENBQVcsZUFBWCxFQUE0QixPQUE1QjtBQUNBRSxjQUFRTyxXQUFSLENBQW9CLE1BQXBCLEVBQTRCbEMsT0FBNUIsQ0FBb0N4QixFQUFFd0QsS0FBRixDQUFRLG9CQUFSLEVBQThCZ0YsYUFBOUIsQ0FBcEM7QUFDRCxLQWZEO0FBZ0JEOztBQUVEb0MsV0FBUzlILFNBQVQsQ0FBbUIyQyxNQUFuQixHQUE0QixVQUFVeEQsQ0FBVixFQUFhO0FBQ3ZDLFFBQUljLFFBQVEvQyxFQUFFLElBQUYsQ0FBWjs7QUFFQSxRQUFJK0MsTUFBTVosRUFBTixDQUFTLHNCQUFULENBQUosRUFBc0M7O0FBRXRDLFFBQUlnQixVQUFXdUcsVUFBVTNHLEtBQVYsQ0FBZjtBQUNBLFFBQUlnSSxXQUFXNUgsUUFBUVcsUUFBUixDQUFpQixNQUFqQixDQUFmOztBQUVBK0c7O0FBRUEsUUFBSSxDQUFDRSxRQUFMLEVBQWU7QUFDYixVQUFJLGtCQUFrQnhLLFNBQVNxRyxlQUEzQixJQUE4QyxDQUFDekQsUUFBUUksT0FBUixDQUFnQixhQUFoQixFQUErQkQsTUFBbEYsRUFBMEY7QUFDeEY7QUFDQXRELFVBQUVPLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBRixFQUNHOEUsUUFESCxDQUNZLG1CQURaLEVBRUcwRixXQUZILENBRWVoTCxFQUFFLElBQUYsQ0FGZixFQUdHMEMsRUFISCxDQUdNLE9BSE4sRUFHZW1JLFVBSGY7QUFJRDs7QUFFRCxVQUFJckMsZ0JBQWdCLEVBQUVBLGVBQWUsSUFBakIsRUFBcEI7QUFDQXJGLGNBQVEzQixPQUFSLENBQWdCUyxJQUFJakMsRUFBRXdELEtBQUYsQ0FBUSxrQkFBUixFQUE0QmdGLGFBQTVCLENBQXBCOztBQUVBLFVBQUl2RyxFQUFFd0Isa0JBQUYsRUFBSixFQUE0Qjs7QUFFNUJWLFlBQ0d2QixPQURILENBQ1csT0FEWCxFQUVHeUIsSUFGSCxDQUVRLGVBRlIsRUFFeUIsTUFGekI7O0FBSUFFLGNBQ0d5QyxXQURILENBQ2UsTUFEZixFQUVHcEUsT0FGSCxDQUVXeEIsRUFBRXdELEtBQUYsQ0FBUSxtQkFBUixFQUE2QmdGLGFBQTdCLENBRlg7QUFHRDs7QUFFRCxXQUFPLEtBQVA7QUFDRCxHQWxDRDs7QUFvQ0FvQyxXQUFTOUgsU0FBVCxDQUFtQjRELE9BQW5CLEdBQTZCLFVBQVV6RSxDQUFWLEVBQWE7QUFDeEMsUUFBSSxDQUFDLGdCQUFnQitELElBQWhCLENBQXFCL0QsRUFBRStFLEtBQXZCLENBQUQsSUFBa0Msa0JBQWtCaEIsSUFBbEIsQ0FBdUIvRCxFQUFFQyxNQUFGLENBQVM2RSxPQUFoQyxDQUF0QyxFQUFnRjs7QUFFaEYsUUFBSWhFLFFBQVEvQyxFQUFFLElBQUYsQ0FBWjs7QUFFQWlDLE1BQUVvQixjQUFGO0FBQ0FwQixNQUFFZ0osZUFBRjs7QUFFQSxRQUFJbEksTUFBTVosRUFBTixDQUFTLHNCQUFULENBQUosRUFBc0M7O0FBRXRDLFFBQUlnQixVQUFXdUcsVUFBVTNHLEtBQVYsQ0FBZjtBQUNBLFFBQUlnSSxXQUFXNUgsUUFBUVcsUUFBUixDQUFpQixNQUFqQixDQUFmOztBQUVBLFFBQUksQ0FBQ2lILFFBQUQsSUFBYTlJLEVBQUUrRSxLQUFGLElBQVcsRUFBeEIsSUFBOEIrRCxZQUFZOUksRUFBRStFLEtBQUYsSUFBVyxFQUF6RCxFQUE2RDtBQUMzRCxVQUFJL0UsRUFBRStFLEtBQUYsSUFBVyxFQUFmLEVBQW1CN0QsUUFBUUMsSUFBUixDQUFhcUMsTUFBYixFQUFxQmpFLE9BQXJCLENBQTZCLE9BQTdCO0FBQ25CLGFBQU91QixNQUFNdkIsT0FBTixDQUFjLE9BQWQsQ0FBUDtBQUNEOztBQUVELFFBQUkwSixPQUFPLDhCQUFYO0FBQ0EsUUFBSTFFLFNBQVNyRCxRQUFRQyxJQUFSLENBQWEsbUJBQW1COEgsSUFBaEMsQ0FBYjs7QUFFQSxRQUFJLENBQUMxRSxPQUFPbEQsTUFBWixFQUFvQjs7QUFFcEIsUUFBSW1FLFFBQVFqQixPQUFPaUIsS0FBUCxDQUFheEYsRUFBRUMsTUFBZixDQUFaOztBQUVBLFFBQUlELEVBQUUrRSxLQUFGLElBQVcsRUFBWCxJQUFpQlMsUUFBUSxDQUE3QixFQUFnREEsUUF6QlIsQ0F5QndCO0FBQ2hFLFFBQUl4RixFQUFFK0UsS0FBRixJQUFXLEVBQVgsSUFBaUJTLFFBQVFqQixPQUFPbEQsTUFBUCxHQUFnQixDQUE3QyxFQUFnRG1FLFFBMUJSLENBMEJ3QjtBQUNoRSxRQUFJLENBQUMsQ0FBQ0EsS0FBTixFQUFnREEsUUFBUSxDQUFSOztBQUVoRGpCLFdBQU95QixFQUFQLENBQVVSLEtBQVYsRUFBaUJqRyxPQUFqQixDQUF5QixPQUF6QjtBQUNELEdBOUJEOztBQWlDQTtBQUNBOztBQUVBLFdBQVN1QyxNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUtDLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlsQixRQUFRL0MsRUFBRSxJQUFGLENBQVo7QUFDQSxVQUFJa0UsT0FBUW5CLE1BQU1tQixJQUFOLENBQVcsYUFBWCxDQUFaOztBQUVBLFVBQUksQ0FBQ0EsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxhQUFYLEVBQTJCQSxPQUFPLElBQUkwRyxRQUFKLENBQWEsSUFBYixDQUFsQztBQUNYLFVBQUksT0FBTzVHLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JFLEtBQUtGLE1BQUwsRUFBYUcsSUFBYixDQUFrQnBCLEtBQWxCO0FBQ2hDLEtBTk0sQ0FBUDtBQU9EOztBQUVELE1BQUlxQixNQUFNcEUsRUFBRUUsRUFBRixDQUFLaUwsUUFBZjs7QUFFQW5MLElBQUVFLEVBQUYsQ0FBS2lMLFFBQUwsR0FBNEJwSCxNQUE1QjtBQUNBL0QsSUFBRUUsRUFBRixDQUFLaUwsUUFBTCxDQUFjN0csV0FBZCxHQUE0QnNHLFFBQTVCOztBQUdBO0FBQ0E7O0FBRUE1SyxJQUFFRSxFQUFGLENBQUtpTCxRQUFMLENBQWM1RyxVQUFkLEdBQTJCLFlBQVk7QUFDckN2RSxNQUFFRSxFQUFGLENBQUtpTCxRQUFMLEdBQWdCL0csR0FBaEI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUFwRSxJQUFFTyxRQUFGLEVBQ0dtQyxFQURILENBQ00sNEJBRE4sRUFDb0NtSSxVQURwQyxFQUVHbkksRUFGSCxDQUVNLDRCQUZOLEVBRW9DLGdCQUZwQyxFQUVzRCxVQUFVVCxDQUFWLEVBQWE7QUFBRUEsTUFBRWdKLGVBQUY7QUFBcUIsR0FGMUYsRUFHR3ZJLEVBSEgsQ0FHTSw0QkFITixFQUdvQytDLE1BSHBDLEVBRzRDbUYsU0FBUzlILFNBQVQsQ0FBbUIyQyxNQUgvRCxFQUlHL0MsRUFKSCxDQUlNLDhCQUpOLEVBSXNDK0MsTUFKdEMsRUFJOENtRixTQUFTOUgsU0FBVCxDQUFtQjRELE9BSmpFLEVBS0doRSxFQUxILENBS00sOEJBTE4sRUFLc0MsZ0JBTHRDLEVBS3dEa0ksU0FBUzlILFNBQVQsQ0FBbUI0RCxPQUwzRTtBQU9ELENBM0pBLENBMkpDNUcsTUEzSkQsQ0FBRDs7QUE2SkE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVRSxDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUlvTCxRQUFRLFNBQVJBLEtBQVEsQ0FBVTNHLE9BQVYsRUFBbUJDLE9BQW5CLEVBQTRCO0FBQ3RDLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUsyRyxLQUFMLEdBQWFyTCxFQUFFTyxTQUFTK0ssSUFBWCxDQUFiO0FBQ0EsU0FBSzNHLFFBQUwsR0FBZ0IzRSxFQUFFeUUsT0FBRixDQUFoQjtBQUNBLFNBQUs4RyxPQUFMLEdBQWUsS0FBSzVHLFFBQUwsQ0FBY3ZCLElBQWQsQ0FBbUIsZUFBbkIsQ0FBZjtBQUNBLFNBQUtvSSxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixDQUF0QjtBQUNBLFNBQUtDLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQix5Q0FBcEI7O0FBRUEsUUFBSSxLQUFLbkgsT0FBTCxDQUFhb0gsTUFBakIsRUFBeUI7QUFDdkIsV0FBS25ILFFBQUwsQ0FDR3ZCLElBREgsQ0FDUSxnQkFEUixFQUVHMkksSUFGSCxDQUVRLEtBQUtySCxPQUFMLENBQWFvSCxNQUZyQixFQUU2QjlMLEVBQUVxRixLQUFGLENBQVEsWUFBWTtBQUM3QyxhQUFLVixRQUFMLENBQWNuRCxPQUFkLENBQXNCLGlCQUF0QjtBQUNELE9BRjBCLEVBRXhCLElBRndCLENBRjdCO0FBS0Q7QUFDRixHQW5CRDs7QUFxQkE0SixRQUFNeEksT0FBTixHQUFnQixPQUFoQjs7QUFFQXdJLFFBQU12SSxtQkFBTixHQUE0QixHQUE1QjtBQUNBdUksUUFBTVksNEJBQU4sR0FBcUMsR0FBckM7O0FBRUFaLFFBQU12RyxRQUFOLEdBQWlCO0FBQ2Y4RixjQUFVLElBREs7QUFFZmxFLGNBQVUsSUFGSztBQUdmcUQsVUFBTTtBQUhTLEdBQWpCOztBQU1Bc0IsUUFBTXRJLFNBQU4sQ0FBZ0IyQyxNQUFoQixHQUF5QixVQUFVd0csY0FBVixFQUEwQjtBQUNqRCxXQUFPLEtBQUtSLE9BQUwsR0FBZSxLQUFLcEIsSUFBTCxFQUFmLEdBQTZCLEtBQUtQLElBQUwsQ0FBVW1DLGNBQVYsQ0FBcEM7QUFDRCxHQUZEOztBQUlBYixRQUFNdEksU0FBTixDQUFnQmdILElBQWhCLEdBQXVCLFVBQVVtQyxjQUFWLEVBQTBCO0FBQy9DLFFBQUk3RCxPQUFPLElBQVg7QUFDQSxRQUFJbkcsSUFBSWpDLEVBQUV3RCxLQUFGLENBQVEsZUFBUixFQUF5QixFQUFFZ0YsZUFBZXlELGNBQWpCLEVBQXpCLENBQVI7O0FBRUEsU0FBS3RILFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0JTLENBQXRCOztBQUVBLFFBQUksS0FBS3dKLE9BQUwsSUFBZ0J4SixFQUFFd0Isa0JBQUYsRUFBcEIsRUFBNEM7O0FBRTVDLFNBQUtnSSxPQUFMLEdBQWUsSUFBZjs7QUFFQSxTQUFLUyxjQUFMO0FBQ0EsU0FBS0MsWUFBTDtBQUNBLFNBQUtkLEtBQUwsQ0FBVy9GLFFBQVgsQ0FBb0IsWUFBcEI7O0FBRUEsU0FBSzhHLE1BQUw7QUFDQSxTQUFLQyxNQUFMOztBQUVBLFNBQUsxSCxRQUFMLENBQWNqQyxFQUFkLENBQWlCLHdCQUFqQixFQUEyQyx3QkFBM0MsRUFBcUUxQyxFQUFFcUYsS0FBRixDQUFRLEtBQUtnRixJQUFiLEVBQW1CLElBQW5CLENBQXJFOztBQUVBLFNBQUtrQixPQUFMLENBQWE3SSxFQUFiLENBQWdCLDRCQUFoQixFQUE4QyxZQUFZO0FBQ3hEMEYsV0FBS3pELFFBQUwsQ0FBY3JELEdBQWQsQ0FBa0IsMEJBQWxCLEVBQThDLFVBQVVXLENBQVYsRUFBYTtBQUN6RCxZQUFJakMsRUFBRWlDLEVBQUVDLE1BQUosRUFBWUMsRUFBWixDQUFlaUcsS0FBS3pELFFBQXBCLENBQUosRUFBbUN5RCxLQUFLd0QsbUJBQUwsR0FBMkIsSUFBM0I7QUFDcEMsT0FGRDtBQUdELEtBSkQ7O0FBTUEsU0FBS2pCLFFBQUwsQ0FBYyxZQUFZO0FBQ3hCLFVBQUk5SixhQUFhYixFQUFFeUIsT0FBRixDQUFVWixVQUFWLElBQXdCdUgsS0FBS3pELFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixNQUF2QixDQUF6Qzs7QUFFQSxVQUFJLENBQUNzRSxLQUFLekQsUUFBTCxDQUFjNEMsTUFBZCxHQUF1QmpFLE1BQTVCLEVBQW9DO0FBQ2xDOEUsYUFBS3pELFFBQUwsQ0FBYzJILFFBQWQsQ0FBdUJsRSxLQUFLaUQsS0FBNUIsRUFEa0MsQ0FDQztBQUNwQzs7QUFFRGpELFdBQUt6RCxRQUFMLENBQ0dtRixJQURILEdBRUd5QyxTQUZILENBRWEsQ0FGYjs7QUFJQW5FLFdBQUtvRSxZQUFMOztBQUVBLFVBQUkzTCxVQUFKLEVBQWdCO0FBQ2R1SCxhQUFLekQsUUFBTCxDQUFjLENBQWQsRUFBaUJpRSxXQUFqQixDQURjLENBQ2U7QUFDOUI7O0FBRURSLFdBQUt6RCxRQUFMLENBQWNXLFFBQWQsQ0FBdUIsSUFBdkI7O0FBRUE4QyxXQUFLcUUsWUFBTDs7QUFFQSxVQUFJeEssSUFBSWpDLEVBQUV3RCxLQUFGLENBQVEsZ0JBQVIsRUFBMEIsRUFBRWdGLGVBQWV5RCxjQUFqQixFQUExQixDQUFSOztBQUVBcEwsbUJBQ0V1SCxLQUFLbUQsT0FBTCxDQUFhO0FBQWIsT0FDR2pLLEdBREgsQ0FDTyxpQkFEUCxFQUMwQixZQUFZO0FBQ2xDOEcsYUFBS3pELFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0IsT0FBdEIsRUFBK0JBLE9BQS9CLENBQXVDUyxDQUF2QztBQUNELE9BSEgsRUFJR2Ysb0JBSkgsQ0FJd0JrSyxNQUFNdkksbUJBSjlCLENBREYsR0FNRXVGLEtBQUt6RCxRQUFMLENBQWNuRCxPQUFkLENBQXNCLE9BQXRCLEVBQStCQSxPQUEvQixDQUF1Q1MsQ0FBdkMsQ0FORjtBQU9ELEtBOUJEO0FBK0JELEdBeEREOztBQTBEQW1KLFFBQU10SSxTQUFOLENBQWdCdUgsSUFBaEIsR0FBdUIsVUFBVXBJLENBQVYsRUFBYTtBQUNsQyxRQUFJQSxDQUFKLEVBQU9BLEVBQUVvQixjQUFGOztBQUVQcEIsUUFBSWpDLEVBQUV3RCxLQUFGLENBQVEsZUFBUixDQUFKOztBQUVBLFNBQUttQixRQUFMLENBQWNuRCxPQUFkLENBQXNCUyxDQUF0Qjs7QUFFQSxRQUFJLENBQUMsS0FBS3dKLE9BQU4sSUFBaUJ4SixFQUFFd0Isa0JBQUYsRUFBckIsRUFBNkM7O0FBRTdDLFNBQUtnSSxPQUFMLEdBQWUsS0FBZjs7QUFFQSxTQUFLVyxNQUFMO0FBQ0EsU0FBS0MsTUFBTDs7QUFFQXJNLE1BQUVPLFFBQUYsRUFBWW1NLEdBQVosQ0FBZ0Isa0JBQWhCOztBQUVBLFNBQUsvSCxRQUFMLENBQ0dqQixXQURILENBQ2UsSUFEZixFQUVHZ0osR0FGSCxDQUVPLHdCQUZQLEVBR0dBLEdBSEgsQ0FHTywwQkFIUDs7QUFLQSxTQUFLbkIsT0FBTCxDQUFhbUIsR0FBYixDQUFpQiw0QkFBakI7O0FBRUExTSxNQUFFeUIsT0FBRixDQUFVWixVQUFWLElBQXdCLEtBQUs4RCxRQUFMLENBQWNiLFFBQWQsQ0FBdUIsTUFBdkIsQ0FBeEIsR0FDRSxLQUFLYSxRQUFMLENBQ0dyRCxHQURILENBQ08saUJBRFAsRUFDMEJ0QixFQUFFcUYsS0FBRixDQUFRLEtBQUtzSCxTQUFiLEVBQXdCLElBQXhCLENBRDFCLEVBRUd6TCxvQkFGSCxDQUV3QmtLLE1BQU12SSxtQkFGOUIsQ0FERixHQUlFLEtBQUs4SixTQUFMLEVBSkY7QUFLRCxHQTVCRDs7QUE4QkF2QixRQUFNdEksU0FBTixDQUFnQjJKLFlBQWhCLEdBQStCLFlBQVk7QUFDekN6TSxNQUFFTyxRQUFGLEVBQ0dtTSxHQURILENBQ08sa0JBRFAsRUFDMkI7QUFEM0IsS0FFR2hLLEVBRkgsQ0FFTSxrQkFGTixFQUUwQjFDLEVBQUVxRixLQUFGLENBQVEsVUFBVXBELENBQVYsRUFBYTtBQUMzQyxVQUFJMUIsYUFBYTBCLEVBQUVDLE1BQWYsSUFDRixLQUFLeUMsUUFBTCxDQUFjLENBQWQsTUFBcUIxQyxFQUFFQyxNQURyQixJQUVGLENBQUMsS0FBS3lDLFFBQUwsQ0FBY2lJLEdBQWQsQ0FBa0IzSyxFQUFFQyxNQUFwQixFQUE0Qm9CLE1BRi9CLEVBRXVDO0FBQ3JDLGFBQUtxQixRQUFMLENBQWNuRCxPQUFkLENBQXNCLE9BQXRCO0FBQ0Q7QUFDRixLQU51QixFQU1yQixJQU5xQixDQUYxQjtBQVNELEdBVkQ7O0FBWUE0SixRQUFNdEksU0FBTixDQUFnQnNKLE1BQWhCLEdBQXlCLFlBQVk7QUFDbkMsUUFBSSxLQUFLWCxPQUFMLElBQWdCLEtBQUsvRyxPQUFMLENBQWErQixRQUFqQyxFQUEyQztBQUN6QyxXQUFLOUIsUUFBTCxDQUFjakMsRUFBZCxDQUFpQiwwQkFBakIsRUFBNkMxQyxFQUFFcUYsS0FBRixDQUFRLFVBQVVwRCxDQUFWLEVBQWE7QUFDaEVBLFVBQUUrRSxLQUFGLElBQVcsRUFBWCxJQUFpQixLQUFLcUQsSUFBTCxFQUFqQjtBQUNELE9BRjRDLEVBRTFDLElBRjBDLENBQTdDO0FBR0QsS0FKRCxNQUlPLElBQUksQ0FBQyxLQUFLb0IsT0FBVixFQUFtQjtBQUN4QixXQUFLOUcsUUFBTCxDQUFjK0gsR0FBZCxDQUFrQiwwQkFBbEI7QUFDRDtBQUNGLEdBUkQ7O0FBVUF0QixRQUFNdEksU0FBTixDQUFnQnVKLE1BQWhCLEdBQXlCLFlBQVk7QUFDbkMsUUFBSSxLQUFLWixPQUFULEVBQWtCO0FBQ2hCekwsUUFBRW9KLE1BQUYsRUFBVTFHLEVBQVYsQ0FBYSxpQkFBYixFQUFnQzFDLEVBQUVxRixLQUFGLENBQVEsS0FBS3dILFlBQWIsRUFBMkIsSUFBM0IsQ0FBaEM7QUFDRCxLQUZELE1BRU87QUFDTDdNLFFBQUVvSixNQUFGLEVBQVVzRCxHQUFWLENBQWMsaUJBQWQ7QUFDRDtBQUNGLEdBTkQ7O0FBUUF0QixRQUFNdEksU0FBTixDQUFnQjZKLFNBQWhCLEdBQTRCLFlBQVk7QUFDdEMsUUFBSXZFLE9BQU8sSUFBWDtBQUNBLFNBQUt6RCxRQUFMLENBQWMwRixJQUFkO0FBQ0EsU0FBS00sUUFBTCxDQUFjLFlBQVk7QUFDeEJ2QyxXQUFLaUQsS0FBTCxDQUFXM0gsV0FBWCxDQUF1QixZQUF2QjtBQUNBMEUsV0FBSzBFLGdCQUFMO0FBQ0ExRSxXQUFLMkUsY0FBTDtBQUNBM0UsV0FBS3pELFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0IsaUJBQXRCO0FBQ0QsS0FMRDtBQU1ELEdBVEQ7O0FBV0E0SixRQUFNdEksU0FBTixDQUFnQmtLLGNBQWhCLEdBQWlDLFlBQVk7QUFDM0MsU0FBS3hCLFNBQUwsSUFBa0IsS0FBS0EsU0FBTCxDQUFlM0gsTUFBZixFQUFsQjtBQUNBLFNBQUsySCxTQUFMLEdBQWlCLElBQWpCO0FBQ0QsR0FIRDs7QUFLQUosUUFBTXRJLFNBQU4sQ0FBZ0I2SCxRQUFoQixHQUEyQixVQUFVcEosUUFBVixFQUFvQjtBQUM3QyxRQUFJNkcsT0FBTyxJQUFYO0FBQ0EsUUFBSTZFLFVBQVUsS0FBS3RJLFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixNQUF2QixJQUFpQyxNQUFqQyxHQUEwQyxFQUF4RDs7QUFFQSxRQUFJLEtBQUsySCxPQUFMLElBQWdCLEtBQUsvRyxPQUFMLENBQWFpRyxRQUFqQyxFQUEyQztBQUN6QyxVQUFJdUMsWUFBWWxOLEVBQUV5QixPQUFGLENBQVVaLFVBQVYsSUFBd0JvTSxPQUF4Qzs7QUFFQSxXQUFLekIsU0FBTCxHQUFpQnhMLEVBQUVPLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBRixFQUNkOEUsUUFEYyxDQUNMLG9CQUFvQjJILE9BRGYsRUFFZFgsUUFGYyxDQUVMLEtBQUtqQixLQUZBLENBQWpCOztBQUlBLFdBQUsxRyxRQUFMLENBQWNqQyxFQUFkLENBQWlCLHdCQUFqQixFQUEyQzFDLEVBQUVxRixLQUFGLENBQVEsVUFBVXBELENBQVYsRUFBYTtBQUM5RCxZQUFJLEtBQUsySixtQkFBVCxFQUE4QjtBQUM1QixlQUFLQSxtQkFBTCxHQUEyQixLQUEzQjtBQUNBO0FBQ0Q7QUFDRCxZQUFJM0osRUFBRUMsTUFBRixLQUFhRCxFQUFFa0wsYUFBbkIsRUFBa0M7QUFDbEMsYUFBS3pJLE9BQUwsQ0FBYWlHLFFBQWIsSUFBeUIsUUFBekIsR0FDSSxLQUFLaEcsUUFBTCxDQUFjLENBQWQsRUFBaUJ5SSxLQUFqQixFQURKLEdBRUksS0FBSy9DLElBQUwsRUFGSjtBQUdELE9BVDBDLEVBU3hDLElBVHdDLENBQTNDOztBQVdBLFVBQUk2QyxTQUFKLEVBQWUsS0FBSzFCLFNBQUwsQ0FBZSxDQUFmLEVBQWtCNUMsV0FBbEIsQ0FsQjBCLENBa0JJOztBQUU3QyxXQUFLNEMsU0FBTCxDQUFlbEcsUUFBZixDQUF3QixJQUF4Qjs7QUFFQSxVQUFJLENBQUMvRCxRQUFMLEVBQWU7O0FBRWYyTCxrQkFDRSxLQUFLMUIsU0FBTCxDQUNHbEssR0FESCxDQUNPLGlCQURQLEVBQzBCQyxRQUQxQixFQUVHTCxvQkFGSCxDQUV3QmtLLE1BQU1ZLDRCQUY5QixDQURGLEdBSUV6SyxVQUpGO0FBTUQsS0E5QkQsTUE4Qk8sSUFBSSxDQUFDLEtBQUtrSyxPQUFOLElBQWlCLEtBQUtELFNBQTFCLEVBQXFDO0FBQzFDLFdBQUtBLFNBQUwsQ0FBZTlILFdBQWYsQ0FBMkIsSUFBM0I7O0FBRUEsVUFBSTJKLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBWTtBQUMvQmpGLGFBQUs0RSxjQUFMO0FBQ0F6TCxvQkFBWUEsVUFBWjtBQUNELE9BSEQ7QUFJQXZCLFFBQUV5QixPQUFGLENBQVVaLFVBQVYsSUFBd0IsS0FBSzhELFFBQUwsQ0FBY2IsUUFBZCxDQUF1QixNQUF2QixDQUF4QixHQUNFLEtBQUswSCxTQUFMLENBQ0dsSyxHQURILENBQ08saUJBRFAsRUFDMEIrTCxjQUQxQixFQUVHbk0sb0JBRkgsQ0FFd0JrSyxNQUFNWSw0QkFGOUIsQ0FERixHQUlFcUIsZ0JBSkY7QUFNRCxLQWJNLE1BYUEsSUFBSTlMLFFBQUosRUFBYztBQUNuQkE7QUFDRDtBQUNGLEdBbEREOztBQW9EQTs7QUFFQTZKLFFBQU10SSxTQUFOLENBQWdCK0osWUFBaEIsR0FBK0IsWUFBWTtBQUN6QyxTQUFLTCxZQUFMO0FBQ0QsR0FGRDs7QUFJQXBCLFFBQU10SSxTQUFOLENBQWdCMEosWUFBaEIsR0FBK0IsWUFBWTtBQUN6QyxRQUFJYyxxQkFBcUIsS0FBSzNJLFFBQUwsQ0FBYyxDQUFkLEVBQWlCNEksWUFBakIsR0FBZ0NoTixTQUFTcUcsZUFBVCxDQUF5QjRHLFlBQWxGOztBQUVBLFNBQUs3SSxRQUFMLENBQWM4SSxHQUFkLENBQWtCO0FBQ2hCQyxtQkFBYSxDQUFDLEtBQUtDLGlCQUFOLElBQTJCTCxrQkFBM0IsR0FBZ0QsS0FBSzNCLGNBQXJELEdBQXNFLEVBRG5FO0FBRWhCaUMsb0JBQWMsS0FBS0QsaUJBQUwsSUFBMEIsQ0FBQ0wsa0JBQTNCLEdBQWdELEtBQUszQixjQUFyRCxHQUFzRTtBQUZwRSxLQUFsQjtBQUlELEdBUEQ7O0FBU0FQLFFBQU10SSxTQUFOLENBQWdCZ0ssZ0JBQWhCLEdBQW1DLFlBQVk7QUFDN0MsU0FBS25JLFFBQUwsQ0FBYzhJLEdBQWQsQ0FBa0I7QUFDaEJDLG1CQUFhLEVBREc7QUFFaEJFLG9CQUFjO0FBRkUsS0FBbEI7QUFJRCxHQUxEOztBQU9BeEMsUUFBTXRJLFNBQU4sQ0FBZ0JvSixjQUFoQixHQUFpQyxZQUFZO0FBQzNDLFFBQUkyQixrQkFBa0J6RSxPQUFPMEUsVUFBN0I7QUFDQSxRQUFJLENBQUNELGVBQUwsRUFBc0I7QUFBRTtBQUN0QixVQUFJRSxzQkFBc0J4TixTQUFTcUcsZUFBVCxDQUF5Qm9ILHFCQUF6QixFQUExQjtBQUNBSCx3QkFBa0JFLG9CQUFvQkUsS0FBcEIsR0FBNEJDLEtBQUtDLEdBQUwsQ0FBU0osb0JBQW9CSyxJQUE3QixDQUE5QztBQUNEO0FBQ0QsU0FBS1QsaUJBQUwsR0FBeUJwTixTQUFTK0ssSUFBVCxDQUFjK0MsV0FBZCxHQUE0QlIsZUFBckQ7QUFDQSxTQUFLbEMsY0FBTCxHQUFzQixLQUFLMkMsZ0JBQUwsRUFBdEI7QUFDRCxHQVJEOztBQVVBbEQsUUFBTXRJLFNBQU4sQ0FBZ0JxSixZQUFoQixHQUErQixZQUFZO0FBQ3pDLFFBQUlvQyxVQUFVQyxTQUFVLEtBQUtuRCxLQUFMLENBQVdvQyxHQUFYLENBQWUsZUFBZixLQUFtQyxDQUE3QyxFQUFpRCxFQUFqRCxDQUFkO0FBQ0EsU0FBSy9CLGVBQUwsR0FBdUJuTCxTQUFTK0ssSUFBVCxDQUFjdkssS0FBZCxDQUFvQjZNLFlBQXBCLElBQW9DLEVBQTNEO0FBQ0EsUUFBSWpDLGlCQUFpQixLQUFLQSxjQUExQjtBQUNBLFFBQUksS0FBS2dDLGlCQUFULEVBQTRCO0FBQzFCLFdBQUt0QyxLQUFMLENBQVdvQyxHQUFYLENBQWUsZUFBZixFQUFnQ2MsVUFBVTVDLGNBQTFDO0FBQ0EzTCxRQUFFLEtBQUs2TCxZQUFQLEVBQXFCNUgsSUFBckIsQ0FBMEIsVUFBVXdELEtBQVYsRUFBaUJoRCxPQUFqQixFQUEwQjtBQUNsRCxZQUFJZ0ssZ0JBQWdCaEssUUFBUTFELEtBQVIsQ0FBYzZNLFlBQWxDO0FBQ0EsWUFBSWMsb0JBQW9CMU8sRUFBRXlFLE9BQUYsRUFBV2dKLEdBQVgsQ0FBZSxlQUFmLENBQXhCO0FBQ0F6TixVQUFFeUUsT0FBRixFQUNHUCxJQURILENBQ1EsZUFEUixFQUN5QnVLLGFBRHpCLEVBRUdoQixHQUZILENBRU8sZUFGUCxFQUV3QmtCLFdBQVdELGlCQUFYLElBQWdDL0MsY0FBaEMsR0FBaUQsSUFGekU7QUFHRCxPQU5EO0FBT0Q7QUFDRixHQWREOztBQWdCQVAsUUFBTXRJLFNBQU4sQ0FBZ0JpSyxjQUFoQixHQUFpQyxZQUFZO0FBQzNDLFNBQUsxQixLQUFMLENBQVdvQyxHQUFYLENBQWUsZUFBZixFQUFnQyxLQUFLL0IsZUFBckM7QUFDQTFMLE1BQUUsS0FBSzZMLFlBQVAsRUFBcUI1SCxJQUFyQixDQUEwQixVQUFVd0QsS0FBVixFQUFpQmhELE9BQWpCLEVBQTBCO0FBQ2xELFVBQUltSyxVQUFVNU8sRUFBRXlFLE9BQUYsRUFBV1AsSUFBWCxDQUFnQixlQUFoQixDQUFkO0FBQ0FsRSxRQUFFeUUsT0FBRixFQUFXb0ssVUFBWCxDQUFzQixlQUF0QjtBQUNBcEssY0FBUTFELEtBQVIsQ0FBYzZNLFlBQWQsR0FBNkJnQixVQUFVQSxPQUFWLEdBQW9CLEVBQWpEO0FBQ0QsS0FKRDtBQUtELEdBUEQ7O0FBU0F4RCxRQUFNdEksU0FBTixDQUFnQndMLGdCQUFoQixHQUFtQyxZQUFZO0FBQUU7QUFDL0MsUUFBSVEsWUFBWXZPLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQXNPLGNBQVVDLFNBQVYsR0FBc0IseUJBQXRCO0FBQ0EsU0FBSzFELEtBQUwsQ0FBVzJELE1BQVgsQ0FBa0JGLFNBQWxCO0FBQ0EsUUFBSW5ELGlCQUFpQm1ELFVBQVVsRyxXQUFWLEdBQXdCa0csVUFBVVQsV0FBdkQ7QUFDQSxTQUFLaEQsS0FBTCxDQUFXLENBQVgsRUFBYzRELFdBQWQsQ0FBMEJILFNBQTFCO0FBQ0EsV0FBT25ELGNBQVA7QUFDRCxHQVBEOztBQVVBO0FBQ0E7O0FBRUEsV0FBUzVILE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCaUksY0FBeEIsRUFBd0M7QUFDdEMsV0FBTyxLQUFLaEksSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSWxCLFFBQVEvQyxFQUFFLElBQUYsQ0FBWjtBQUNBLFVBQUlrRSxPQUFPbkIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLENBQVg7QUFDQSxVQUFJUSxVQUFVMUUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFULEVBQWF3RyxNQUFNdkcsUUFBbkIsRUFBNkI5QixNQUFNbUIsSUFBTixFQUE3QixFQUEyQyxRQUFPRixNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUF4RSxDQUFkOztBQUVBLFVBQUksQ0FBQ0UsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLEVBQXdCQSxPQUFPLElBQUlrSCxLQUFKLENBQVUsSUFBVixFQUFnQjFHLE9BQWhCLENBQS9CO0FBQ1gsVUFBSSxPQUFPVixNQUFQLElBQWlCLFFBQXJCLEVBQStCRSxLQUFLRixNQUFMLEVBQWFpSSxjQUFiLEVBQS9CLEtBQ0ssSUFBSXZILFFBQVFvRixJQUFaLEVBQWtCNUYsS0FBSzRGLElBQUwsQ0FBVW1DLGNBQVY7QUFDeEIsS0FSTSxDQUFQO0FBU0Q7O0FBRUQsTUFBSTdILE1BQU1wRSxFQUFFRSxFQUFGLENBQUtnUCxLQUFmOztBQUVBbFAsSUFBRUUsRUFBRixDQUFLZ1AsS0FBTCxHQUFhbkwsTUFBYjtBQUNBL0QsSUFBRUUsRUFBRixDQUFLZ1AsS0FBTCxDQUFXNUssV0FBWCxHQUF5QjhHLEtBQXpCOztBQUdBO0FBQ0E7O0FBRUFwTCxJQUFFRSxFQUFGLENBQUtnUCxLQUFMLENBQVczSyxVQUFYLEdBQXdCLFlBQVk7QUFDbEN2RSxNQUFFRSxFQUFGLENBQUtnUCxLQUFMLEdBQWE5SyxHQUFiO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBcEUsSUFBRU8sUUFBRixFQUFZbUMsRUFBWixDQUFlLHlCQUFmLEVBQTBDLHVCQUExQyxFQUFtRSxVQUFVVCxDQUFWLEVBQWE7QUFDOUUsUUFBSWMsUUFBUS9DLEVBQUUsSUFBRixDQUFaO0FBQ0EsUUFBSWlKLE9BQU9sRyxNQUFNRSxJQUFOLENBQVcsTUFBWCxDQUFYO0FBQ0EsUUFBSWYsU0FBU2EsTUFBTUUsSUFBTixDQUFXLGFBQVgsS0FDVmdHLFFBQVFBLEtBQUsvRixPQUFMLENBQWEsZ0JBQWIsRUFBK0IsRUFBL0IsQ0FEWCxDQUg4RSxDQUkvQjs7QUFFL0MsUUFBSWdHLFVBQVVsSixFQUFFTyxRQUFGLEVBQVk2QyxJQUFaLENBQWlCbEIsTUFBakIsQ0FBZDtBQUNBLFFBQUk4QixTQUFTa0YsUUFBUWhGLElBQVIsQ0FBYSxVQUFiLElBQTJCLFFBQTNCLEdBQXNDbEUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFFa0gsUUFBUSxDQUFDLElBQUk5RixJQUFKLENBQVNpRCxJQUFULENBQUQsSUFBbUJBLElBQTdCLEVBQVQsRUFBOENDLFFBQVFoRixJQUFSLEVBQTlDLEVBQThEbkIsTUFBTW1CLElBQU4sRUFBOUQsQ0FBbkQ7O0FBRUEsUUFBSW5CLE1BQU1aLEVBQU4sQ0FBUyxHQUFULENBQUosRUFBbUJGLEVBQUVvQixjQUFGOztBQUVuQjZGLFlBQVE1SCxHQUFSLENBQVksZUFBWixFQUE2QixVQUFVNk4sU0FBVixFQUFxQjtBQUNoRCxVQUFJQSxVQUFVMUwsa0JBQVYsRUFBSixFQUFvQyxPQURZLENBQ0w7QUFDM0N5RixjQUFRNUgsR0FBUixDQUFZLGlCQUFaLEVBQStCLFlBQVk7QUFDekN5QixjQUFNWixFQUFOLENBQVMsVUFBVCxLQUF3QlksTUFBTXZCLE9BQU4sQ0FBYyxPQUFkLENBQXhCO0FBQ0QsT0FGRDtBQUdELEtBTEQ7QUFNQXVDLFdBQU9JLElBQVAsQ0FBWStFLE9BQVosRUFBcUJsRixNQUFyQixFQUE2QixJQUE3QjtBQUNELEdBbEJEO0FBb0JELENBNVZBLENBNFZDbEUsTUE1VkQsQ0FBRDs7QUE4VkE7Ozs7Ozs7OztBQVNBLENBQUMsVUFBVUUsQ0FBVixFQUFhO0FBQ1o7O0FBRUEsTUFBSW9QLHdCQUF3QixDQUFDLFVBQUQsRUFBYSxXQUFiLEVBQTBCLFlBQTFCLENBQTVCOztBQUVBLE1BQUlDLFdBQVcsQ0FDYixZQURhLEVBRWIsTUFGYSxFQUdiLE1BSGEsRUFJYixVQUphLEVBS2IsVUFMYSxFQU1iLFFBTmEsRUFPYixLQVBhLEVBUWIsWUFSYSxDQUFmOztBQVdBLE1BQUlDLHlCQUF5QixnQkFBN0I7O0FBRUEsTUFBSUMsbUJBQW1CO0FBQ3JCO0FBQ0EsU0FBSyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLE1BQXZCLEVBQStCLE1BQS9CLEVBQXVDRCxzQkFBdkMsQ0FGZ0I7QUFHckJFLE9BQUcsQ0FBQyxRQUFELEVBQVcsTUFBWCxFQUFtQixPQUFuQixFQUE0QixLQUE1QixDQUhrQjtBQUlyQkMsVUFBTSxFQUplO0FBS3JCQyxPQUFHLEVBTGtCO0FBTXJCQyxRQUFJLEVBTmlCO0FBT3JCQyxTQUFLLEVBUGdCO0FBUXJCQyxVQUFNLEVBUmU7QUFTckJDLFNBQUssRUFUZ0I7QUFVckJDLFFBQUksRUFWaUI7QUFXckJDLFFBQUksRUFYaUI7QUFZckJDLFFBQUksRUFaaUI7QUFhckJDLFFBQUksRUFiaUI7QUFjckJDLFFBQUksRUFkaUI7QUFlckJDLFFBQUksRUFmaUI7QUFnQnJCQyxRQUFJLEVBaEJpQjtBQWlCckJDLFFBQUksRUFqQmlCO0FBa0JyQi9GLE9BQUcsRUFsQmtCO0FBbUJyQmdHLFNBQUssQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE9BQWYsRUFBd0IsT0FBeEIsRUFBaUMsUUFBakMsQ0FuQmdCO0FBb0JyQkMsUUFBSSxFQXBCaUI7QUFxQnJCQyxRQUFJLEVBckJpQjtBQXNCckJDLE9BQUcsRUF0QmtCO0FBdUJyQkMsU0FBSyxFQXZCZ0I7QUF3QnJCQyxPQUFHLEVBeEJrQjtBQXlCckJDLFdBQU8sRUF6QmM7QUEwQnJCQyxVQUFNLEVBMUJlO0FBMkJyQkMsU0FBSyxFQTNCZ0I7QUE0QnJCQyxTQUFLLEVBNUJnQjtBQTZCckJDLFlBQVEsRUE3QmE7QUE4QnJCQyxPQUFHLEVBOUJrQjtBQStCckJDLFFBQUk7O0FBR047Ozs7O0FBbEN1QixHQUF2QixDQXVDQSxJQUFJQyxtQkFBbUIsNkRBQXZCOztBQUVBOzs7OztBQUtBLE1BQUlDLG1CQUFtQixxSUFBdkI7O0FBRUEsV0FBU0MsZ0JBQVQsQ0FBMEJyTyxJQUExQixFQUFnQ3NPLG9CQUFoQyxFQUFzRDtBQUNwRCxRQUFJQyxXQUFXdk8sS0FBS3dPLFFBQUwsQ0FBY0MsV0FBZCxFQUFmOztBQUVBLFFBQUkxUixFQUFFMlIsT0FBRixDQUFVSCxRQUFWLEVBQW9CRCxvQkFBcEIsTUFBOEMsQ0FBQyxDQUFuRCxFQUFzRDtBQUNwRCxVQUFJdlIsRUFBRTJSLE9BQUYsQ0FBVUgsUUFBVixFQUFvQm5DLFFBQXBCLE1BQWtDLENBQUMsQ0FBdkMsRUFBMEM7QUFDeEMsZUFBT3VDLFFBQVEzTyxLQUFLNE8sU0FBTCxDQUFlQyxLQUFmLENBQXFCVixnQkFBckIsS0FBMENuTyxLQUFLNE8sU0FBTCxDQUFlQyxLQUFmLENBQXFCVCxnQkFBckIsQ0FBbEQsQ0FBUDtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOztBQUVELFFBQUlVLFNBQVMvUixFQUFFdVIsb0JBQUYsRUFBd0JTLE1BQXhCLENBQStCLFVBQVV2SyxLQUFWLEVBQWlCd0ssS0FBakIsRUFBd0I7QUFDbEUsYUFBT0EsaUJBQWlCQyxNQUF4QjtBQUNELEtBRlksQ0FBYjs7QUFJQTtBQUNBLFNBQUssSUFBSTNILElBQUksQ0FBUixFQUFXNEgsSUFBSUosT0FBT3pPLE1BQTNCLEVBQW1DaUgsSUFBSTRILENBQXZDLEVBQTBDNUgsR0FBMUMsRUFBK0M7QUFDN0MsVUFBSWlILFNBQVNNLEtBQVQsQ0FBZUMsT0FBT3hILENBQVAsQ0FBZixDQUFKLEVBQStCO0FBQzdCLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsV0FBUzZILFlBQVQsQ0FBc0JDLFVBQXRCLEVBQWtDQyxTQUFsQyxFQUE2Q0MsVUFBN0MsRUFBeUQ7QUFDdkQsUUFBSUYsV0FBVy9PLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsYUFBTytPLFVBQVA7QUFDRDs7QUFFRCxRQUFJRSxjQUFjLE9BQU9BLFVBQVAsS0FBc0IsVUFBeEMsRUFBb0Q7QUFDbEQsYUFBT0EsV0FBV0YsVUFBWCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLENBQUM5UixTQUFTaVMsY0FBVixJQUE0QixDQUFDalMsU0FBU2lTLGNBQVQsQ0FBd0JDLGtCQUF6RCxFQUE2RTtBQUMzRSxhQUFPSixVQUFQO0FBQ0Q7O0FBRUQsUUFBSUssa0JBQWtCblMsU0FBU2lTLGNBQVQsQ0FBd0JDLGtCQUF4QixDQUEyQyxjQUEzQyxDQUF0QjtBQUNBQyxvQkFBZ0JwSCxJQUFoQixDQUFxQnFILFNBQXJCLEdBQWlDTixVQUFqQzs7QUFFQSxRQUFJTyxnQkFBZ0I1UyxFQUFFNlMsR0FBRixDQUFNUCxTQUFOLEVBQWlCLFVBQVVoUyxFQUFWLEVBQWNpSyxDQUFkLEVBQWlCO0FBQUUsYUFBT0EsQ0FBUDtBQUFVLEtBQTlDLENBQXBCO0FBQ0EsUUFBSXVJLFdBQVc5UyxFQUFFMFMsZ0JBQWdCcEgsSUFBbEIsRUFBd0JsSSxJQUF4QixDQUE2QixHQUE3QixDQUFmOztBQUVBLFNBQUssSUFBSW1ILElBQUksQ0FBUixFQUFXd0ksTUFBTUQsU0FBU3hQLE1BQS9CLEVBQXVDaUgsSUFBSXdJLEdBQTNDLEVBQWdEeEksR0FBaEQsRUFBcUQ7QUFDbkQsVUFBSWpLLEtBQUt3UyxTQUFTdkksQ0FBVCxDQUFUO0FBQ0EsVUFBSXlJLFNBQVMxUyxHQUFHbVIsUUFBSCxDQUFZQyxXQUFaLEVBQWI7O0FBRUEsVUFBSTFSLEVBQUUyUixPQUFGLENBQVVxQixNQUFWLEVBQWtCSixhQUFsQixNQUFxQyxDQUFDLENBQTFDLEVBQTZDO0FBQzNDdFMsV0FBRzJTLFVBQUgsQ0FBY2hFLFdBQWQsQ0FBMEIzTyxFQUExQjs7QUFFQTtBQUNEOztBQUVELFVBQUk0UyxnQkFBZ0JsVCxFQUFFNlMsR0FBRixDQUFNdlMsR0FBRzZTLFVBQVQsRUFBcUIsVUFBVTdTLEVBQVYsRUFBYztBQUFFLGVBQU9BLEVBQVA7QUFBVyxPQUFoRCxDQUFwQjtBQUNBLFVBQUk4Uyx3QkFBd0IsR0FBR0MsTUFBSCxDQUFVZixVQUFVLEdBQVYsS0FBa0IsRUFBNUIsRUFBZ0NBLFVBQVVVLE1BQVYsS0FBcUIsRUFBckQsQ0FBNUI7O0FBRUEsV0FBSyxJQUFJTSxJQUFJLENBQVIsRUFBV0MsT0FBT0wsY0FBYzVQLE1BQXJDLEVBQTZDZ1EsSUFBSUMsSUFBakQsRUFBdURELEdBQXZELEVBQTREO0FBQzFELFlBQUksQ0FBQ2hDLGlCQUFpQjRCLGNBQWNJLENBQWQsQ0FBakIsRUFBbUNGLHFCQUFuQyxDQUFMLEVBQWdFO0FBQzlEOVMsYUFBR2tULGVBQUgsQ0FBbUJOLGNBQWNJLENBQWQsRUFBaUI3QixRQUFwQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxXQUFPaUIsZ0JBQWdCcEgsSUFBaEIsQ0FBcUJxSCxTQUE1QjtBQUNEOztBQUVEO0FBQ0E7O0FBRUEsTUFBSWMsVUFBVSxTQUFWQSxPQUFVLENBQVVoUCxPQUFWLEVBQW1CQyxPQUFuQixFQUE0QjtBQUN4QyxTQUFLdUIsSUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUt2QixPQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS2dQLE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUtqUCxRQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS2tQLE9BQUwsR0FBa0IsSUFBbEI7O0FBRUEsU0FBS0MsSUFBTCxDQUFVLFNBQVYsRUFBcUJyUCxPQUFyQixFQUE4QkMsT0FBOUI7QUFDRCxHQVZEOztBQVlBK08sVUFBUTdRLE9BQVIsR0FBbUIsT0FBbkI7O0FBRUE2USxVQUFRNVEsbUJBQVIsR0FBOEIsR0FBOUI7O0FBRUE0USxVQUFRNU8sUUFBUixHQUFtQjtBQUNqQmtQLGVBQVcsSUFETTtBQUVqQkMsZUFBVyxLQUZNO0FBR2pCaFIsY0FBVSxLQUhPO0FBSWpCaVIsY0FBVSw4R0FKTztBQUtqQnpTLGFBQVMsYUFMUTtBQU1qQjBTLFdBQU8sRUFOVTtBQU9qQkMsV0FBTyxDQVBVO0FBUWpCQyxVQUFNLEtBUlc7QUFTakJDLGVBQVcsS0FUTTtBQVVqQkMsY0FBVTtBQUNSdFIsZ0JBQVUsTUFERjtBQUVSNEwsZUFBUztBQUZELEtBVk87QUFjakIyRixjQUFXLElBZE07QUFlakJoQyxnQkFBYSxJQWZJO0FBZ0JqQkQsZUFBWS9DO0FBaEJLLEdBQW5COztBQW1CQWtFLFVBQVEzUSxTQUFSLENBQWtCZ1IsSUFBbEIsR0FBeUIsVUFBVTdOLElBQVYsRUFBZ0J4QixPQUFoQixFQUF5QkMsT0FBekIsRUFBa0M7QUFDekQsU0FBS2dQLE9BQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLek4sSUFBTCxHQUFpQkEsSUFBakI7QUFDQSxTQUFLdEIsUUFBTCxHQUFpQjNFLEVBQUV5RSxPQUFGLENBQWpCO0FBQ0EsU0FBS0MsT0FBTCxHQUFpQixLQUFLOFAsVUFBTCxDQUFnQjlQLE9BQWhCLENBQWpCO0FBQ0EsU0FBSytQLFNBQUwsR0FBaUIsS0FBSy9QLE9BQUwsQ0FBYTRQLFFBQWIsSUFBeUJ0VSxFQUFFTyxRQUFGLEVBQVk2QyxJQUFaLENBQWlCcEQsRUFBRTBVLFVBQUYsQ0FBYSxLQUFLaFEsT0FBTCxDQUFhNFAsUUFBMUIsSUFBc0MsS0FBSzVQLE9BQUwsQ0FBYTRQLFFBQWIsQ0FBc0JuUSxJQUF0QixDQUEyQixJQUEzQixFQUFpQyxLQUFLUSxRQUF0QyxDQUF0QyxHQUF5RixLQUFLRCxPQUFMLENBQWE0UCxRQUFiLENBQXNCdFIsUUFBdEIsSUFBa0MsS0FBSzBCLE9BQUwsQ0FBYTRQLFFBQXpKLENBQTFDO0FBQ0EsU0FBS1QsT0FBTCxHQUFpQixFQUFFYyxPQUFPLEtBQVQsRUFBZ0JDLE9BQU8sS0FBdkIsRUFBOEJ4SCxPQUFPLEtBQXJDLEVBQWpCOztBQUVBLFFBQUksS0FBS3pJLFFBQUwsQ0FBYyxDQUFkLGFBQTRCcEUsU0FBU3NVLFdBQXJDLElBQW9ELENBQUMsS0FBS25RLE9BQUwsQ0FBYTFCLFFBQXRFLEVBQWdGO0FBQzlFLFlBQU0sSUFBSWpELEtBQUosQ0FBVSwyREFBMkQsS0FBS2tHLElBQWhFLEdBQXVFLGlDQUFqRixDQUFOO0FBQ0Q7O0FBRUQsUUFBSTZPLFdBQVcsS0FBS3BRLE9BQUwsQ0FBYWxELE9BQWIsQ0FBcUJwQixLQUFyQixDQUEyQixHQUEzQixDQUFmOztBQUVBLFNBQUssSUFBSW1LLElBQUl1SyxTQUFTeFIsTUFBdEIsRUFBOEJpSCxHQUE5QixHQUFvQztBQUNsQyxVQUFJL0ksVUFBVXNULFNBQVN2SyxDQUFULENBQWQ7O0FBRUEsVUFBSS9JLFdBQVcsT0FBZixFQUF3QjtBQUN0QixhQUFLbUQsUUFBTCxDQUFjakMsRUFBZCxDQUFpQixXQUFXLEtBQUt1RCxJQUFqQyxFQUF1QyxLQUFLdkIsT0FBTCxDQUFhMUIsUUFBcEQsRUFBOERoRCxFQUFFcUYsS0FBRixDQUFRLEtBQUtJLE1BQWIsRUFBcUIsSUFBckIsQ0FBOUQ7QUFDRCxPQUZELE1BRU8sSUFBSWpFLFdBQVcsUUFBZixFQUF5QjtBQUM5QixZQUFJdVQsVUFBV3ZULFdBQVcsT0FBWCxHQUFxQixZQUFyQixHQUFvQyxTQUFuRDtBQUNBLFlBQUl3VCxXQUFXeFQsV0FBVyxPQUFYLEdBQXFCLFlBQXJCLEdBQW9DLFVBQW5EOztBQUVBLGFBQUttRCxRQUFMLENBQWNqQyxFQUFkLENBQWlCcVMsVUFBVyxHQUFYLEdBQWlCLEtBQUs5TyxJQUF2QyxFQUE2QyxLQUFLdkIsT0FBTCxDQUFhMUIsUUFBMUQsRUFBb0VoRCxFQUFFcUYsS0FBRixDQUFRLEtBQUs0UCxLQUFiLEVBQW9CLElBQXBCLENBQXBFO0FBQ0EsYUFBS3RRLFFBQUwsQ0FBY2pDLEVBQWQsQ0FBaUJzUyxXQUFXLEdBQVgsR0FBaUIsS0FBSy9PLElBQXZDLEVBQTZDLEtBQUt2QixPQUFMLENBQWExQixRQUExRCxFQUFvRWhELEVBQUVxRixLQUFGLENBQVEsS0FBSzZQLEtBQWIsRUFBb0IsSUFBcEIsQ0FBcEU7QUFDRDtBQUNGOztBQUVELFNBQUt4USxPQUFMLENBQWExQixRQUFiLEdBQ0csS0FBS21TLFFBQUwsR0FBZ0JuVixFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYSxLQUFLRixPQUFsQixFQUEyQixFQUFFbEQsU0FBUyxRQUFYLEVBQXFCd0IsVUFBVSxFQUEvQixFQUEzQixDQURuQixHQUVFLEtBQUtvUyxRQUFMLEVBRkY7QUFHRCxHQS9CRDs7QUFpQ0EzQixVQUFRM1EsU0FBUixDQUFrQnVTLFdBQWxCLEdBQWdDLFlBQVk7QUFDMUMsV0FBTzVCLFFBQVE1TyxRQUFmO0FBQ0QsR0FGRDs7QUFJQTRPLFVBQVEzUSxTQUFSLENBQWtCMFIsVUFBbEIsR0FBK0IsVUFBVTlQLE9BQVYsRUFBbUI7QUFDaEQsUUFBSTRRLGlCQUFpQixLQUFLM1EsUUFBTCxDQUFjVCxJQUFkLEVBQXJCOztBQUVBLFNBQUssSUFBSXFSLFFBQVQsSUFBcUJELGNBQXJCLEVBQXFDO0FBQ25DLFVBQUlBLGVBQWVFLGNBQWYsQ0FBOEJELFFBQTlCLEtBQTJDdlYsRUFBRTJSLE9BQUYsQ0FBVTRELFFBQVYsRUFBb0JuRyxxQkFBcEIsTUFBK0MsQ0FBQyxDQUEvRixFQUFrRztBQUNoRyxlQUFPa0csZUFBZUMsUUFBZixDQUFQO0FBQ0Q7QUFDRjs7QUFFRDdRLGNBQVUxRSxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYSxLQUFLeVEsV0FBTCxFQUFiLEVBQWlDQyxjQUFqQyxFQUFpRDVRLE9BQWpELENBQVY7O0FBRUEsUUFBSUEsUUFBUXlQLEtBQVIsSUFBaUIsT0FBT3pQLFFBQVF5UCxLQUFmLElBQXdCLFFBQTdDLEVBQXVEO0FBQ3JEelAsY0FBUXlQLEtBQVIsR0FBZ0I7QUFDZHJLLGNBQU1wRixRQUFReVAsS0FEQTtBQUVkOUosY0FBTTNGLFFBQVF5UDtBQUZBLE9BQWhCO0FBSUQ7O0FBRUQsUUFBSXpQLFFBQVE2UCxRQUFaLEVBQXNCO0FBQ3BCN1AsY0FBUXVQLFFBQVIsR0FBbUI3QixhQUFhMU4sUUFBUXVQLFFBQXJCLEVBQStCdlAsUUFBUTROLFNBQXZDLEVBQWtENU4sUUFBUTZOLFVBQTFELENBQW5CO0FBQ0Q7O0FBRUQsV0FBTzdOLE9BQVA7QUFDRCxHQXZCRDs7QUF5QkErTyxVQUFRM1EsU0FBUixDQUFrQjJTLGtCQUFsQixHQUF1QyxZQUFZO0FBQ2pELFFBQUkvUSxVQUFXLEVBQWY7QUFDQSxRQUFJZ1IsV0FBVyxLQUFLTCxXQUFMLEVBQWY7O0FBRUEsU0FBS0YsUUFBTCxJQUFpQm5WLEVBQUVpRSxJQUFGLENBQU8sS0FBS2tSLFFBQVosRUFBc0IsVUFBVVEsR0FBVixFQUFlMUQsS0FBZixFQUFzQjtBQUMzRCxVQUFJeUQsU0FBU0MsR0FBVCxLQUFpQjFELEtBQXJCLEVBQTRCdk4sUUFBUWlSLEdBQVIsSUFBZTFELEtBQWY7QUFDN0IsS0FGZ0IsQ0FBakI7O0FBSUEsV0FBT3ZOLE9BQVA7QUFDRCxHQVREOztBQVdBK08sVUFBUTNRLFNBQVIsQ0FBa0JtUyxLQUFsQixHQUEwQixVQUFVVyxHQUFWLEVBQWU7QUFDdkMsUUFBSUMsT0FBT0QsZUFBZSxLQUFLZixXQUFwQixHQUNUZSxHQURTLEdBQ0g1VixFQUFFNFYsSUFBSXpJLGFBQU4sRUFBcUJqSixJQUFyQixDQUEwQixRQUFRLEtBQUsrQixJQUF2QyxDQURSOztBQUdBLFFBQUksQ0FBQzRQLElBQUwsRUFBVztBQUNUQSxhQUFPLElBQUksS0FBS2hCLFdBQVQsQ0FBcUJlLElBQUl6SSxhQUF6QixFQUF3QyxLQUFLc0ksa0JBQUwsRUFBeEMsQ0FBUDtBQUNBelYsUUFBRTRWLElBQUl6SSxhQUFOLEVBQXFCakosSUFBckIsQ0FBMEIsUUFBUSxLQUFLK0IsSUFBdkMsRUFBNkM0UCxJQUE3QztBQUNEOztBQUVELFFBQUlELGVBQWU1VixFQUFFd0QsS0FBckIsRUFBNEI7QUFDMUJxUyxXQUFLaEMsT0FBTCxDQUFhK0IsSUFBSTNQLElBQUosSUFBWSxTQUFaLEdBQXdCLE9BQXhCLEdBQWtDLE9BQS9DLElBQTBELElBQTFEO0FBQ0Q7O0FBRUQsUUFBSTRQLEtBQUtDLEdBQUwsR0FBV2hTLFFBQVgsQ0FBb0IsSUFBcEIsS0FBNkIrUixLQUFLakMsVUFBTCxJQUFtQixJQUFwRCxFQUEwRDtBQUN4RGlDLFdBQUtqQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0E7QUFDRDs7QUFFRG1DLGlCQUFhRixLQUFLbEMsT0FBbEI7O0FBRUFrQyxTQUFLakMsVUFBTCxHQUFrQixJQUFsQjs7QUFFQSxRQUFJLENBQUNpQyxLQUFLblIsT0FBTCxDQUFheVAsS0FBZCxJQUF1QixDQUFDMEIsS0FBS25SLE9BQUwsQ0FBYXlQLEtBQWIsQ0FBbUJySyxJQUEvQyxFQUFxRCxPQUFPK0wsS0FBSy9MLElBQUwsRUFBUDs7QUFFckQrTCxTQUFLbEMsT0FBTCxHQUFlalMsV0FBVyxZQUFZO0FBQ3BDLFVBQUltVSxLQUFLakMsVUFBTCxJQUFtQixJQUF2QixFQUE2QmlDLEtBQUsvTCxJQUFMO0FBQzlCLEtBRmMsRUFFWitMLEtBQUtuUixPQUFMLENBQWF5UCxLQUFiLENBQW1CckssSUFGUCxDQUFmO0FBR0QsR0EzQkQ7O0FBNkJBMkosVUFBUTNRLFNBQVIsQ0FBa0JrVCxhQUFsQixHQUFrQyxZQUFZO0FBQzVDLFNBQUssSUFBSUwsR0FBVCxJQUFnQixLQUFLOUIsT0FBckIsRUFBOEI7QUFDNUIsVUFBSSxLQUFLQSxPQUFMLENBQWE4QixHQUFiLENBQUosRUFBdUIsT0FBTyxJQUFQO0FBQ3hCOztBQUVELFdBQU8sS0FBUDtBQUNELEdBTkQ7O0FBUUFsQyxVQUFRM1EsU0FBUixDQUFrQm9TLEtBQWxCLEdBQTBCLFVBQVVVLEdBQVYsRUFBZTtBQUN2QyxRQUFJQyxPQUFPRCxlQUFlLEtBQUtmLFdBQXBCLEdBQ1RlLEdBRFMsR0FDSDVWLEVBQUU0VixJQUFJekksYUFBTixFQUFxQmpKLElBQXJCLENBQTBCLFFBQVEsS0FBSytCLElBQXZDLENBRFI7O0FBR0EsUUFBSSxDQUFDNFAsSUFBTCxFQUFXO0FBQ1RBLGFBQU8sSUFBSSxLQUFLaEIsV0FBVCxDQUFxQmUsSUFBSXpJLGFBQXpCLEVBQXdDLEtBQUtzSSxrQkFBTCxFQUF4QyxDQUFQO0FBQ0F6VixRQUFFNFYsSUFBSXpJLGFBQU4sRUFBcUJqSixJQUFyQixDQUEwQixRQUFRLEtBQUsrQixJQUF2QyxFQUE2QzRQLElBQTdDO0FBQ0Q7O0FBRUQsUUFBSUQsZUFBZTVWLEVBQUV3RCxLQUFyQixFQUE0QjtBQUMxQnFTLFdBQUtoQyxPQUFMLENBQWErQixJQUFJM1AsSUFBSixJQUFZLFVBQVosR0FBeUIsT0FBekIsR0FBbUMsT0FBaEQsSUFBMkQsS0FBM0Q7QUFDRDs7QUFFRCxRQUFJNFAsS0FBS0csYUFBTCxFQUFKLEVBQTBCOztBQUUxQkQsaUJBQWFGLEtBQUtsQyxPQUFsQjs7QUFFQWtDLFNBQUtqQyxVQUFMLEdBQWtCLEtBQWxCOztBQUVBLFFBQUksQ0FBQ2lDLEtBQUtuUixPQUFMLENBQWF5UCxLQUFkLElBQXVCLENBQUMwQixLQUFLblIsT0FBTCxDQUFheVAsS0FBYixDQUFtQjlKLElBQS9DLEVBQXFELE9BQU93TCxLQUFLeEwsSUFBTCxFQUFQOztBQUVyRHdMLFNBQUtsQyxPQUFMLEdBQWVqUyxXQUFXLFlBQVk7QUFDcEMsVUFBSW1VLEtBQUtqQyxVQUFMLElBQW1CLEtBQXZCLEVBQThCaUMsS0FBS3hMLElBQUw7QUFDL0IsS0FGYyxFQUVad0wsS0FBS25SLE9BQUwsQ0FBYXlQLEtBQWIsQ0FBbUI5SixJQUZQLENBQWY7QUFHRCxHQXhCRDs7QUEwQkFvSixVQUFRM1EsU0FBUixDQUFrQmdILElBQWxCLEdBQXlCLFlBQVk7QUFDbkMsUUFBSTdILElBQUlqQyxFQUFFd0QsS0FBRixDQUFRLGFBQWEsS0FBS3lDLElBQTFCLENBQVI7O0FBRUEsUUFBSSxLQUFLZ1EsVUFBTCxNQUFxQixLQUFLdkMsT0FBOUIsRUFBdUM7QUFDckMsV0FBSy9PLFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0JTLENBQXRCOztBQUVBLFVBQUlpVSxRQUFRbFcsRUFBRThLLFFBQUYsQ0FBVyxLQUFLbkcsUUFBTCxDQUFjLENBQWQsRUFBaUJ3UixhQUFqQixDQUErQnZQLGVBQTFDLEVBQTJELEtBQUtqQyxRQUFMLENBQWMsQ0FBZCxDQUEzRCxDQUFaO0FBQ0EsVUFBSTFDLEVBQUV3QixrQkFBRixNQUEwQixDQUFDeVMsS0FBL0IsRUFBc0M7QUFDdEMsVUFBSTlOLE9BQU8sSUFBWDs7QUFFQSxVQUFJZ08sT0FBTyxLQUFLTixHQUFMLEVBQVg7O0FBRUEsVUFBSU8sUUFBUSxLQUFLQyxNQUFMLENBQVksS0FBS3JRLElBQWpCLENBQVo7O0FBRUEsV0FBS3NRLFVBQUw7QUFDQUgsV0FBS25ULElBQUwsQ0FBVSxJQUFWLEVBQWdCb1QsS0FBaEI7QUFDQSxXQUFLMVIsUUFBTCxDQUFjMUIsSUFBZCxDQUFtQixrQkFBbkIsRUFBdUNvVCxLQUF2Qzs7QUFFQSxVQUFJLEtBQUszUixPQUFMLENBQWFxUCxTQUFqQixFQUE0QnFDLEtBQUs5USxRQUFMLENBQWMsTUFBZDs7QUFFNUIsVUFBSTBPLFlBQVksT0FBTyxLQUFLdFAsT0FBTCxDQUFhc1AsU0FBcEIsSUFBaUMsVUFBakMsR0FDZCxLQUFLdFAsT0FBTCxDQUFhc1AsU0FBYixDQUF1QjdQLElBQXZCLENBQTRCLElBQTVCLEVBQWtDaVMsS0FBSyxDQUFMLENBQWxDLEVBQTJDLEtBQUt6UixRQUFMLENBQWMsQ0FBZCxDQUEzQyxDQURjLEdBRWQsS0FBS0QsT0FBTCxDQUFhc1AsU0FGZjs7QUFJQSxVQUFJd0MsWUFBWSxjQUFoQjtBQUNBLFVBQUlDLFlBQVlELFVBQVV4USxJQUFWLENBQWVnTyxTQUFmLENBQWhCO0FBQ0EsVUFBSXlDLFNBQUosRUFBZXpDLFlBQVlBLFVBQVU5USxPQUFWLENBQWtCc1QsU0FBbEIsRUFBNkIsRUFBN0IsS0FBb0MsS0FBaEQ7O0FBRWZKLFdBQ0d4UyxNQURILEdBRUc2SixHQUZILENBRU8sRUFBRWlKLEtBQUssQ0FBUCxFQUFVdEksTUFBTSxDQUFoQixFQUFtQnVJLFNBQVMsT0FBNUIsRUFGUCxFQUdHclIsUUFISCxDQUdZME8sU0FIWixFQUlHOVAsSUFKSCxDQUlRLFFBQVEsS0FBSytCLElBSnJCLEVBSTJCLElBSjNCOztBQU1BLFdBQUt2QixPQUFMLENBQWEyUCxTQUFiLEdBQXlCK0IsS0FBSzlKLFFBQUwsQ0FBY3RNLEVBQUVPLFFBQUYsRUFBWTZDLElBQVosQ0FBaUIsS0FBS3NCLE9BQUwsQ0FBYTJQLFNBQTlCLENBQWQsQ0FBekIsR0FBbUYrQixLQUFLcEwsV0FBTCxDQUFpQixLQUFLckcsUUFBdEIsQ0FBbkY7QUFDQSxXQUFLQSxRQUFMLENBQWNuRCxPQUFkLENBQXNCLGlCQUFpQixLQUFLeUUsSUFBNUM7O0FBRUEsVUFBSWtDLE1BQWUsS0FBS3lPLFdBQUwsRUFBbkI7QUFDQSxVQUFJQyxjQUFlVCxLQUFLLENBQUwsRUFBUXhOLFdBQTNCO0FBQ0EsVUFBSWtPLGVBQWVWLEtBQUssQ0FBTCxFQUFROUwsWUFBM0I7O0FBRUEsVUFBSW1NLFNBQUosRUFBZTtBQUNiLFlBQUlNLGVBQWUvQyxTQUFuQjtBQUNBLFlBQUlnRCxjQUFjLEtBQUtKLFdBQUwsQ0FBaUIsS0FBS25DLFNBQXRCLENBQWxCOztBQUVBVCxvQkFBWUEsYUFBYSxRQUFiLElBQXlCN0wsSUFBSThPLE1BQUosR0FBYUgsWUFBYixHQUE0QkUsWUFBWUMsTUFBakUsR0FBMEUsS0FBMUUsR0FDQWpELGFBQWEsS0FBYixJQUF5QjdMLElBQUl1TyxHQUFKLEdBQWFJLFlBQWIsR0FBNEJFLFlBQVlOLEdBQWpFLEdBQTBFLFFBQTFFLEdBQ0ExQyxhQUFhLE9BQWIsSUFBeUI3TCxJQUFJOEYsS0FBSixHQUFhNEksV0FBYixHQUE0QkcsWUFBWUUsS0FBakUsR0FBMEUsTUFBMUUsR0FDQWxELGFBQWEsTUFBYixJQUF5QjdMLElBQUlpRyxJQUFKLEdBQWF5SSxXQUFiLEdBQTRCRyxZQUFZNUksSUFBakUsR0FBMEUsT0FBMUUsR0FDQTRGLFNBSlo7O0FBTUFvQyxhQUNHMVMsV0FESCxDQUNlcVQsWUFEZixFQUVHelIsUUFGSCxDQUVZME8sU0FGWjtBQUdEOztBQUVELFVBQUltRCxtQkFBbUIsS0FBS0MsbUJBQUwsQ0FBeUJwRCxTQUF6QixFQUFvQzdMLEdBQXBDLEVBQXlDME8sV0FBekMsRUFBc0RDLFlBQXRELENBQXZCOztBQUVBLFdBQUtPLGNBQUwsQ0FBb0JGLGdCQUFwQixFQUFzQ25ELFNBQXRDOztBQUVBLFVBQUk5SixXQUFXLFNBQVhBLFFBQVcsR0FBWTtBQUN6QixZQUFJb04saUJBQWlCbFAsS0FBS3dMLFVBQTFCO0FBQ0F4TCxhQUFLekQsUUFBTCxDQUFjbkQsT0FBZCxDQUFzQixjQUFjNEcsS0FBS25DLElBQXpDO0FBQ0FtQyxhQUFLd0wsVUFBTCxHQUFrQixJQUFsQjs7QUFFQSxZQUFJMEQsa0JBQWtCLEtBQXRCLEVBQTZCbFAsS0FBSzhNLEtBQUwsQ0FBVzlNLElBQVg7QUFDOUIsT0FORDs7QUFRQXBJLFFBQUV5QixPQUFGLENBQVVaLFVBQVYsSUFBd0IsS0FBS3VWLElBQUwsQ0FBVXRTLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBeEIsR0FDRXNTLEtBQ0c5VSxHQURILENBQ08saUJBRFAsRUFDMEI0SSxRQUQxQixFQUVHaEosb0JBRkgsQ0FFd0J1UyxRQUFRNVEsbUJBRmhDLENBREYsR0FJRXFILFVBSkY7QUFLRDtBQUNGLEdBMUVEOztBQTRFQXVKLFVBQVEzUSxTQUFSLENBQWtCdVUsY0FBbEIsR0FBbUMsVUFBVUUsTUFBVixFQUFrQnZELFNBQWxCLEVBQTZCO0FBQzlELFFBQUlvQyxPQUFTLEtBQUtOLEdBQUwsRUFBYjtBQUNBLFFBQUlvQixRQUFTZCxLQUFLLENBQUwsRUFBUXhOLFdBQXJCO0FBQ0EsUUFBSTRPLFNBQVNwQixLQUFLLENBQUwsRUFBUTlMLFlBQXJCOztBQUVBO0FBQ0EsUUFBSW1OLFlBQVlqSixTQUFTNEgsS0FBSzNJLEdBQUwsQ0FBUyxZQUFULENBQVQsRUFBaUMsRUFBakMsQ0FBaEI7QUFDQSxRQUFJaUssYUFBYWxKLFNBQVM0SCxLQUFLM0ksR0FBTCxDQUFTLGFBQVQsQ0FBVCxFQUFrQyxFQUFsQyxDQUFqQjs7QUFFQTtBQUNBLFFBQUlrSyxNQUFNRixTQUFOLENBQUosRUFBdUJBLFlBQWEsQ0FBYjtBQUN2QixRQUFJRSxNQUFNRCxVQUFOLENBQUosRUFBdUJBLGFBQWEsQ0FBYjs7QUFFdkJILFdBQU9iLEdBQVAsSUFBZWUsU0FBZjtBQUNBRixXQUFPbkosSUFBUCxJQUFlc0osVUFBZjs7QUFFQTtBQUNBO0FBQ0ExWCxNQUFFdVgsTUFBRixDQUFTSyxTQUFULENBQW1CeEIsS0FBSyxDQUFMLENBQW5CLEVBQTRCcFcsRUFBRTRFLE1BQUYsQ0FBUztBQUNuQ2lULGFBQU8sZUFBVUMsS0FBVixFQUFpQjtBQUN0QjFCLGFBQUszSSxHQUFMLENBQVM7QUFDUGlKLGVBQUt4SSxLQUFLNkosS0FBTCxDQUFXRCxNQUFNcEIsR0FBakIsQ0FERTtBQUVQdEksZ0JBQU1GLEtBQUs2SixLQUFMLENBQVdELE1BQU0xSixJQUFqQjtBQUZDLFNBQVQ7QUFJRDtBQU5rQyxLQUFULEVBT3pCbUosTUFQeUIsQ0FBNUIsRUFPWSxDQVBaOztBQVNBbkIsU0FBSzlRLFFBQUwsQ0FBYyxJQUFkOztBQUVBO0FBQ0EsUUFBSXVSLGNBQWVULEtBQUssQ0FBTCxFQUFReE4sV0FBM0I7QUFDQSxRQUFJa08sZUFBZVYsS0FBSyxDQUFMLEVBQVE5TCxZQUEzQjs7QUFFQSxRQUFJMEosYUFBYSxLQUFiLElBQXNCOEMsZ0JBQWdCVSxNQUExQyxFQUFrRDtBQUNoREQsYUFBT2IsR0FBUCxHQUFhYSxPQUFPYixHQUFQLEdBQWFjLE1BQWIsR0FBc0JWLFlBQW5DO0FBQ0Q7O0FBRUQsUUFBSS9PLFFBQVEsS0FBS2lRLHdCQUFMLENBQThCaEUsU0FBOUIsRUFBeUN1RCxNQUF6QyxFQUFpRFYsV0FBakQsRUFBOERDLFlBQTlELENBQVo7O0FBRUEsUUFBSS9PLE1BQU1xRyxJQUFWLEVBQWdCbUosT0FBT25KLElBQVAsSUFBZXJHLE1BQU1xRyxJQUFyQixDQUFoQixLQUNLbUosT0FBT2IsR0FBUCxJQUFjM08sTUFBTTJPLEdBQXBCOztBQUVMLFFBQUl1QixhQUFzQixhQUFhalMsSUFBYixDQUFrQmdPLFNBQWxCLENBQTFCO0FBQ0EsUUFBSWtFLGFBQXNCRCxhQUFhbFEsTUFBTXFHLElBQU4sR0FBYSxDQUFiLEdBQWlCOEksS0FBakIsR0FBeUJMLFdBQXRDLEdBQW9EOU8sTUFBTTJPLEdBQU4sR0FBWSxDQUFaLEdBQWdCYyxNQUFoQixHQUF5QlYsWUFBdkc7QUFDQSxRQUFJcUIsc0JBQXNCRixhQUFhLGFBQWIsR0FBNkIsY0FBdkQ7O0FBRUE3QixTQUFLbUIsTUFBTCxDQUFZQSxNQUFaO0FBQ0EsU0FBS2EsWUFBTCxDQUFrQkYsVUFBbEIsRUFBOEI5QixLQUFLLENBQUwsRUFBUStCLG1CQUFSLENBQTlCLEVBQTRERixVQUE1RDtBQUNELEdBaEREOztBQWtEQXhFLFVBQVEzUSxTQUFSLENBQWtCc1YsWUFBbEIsR0FBaUMsVUFBVXJRLEtBQVYsRUFBaUI2QixTQUFqQixFQUE0QnFPLFVBQTVCLEVBQXdDO0FBQ3ZFLFNBQUtJLEtBQUwsR0FDRzVLLEdBREgsQ0FDT3dLLGFBQWEsTUFBYixHQUFzQixLQUQ3QixFQUNvQyxNQUFNLElBQUlsUSxRQUFRNkIsU0FBbEIsSUFBK0IsR0FEbkUsRUFFRzZELEdBRkgsQ0FFT3dLLGFBQWEsS0FBYixHQUFxQixNQUY1QixFQUVvQyxFQUZwQztBQUdELEdBSkQ7O0FBTUF4RSxVQUFRM1EsU0FBUixDQUFrQnlULFVBQWxCLEdBQStCLFlBQVk7QUFDekMsUUFBSUgsT0FBUSxLQUFLTixHQUFMLEVBQVo7QUFDQSxRQUFJNUIsUUFBUSxLQUFLb0UsUUFBTCxFQUFaOztBQUVBLFFBQUksS0FBSzVULE9BQUwsQ0FBYTBQLElBQWpCLEVBQXVCO0FBQ3JCLFVBQUksS0FBSzFQLE9BQUwsQ0FBYTZQLFFBQWpCLEVBQTJCO0FBQ3pCTCxnQkFBUTlCLGFBQWE4QixLQUFiLEVBQW9CLEtBQUt4UCxPQUFMLENBQWE0TixTQUFqQyxFQUE0QyxLQUFLNU4sT0FBTCxDQUFhNk4sVUFBekQsQ0FBUjtBQUNEOztBQUVENkQsV0FBS2hULElBQUwsQ0FBVSxnQkFBVixFQUE0QmdSLElBQTVCLENBQWlDRixLQUFqQztBQUNELEtBTkQsTUFNTztBQUNMa0MsV0FBS2hULElBQUwsQ0FBVSxnQkFBVixFQUE0Qm1WLElBQTVCLENBQWlDckUsS0FBakM7QUFDRDs7QUFFRGtDLFNBQUsxUyxXQUFMLENBQWlCLCtCQUFqQjtBQUNELEdBZkQ7O0FBaUJBK1AsVUFBUTNRLFNBQVIsQ0FBa0J1SCxJQUFsQixHQUF5QixVQUFVOUksUUFBVixFQUFvQjtBQUMzQyxRQUFJNkcsT0FBTyxJQUFYO0FBQ0EsUUFBSWdPLE9BQU9wVyxFQUFFLEtBQUtvVyxJQUFQLENBQVg7QUFDQSxRQUFJblUsSUFBT2pDLEVBQUV3RCxLQUFGLENBQVEsYUFBYSxLQUFLeUMsSUFBMUIsQ0FBWDs7QUFFQSxhQUFTaUUsUUFBVCxHQUFvQjtBQUNsQixVQUFJOUIsS0FBS3dMLFVBQUwsSUFBbUIsSUFBdkIsRUFBNkJ3QyxLQUFLeFMsTUFBTDtBQUM3QixVQUFJd0UsS0FBS3pELFFBQVQsRUFBbUI7QUFBRTtBQUNuQnlELGFBQUt6RCxRQUFMLENBQ0dhLFVBREgsQ0FDYyxrQkFEZCxFQUVHaEUsT0FGSCxDQUVXLGVBQWU0RyxLQUFLbkMsSUFGL0I7QUFHRDtBQUNEMUUsa0JBQVlBLFVBQVo7QUFDRDs7QUFFRCxTQUFLb0QsUUFBTCxDQUFjbkQsT0FBZCxDQUFzQlMsQ0FBdEI7O0FBRUEsUUFBSUEsRUFBRXdCLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCMlMsU0FBSzFTLFdBQUwsQ0FBaUIsSUFBakI7O0FBRUExRCxNQUFFeUIsT0FBRixDQUFVWixVQUFWLElBQXdCdVYsS0FBS3RTLFFBQUwsQ0FBYyxNQUFkLENBQXhCLEdBQ0VzUyxLQUNHOVUsR0FESCxDQUNPLGlCQURQLEVBQzBCNEksUUFEMUIsRUFFR2hKLG9CQUZILENBRXdCdVMsUUFBUTVRLG1CQUZoQyxDQURGLEdBSUVxSCxVQUpGOztBQU1BLFNBQUswSixVQUFMLEdBQWtCLElBQWxCOztBQUVBLFdBQU8sSUFBUDtBQUNELEdBOUJEOztBQWdDQUgsVUFBUTNRLFNBQVIsQ0FBa0JzUyxRQUFsQixHQUE2QixZQUFZO0FBQ3ZDLFFBQUlvRCxLQUFLLEtBQUs3VCxRQUFkO0FBQ0EsUUFBSTZULEdBQUd2VixJQUFILENBQVEsT0FBUixLQUFvQixPQUFPdVYsR0FBR3ZWLElBQUgsQ0FBUSxxQkFBUixDQUFQLElBQXlDLFFBQWpFLEVBQTJFO0FBQ3pFdVYsU0FBR3ZWLElBQUgsQ0FBUSxxQkFBUixFQUErQnVWLEdBQUd2VixJQUFILENBQVEsT0FBUixLQUFvQixFQUFuRCxFQUF1REEsSUFBdkQsQ0FBNEQsT0FBNUQsRUFBcUUsRUFBckU7QUFDRDtBQUNGLEdBTEQ7O0FBT0F3USxVQUFRM1EsU0FBUixDQUFrQm1ULFVBQWxCLEdBQStCLFlBQVk7QUFDekMsV0FBTyxLQUFLcUMsUUFBTCxFQUFQO0FBQ0QsR0FGRDs7QUFJQTdFLFVBQVEzUSxTQUFSLENBQWtCOFQsV0FBbEIsR0FBZ0MsVUFBVWpTLFFBQVYsRUFBb0I7QUFDbERBLGVBQWFBLFlBQVksS0FBS0EsUUFBOUI7O0FBRUEsUUFBSXJFLEtBQVNxRSxTQUFTLENBQVQsQ0FBYjtBQUNBLFFBQUk4VCxTQUFTblksR0FBR3lHLE9BQUgsSUFBYyxNQUEzQjs7QUFFQSxRQUFJMlIsU0FBWXBZLEdBQUcwTixxQkFBSCxFQUFoQjtBQUNBLFFBQUkwSyxPQUFPeEIsS0FBUCxJQUFnQixJQUFwQixFQUEwQjtBQUN4QjtBQUNBd0IsZUFBUzFZLEVBQUU0RSxNQUFGLENBQVMsRUFBVCxFQUFhOFQsTUFBYixFQUFxQixFQUFFeEIsT0FBT3dCLE9BQU96SyxLQUFQLEdBQWV5SyxPQUFPdEssSUFBL0IsRUFBcUNvSixRQUFRa0IsT0FBT3pCLE1BQVAsR0FBZ0J5QixPQUFPaEMsR0FBcEUsRUFBckIsQ0FBVDtBQUNEO0FBQ0QsUUFBSWlDLFFBQVF2UCxPQUFPd1AsVUFBUCxJQUFxQnRZLGNBQWM4SSxPQUFPd1AsVUFBdEQ7QUFDQTtBQUNBO0FBQ0EsUUFBSUMsV0FBWUosU0FBUyxFQUFFL0IsS0FBSyxDQUFQLEVBQVV0SSxNQUFNLENBQWhCLEVBQVQsR0FBZ0N1SyxRQUFRLElBQVIsR0FBZWhVLFNBQVM0UyxNQUFULEVBQS9EO0FBQ0EsUUFBSXVCLFNBQVksRUFBRUEsUUFBUUwsU0FBU2xZLFNBQVNxRyxlQUFULENBQXlCMkYsU0FBekIsSUFBc0NoTSxTQUFTK0ssSUFBVCxDQUFjaUIsU0FBN0QsR0FBeUU1SCxTQUFTNEgsU0FBVCxFQUFuRixFQUFoQjtBQUNBLFFBQUl3TSxZQUFZTixTQUFTLEVBQUV2QixPQUFPbFgsRUFBRW9KLE1BQUYsRUFBVThOLEtBQVYsRUFBVCxFQUE0Qk0sUUFBUXhYLEVBQUVvSixNQUFGLEVBQVVvTyxNQUFWLEVBQXBDLEVBQVQsR0FBb0UsSUFBcEY7O0FBRUEsV0FBT3hYLEVBQUU0RSxNQUFGLENBQVMsRUFBVCxFQUFhOFQsTUFBYixFQUFxQkksTUFBckIsRUFBNkJDLFNBQTdCLEVBQXdDRixRQUF4QyxDQUFQO0FBQ0QsR0FuQkQ7O0FBcUJBcEYsVUFBUTNRLFNBQVIsQ0FBa0JzVSxtQkFBbEIsR0FBd0MsVUFBVXBELFNBQVYsRUFBcUI3TCxHQUFyQixFQUEwQjBPLFdBQTFCLEVBQXVDQyxZQUF2QyxFQUFxRDtBQUMzRixXQUFPOUMsYUFBYSxRQUFiLEdBQXdCLEVBQUUwQyxLQUFLdk8sSUFBSXVPLEdBQUosR0FBVXZPLElBQUlxUCxNQUFyQixFQUErQnBKLE1BQU1qRyxJQUFJaUcsSUFBSixHQUFXakcsSUFBSStPLEtBQUosR0FBWSxDQUF2QixHQUEyQkwsY0FBYyxDQUE5RSxFQUF4QixHQUNBN0MsYUFBYSxLQUFiLEdBQXdCLEVBQUUwQyxLQUFLdk8sSUFBSXVPLEdBQUosR0FBVUksWUFBakIsRUFBK0IxSSxNQUFNakcsSUFBSWlHLElBQUosR0FBV2pHLElBQUkrTyxLQUFKLEdBQVksQ0FBdkIsR0FBMkJMLGNBQWMsQ0FBOUUsRUFBeEIsR0FDQTdDLGFBQWEsTUFBYixHQUF3QixFQUFFMEMsS0FBS3ZPLElBQUl1TyxHQUFKLEdBQVV2TyxJQUFJcVAsTUFBSixHQUFhLENBQXZCLEdBQTJCVixlQUFlLENBQWpELEVBQW9EMUksTUFBTWpHLElBQUlpRyxJQUFKLEdBQVd5SSxXQUFyRSxFQUF4QjtBQUNILDhCQUEyQixFQUFFSCxLQUFLdk8sSUFBSXVPLEdBQUosR0FBVXZPLElBQUlxUCxNQUFKLEdBQWEsQ0FBdkIsR0FBMkJWLGVBQWUsQ0FBakQsRUFBb0QxSSxNQUFNakcsSUFBSWlHLElBQUosR0FBV2pHLElBQUkrTyxLQUF6RSxFQUgvQjtBQUtELEdBTkQ7O0FBUUF6RCxVQUFRM1EsU0FBUixDQUFrQmtWLHdCQUFsQixHQUE2QyxVQUFVaEUsU0FBVixFQUFxQjdMLEdBQXJCLEVBQTBCME8sV0FBMUIsRUFBdUNDLFlBQXZDLEVBQXFEO0FBQ2hHLFFBQUkvTyxRQUFRLEVBQUUyTyxLQUFLLENBQVAsRUFBVXRJLE1BQU0sQ0FBaEIsRUFBWjtBQUNBLFFBQUksQ0FBQyxLQUFLcUcsU0FBVixFQUFxQixPQUFPMU0sS0FBUDs7QUFFckIsUUFBSWlSLGtCQUFrQixLQUFLdFUsT0FBTCxDQUFhNFAsUUFBYixJQUF5QixLQUFLNVAsT0FBTCxDQUFhNFAsUUFBYixDQUFzQjFGLE9BQS9DLElBQTBELENBQWhGO0FBQ0EsUUFBSXFLLHFCQUFxQixLQUFLckMsV0FBTCxDQUFpQixLQUFLbkMsU0FBdEIsQ0FBekI7O0FBRUEsUUFBSSxhQUFhek8sSUFBYixDQUFrQmdPLFNBQWxCLENBQUosRUFBa0M7QUFDaEMsVUFBSWtGLGdCQUFtQi9RLElBQUl1TyxHQUFKLEdBQVVzQyxlQUFWLEdBQTRCQyxtQkFBbUJILE1BQXRFO0FBQ0EsVUFBSUssbUJBQW1CaFIsSUFBSXVPLEdBQUosR0FBVXNDLGVBQVYsR0FBNEJDLG1CQUFtQkgsTUFBL0MsR0FBd0RoQyxZQUEvRTtBQUNBLFVBQUlvQyxnQkFBZ0JELG1CQUFtQnZDLEdBQXZDLEVBQTRDO0FBQUU7QUFDNUMzTyxjQUFNMk8sR0FBTixHQUFZdUMsbUJBQW1CdkMsR0FBbkIsR0FBeUJ3QyxhQUFyQztBQUNELE9BRkQsTUFFTyxJQUFJQyxtQkFBbUJGLG1CQUFtQnZDLEdBQW5CLEdBQXlCdUMsbUJBQW1CekIsTUFBbkUsRUFBMkU7QUFBRTtBQUNsRnpQLGNBQU0yTyxHQUFOLEdBQVl1QyxtQkFBbUJ2QyxHQUFuQixHQUF5QnVDLG1CQUFtQnpCLE1BQTVDLEdBQXFEMkIsZ0JBQWpFO0FBQ0Q7QUFDRixLQVJELE1BUU87QUFDTCxVQUFJQyxpQkFBa0JqUixJQUFJaUcsSUFBSixHQUFXNEssZUFBakM7QUFDQSxVQUFJSyxrQkFBa0JsUixJQUFJaUcsSUFBSixHQUFXNEssZUFBWCxHQUE2Qm5DLFdBQW5EO0FBQ0EsVUFBSXVDLGlCQUFpQkgsbUJBQW1CN0ssSUFBeEMsRUFBOEM7QUFBRTtBQUM5Q3JHLGNBQU1xRyxJQUFOLEdBQWE2SyxtQkFBbUI3SyxJQUFuQixHQUEwQmdMLGNBQXZDO0FBQ0QsT0FGRCxNQUVPLElBQUlDLGtCQUFrQkosbUJBQW1CaEwsS0FBekMsRUFBZ0Q7QUFBRTtBQUN2RGxHLGNBQU1xRyxJQUFOLEdBQWE2SyxtQkFBbUI3SyxJQUFuQixHQUEwQjZLLG1CQUFtQi9CLEtBQTdDLEdBQXFEbUMsZUFBbEU7QUFDRDtBQUNGOztBQUVELFdBQU90UixLQUFQO0FBQ0QsR0ExQkQ7O0FBNEJBMEwsVUFBUTNRLFNBQVIsQ0FBa0J3VixRQUFsQixHQUE2QixZQUFZO0FBQ3ZDLFFBQUlwRSxLQUFKO0FBQ0EsUUFBSXNFLEtBQUssS0FBSzdULFFBQWQ7QUFDQSxRQUFJMlUsSUFBSyxLQUFLNVUsT0FBZDs7QUFFQXdQLFlBQVFzRSxHQUFHdlYsSUFBSCxDQUFRLHFCQUFSLE1BQ0YsT0FBT3FXLEVBQUVwRixLQUFULElBQWtCLFVBQWxCLEdBQStCb0YsRUFBRXBGLEtBQUYsQ0FBUS9QLElBQVIsQ0FBYXFVLEdBQUcsQ0FBSCxDQUFiLENBQS9CLEdBQXNEYyxFQUFFcEYsS0FEdEQsQ0FBUjs7QUFHQSxXQUFPQSxLQUFQO0FBQ0QsR0FURDs7QUFXQVQsVUFBUTNRLFNBQVIsQ0FBa0J3VCxNQUFsQixHQUEyQixVQUFVaUQsTUFBVixFQUFrQjtBQUMzQztBQUFHQSxnQkFBVSxDQUFDLEVBQUVyTCxLQUFLc0wsTUFBTCxLQUFnQixPQUFsQixDQUFYO0FBQUgsYUFDT2paLFNBQVNrWixjQUFULENBQXdCRixNQUF4QixDQURQO0FBRUEsV0FBT0EsTUFBUDtBQUNELEdBSkQ7O0FBTUE5RixVQUFRM1EsU0FBUixDQUFrQmdULEdBQWxCLEdBQXdCLFlBQVk7QUFDbEMsUUFBSSxDQUFDLEtBQUtNLElBQVYsRUFBZ0I7QUFDZCxXQUFLQSxJQUFMLEdBQVlwVyxFQUFFLEtBQUswRSxPQUFMLENBQWF1UCxRQUFmLENBQVo7QUFDQSxVQUFJLEtBQUttQyxJQUFMLENBQVU5UyxNQUFWLElBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGNBQU0sSUFBSXZELEtBQUosQ0FBVSxLQUFLa0csSUFBTCxHQUFZLGlFQUF0QixDQUFOO0FBQ0Q7QUFDRjtBQUNELFdBQU8sS0FBS21RLElBQVo7QUFDRCxHQVJEOztBQVVBM0MsVUFBUTNRLFNBQVIsQ0FBa0J1VixLQUFsQixHQUEwQixZQUFZO0FBQ3BDLFdBQVEsS0FBS3FCLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsS0FBSzVELEdBQUwsR0FBVzFTLElBQVgsQ0FBZ0IsZ0JBQWhCLENBQXJDO0FBQ0QsR0FGRDs7QUFJQXFRLFVBQVEzUSxTQUFSLENBQWtCNlcsTUFBbEIsR0FBMkIsWUFBWTtBQUNyQyxTQUFLakcsT0FBTCxHQUFlLElBQWY7QUFDRCxHQUZEOztBQUlBRCxVQUFRM1EsU0FBUixDQUFrQjhXLE9BQWxCLEdBQTRCLFlBQVk7QUFDdEMsU0FBS2xHLE9BQUwsR0FBZSxLQUFmO0FBQ0QsR0FGRDs7QUFJQUQsVUFBUTNRLFNBQVIsQ0FBa0IrVyxhQUFsQixHQUFrQyxZQUFZO0FBQzVDLFNBQUtuRyxPQUFMLEdBQWUsQ0FBQyxLQUFLQSxPQUFyQjtBQUNELEdBRkQ7O0FBSUFELFVBQVEzUSxTQUFSLENBQWtCMkMsTUFBbEIsR0FBMkIsVUFBVXhELENBQVYsRUFBYTtBQUN0QyxRQUFJNFQsT0FBTyxJQUFYO0FBQ0EsUUFBSTVULENBQUosRUFBTztBQUNMNFQsYUFBTzdWLEVBQUVpQyxFQUFFa0wsYUFBSixFQUFtQmpKLElBQW5CLENBQXdCLFFBQVEsS0FBSytCLElBQXJDLENBQVA7QUFDQSxVQUFJLENBQUM0UCxJQUFMLEVBQVc7QUFDVEEsZUFBTyxJQUFJLEtBQUtoQixXQUFULENBQXFCNVMsRUFBRWtMLGFBQXZCLEVBQXNDLEtBQUtzSSxrQkFBTCxFQUF0QyxDQUFQO0FBQ0F6VixVQUFFaUMsRUFBRWtMLGFBQUosRUFBbUJqSixJQUFuQixDQUF3QixRQUFRLEtBQUsrQixJQUFyQyxFQUEyQzRQLElBQTNDO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJNVQsQ0FBSixFQUFPO0FBQ0w0VCxXQUFLaEMsT0FBTCxDQUFhYyxLQUFiLEdBQXFCLENBQUNrQixLQUFLaEMsT0FBTCxDQUFhYyxLQUFuQztBQUNBLFVBQUlrQixLQUFLRyxhQUFMLEVBQUosRUFBMEJILEtBQUtaLEtBQUwsQ0FBV1ksSUFBWCxFQUExQixLQUNLQSxLQUFLWCxLQUFMLENBQVdXLElBQVg7QUFDTixLQUpELE1BSU87QUFDTEEsV0FBS0MsR0FBTCxHQUFXaFMsUUFBWCxDQUFvQixJQUFwQixJQUE0QitSLEtBQUtYLEtBQUwsQ0FBV1csSUFBWCxDQUE1QixHQUErQ0EsS0FBS1osS0FBTCxDQUFXWSxJQUFYLENBQS9DO0FBQ0Q7QUFDRixHQWpCRDs7QUFtQkFwQyxVQUFRM1EsU0FBUixDQUFrQmdYLE9BQWxCLEdBQTRCLFlBQVk7QUFDdEMsUUFBSTFSLE9BQU8sSUFBWDtBQUNBMk4saUJBQWEsS0FBS3BDLE9BQWxCO0FBQ0EsU0FBS3RKLElBQUwsQ0FBVSxZQUFZO0FBQ3BCakMsV0FBS3pELFFBQUwsQ0FBYytILEdBQWQsQ0FBa0IsTUFBTXRFLEtBQUtuQyxJQUE3QixFQUFtQzRJLFVBQW5DLENBQThDLFFBQVF6RyxLQUFLbkMsSUFBM0Q7QUFDQSxVQUFJbUMsS0FBS2dPLElBQVQsRUFBZTtBQUNiaE8sYUFBS2dPLElBQUwsQ0FBVXhTLE1BQVY7QUFDRDtBQUNEd0UsV0FBS2dPLElBQUwsR0FBWSxJQUFaO0FBQ0FoTyxXQUFLc1IsTUFBTCxHQUFjLElBQWQ7QUFDQXRSLFdBQUtxTSxTQUFMLEdBQWlCLElBQWpCO0FBQ0FyTSxXQUFLekQsUUFBTCxHQUFnQixJQUFoQjtBQUNELEtBVEQ7QUFVRCxHQWJEOztBQWVBOE8sVUFBUTNRLFNBQVIsQ0FBa0JzUCxZQUFsQixHQUFpQyxVQUFVQyxVQUFWLEVBQXNCO0FBQ3JELFdBQU9ELGFBQWFDLFVBQWIsRUFBeUIsS0FBSzNOLE9BQUwsQ0FBYTROLFNBQXRDLEVBQWlELEtBQUs1TixPQUFMLENBQWE2TixVQUE5RCxDQUFQO0FBQ0QsR0FGRDs7QUFJQTtBQUNBOztBQUVBLFdBQVN4TyxNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUtDLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlsQixRQUFVL0MsRUFBRSxJQUFGLENBQWQ7QUFDQSxVQUFJa0UsT0FBVW5CLE1BQU1tQixJQUFOLENBQVcsWUFBWCxDQUFkO0FBQ0EsVUFBSVEsVUFBVSxRQUFPVixNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUEzQzs7QUFFQSxVQUFJLENBQUNFLElBQUQsSUFBUyxlQUFlOEIsSUFBZixDQUFvQmhDLE1BQXBCLENBQWIsRUFBMEM7QUFDMUMsVUFBSSxDQUFDRSxJQUFMLEVBQVduQixNQUFNbUIsSUFBTixDQUFXLFlBQVgsRUFBMEJBLE9BQU8sSUFBSXVQLE9BQUosQ0FBWSxJQUFaLEVBQWtCL08sT0FBbEIsQ0FBakM7QUFDWCxVQUFJLE9BQU9WLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JFLEtBQUtGLE1BQUw7QUFDaEMsS0FSTSxDQUFQO0FBU0Q7O0FBRUQsTUFBSUksTUFBTXBFLEVBQUVFLEVBQUYsQ0FBSzZaLE9BQWY7O0FBRUEvWixJQUFFRSxFQUFGLENBQUs2WixPQUFMLEdBQTJCaFcsTUFBM0I7QUFDQS9ELElBQUVFLEVBQUYsQ0FBSzZaLE9BQUwsQ0FBYXpWLFdBQWIsR0FBMkJtUCxPQUEzQjs7QUFHQTtBQUNBOztBQUVBelQsSUFBRUUsRUFBRixDQUFLNlosT0FBTCxDQUFheFYsVUFBYixHQUEwQixZQUFZO0FBQ3BDdkUsTUFBRUUsRUFBRixDQUFLNlosT0FBTCxHQUFlM1YsR0FBZjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7QUFLRCxDQTNwQkEsQ0EycEJDdEUsTUEzcEJELENBQUQ7O0FBNnBCQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVFLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSWdhLFVBQVUsU0FBVkEsT0FBVSxDQUFVdlYsT0FBVixFQUFtQkMsT0FBbkIsRUFBNEI7QUFDeEMsU0FBS29QLElBQUwsQ0FBVSxTQUFWLEVBQXFCclAsT0FBckIsRUFBOEJDLE9BQTlCO0FBQ0QsR0FGRDs7QUFJQSxNQUFJLENBQUMxRSxFQUFFRSxFQUFGLENBQUs2WixPQUFWLEVBQW1CLE1BQU0sSUFBSWhhLEtBQUosQ0FBVSw2QkFBVixDQUFOOztBQUVuQmlhLFVBQVFwWCxPQUFSLEdBQW1CLE9BQW5COztBQUVBb1gsVUFBUW5WLFFBQVIsR0FBbUI3RSxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYTVFLEVBQUVFLEVBQUYsQ0FBSzZaLE9BQUwsQ0FBYXpWLFdBQWIsQ0FBeUJPLFFBQXRDLEVBQWdEO0FBQ2pFbVAsZUFBVyxPQURzRDtBQUVqRXhTLGFBQVMsT0FGd0Q7QUFHakV5WSxhQUFTLEVBSHdEO0FBSWpFaEcsY0FBVTtBQUp1RCxHQUFoRCxDQUFuQjs7QUFRQTtBQUNBOztBQUVBK0YsVUFBUWxYLFNBQVIsR0FBb0I5QyxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYTVFLEVBQUVFLEVBQUYsQ0FBSzZaLE9BQUwsQ0FBYXpWLFdBQWIsQ0FBeUJ4QixTQUF0QyxDQUFwQjs7QUFFQWtYLFVBQVFsWCxTQUFSLENBQWtCK1IsV0FBbEIsR0FBZ0NtRixPQUFoQzs7QUFFQUEsVUFBUWxYLFNBQVIsQ0FBa0J1UyxXQUFsQixHQUFnQyxZQUFZO0FBQzFDLFdBQU8yRSxRQUFRblYsUUFBZjtBQUNELEdBRkQ7O0FBSUFtVixVQUFRbFgsU0FBUixDQUFrQnlULFVBQWxCLEdBQStCLFlBQVk7QUFDekMsUUFBSUgsT0FBVSxLQUFLTixHQUFMLEVBQWQ7QUFDQSxRQUFJNUIsUUFBVSxLQUFLb0UsUUFBTCxFQUFkO0FBQ0EsUUFBSTJCLFVBQVUsS0FBS0MsVUFBTCxFQUFkOztBQUVBLFFBQUksS0FBS3hWLE9BQUwsQ0FBYTBQLElBQWpCLEVBQXVCO0FBQ3JCLFVBQUkrRixxQkFBcUJGLE9BQXJCLHlDQUFxQkEsT0FBckIsQ0FBSjs7QUFFQSxVQUFJLEtBQUt2VixPQUFMLENBQWE2UCxRQUFqQixFQUEyQjtBQUN6QkwsZ0JBQVEsS0FBSzlCLFlBQUwsQ0FBa0I4QixLQUFsQixDQUFSOztBQUVBLFlBQUlpRyxnQkFBZ0IsUUFBcEIsRUFBOEI7QUFDNUJGLG9CQUFVLEtBQUs3SCxZQUFMLENBQWtCNkgsT0FBbEIsQ0FBVjtBQUNEO0FBQ0Y7O0FBRUQ3RCxXQUFLaFQsSUFBTCxDQUFVLGdCQUFWLEVBQTRCZ1IsSUFBNUIsQ0FBaUNGLEtBQWpDO0FBQ0FrQyxXQUFLaFQsSUFBTCxDQUFVLGtCQUFWLEVBQThCb0UsUUFBOUIsR0FBeUM1RCxNQUF6QyxHQUFrRDNDLEdBQWxELEdBQ0VrWixnQkFBZ0IsUUFBaEIsR0FBMkIsTUFBM0IsR0FBb0MsUUFEdEMsRUFFRUYsT0FGRjtBQUdELEtBZkQsTUFlTztBQUNMN0QsV0FBS2hULElBQUwsQ0FBVSxnQkFBVixFQUE0Qm1WLElBQTVCLENBQWlDckUsS0FBakM7QUFDQWtDLFdBQUtoVCxJQUFMLENBQVUsa0JBQVYsRUFBOEJvRSxRQUE5QixHQUF5QzVELE1BQXpDLEdBQWtEM0MsR0FBbEQsR0FBd0RzWCxJQUF4RCxDQUE2RDBCLE9BQTdEO0FBQ0Q7O0FBRUQ3RCxTQUFLMVMsV0FBTCxDQUFpQiwrQkFBakI7O0FBRUE7QUFDQTtBQUNBLFFBQUksQ0FBQzBTLEtBQUtoVCxJQUFMLENBQVUsZ0JBQVYsRUFBNEJnUixJQUE1QixFQUFMLEVBQXlDZ0MsS0FBS2hULElBQUwsQ0FBVSxnQkFBVixFQUE0QmlILElBQTVCO0FBQzFDLEdBOUJEOztBQWdDQTJQLFVBQVFsWCxTQUFSLENBQWtCbVQsVUFBbEIsR0FBK0IsWUFBWTtBQUN6QyxXQUFPLEtBQUtxQyxRQUFMLE1BQW1CLEtBQUs0QixVQUFMLEVBQTFCO0FBQ0QsR0FGRDs7QUFJQUYsVUFBUWxYLFNBQVIsQ0FBa0JvWCxVQUFsQixHQUErQixZQUFZO0FBQ3pDLFFBQUkxQixLQUFLLEtBQUs3VCxRQUFkO0FBQ0EsUUFBSTJVLElBQUssS0FBSzVVLE9BQWQ7O0FBRUEsV0FBTzhULEdBQUd2VixJQUFILENBQVEsY0FBUixNQUNELE9BQU9xVyxFQUFFVyxPQUFULElBQW9CLFVBQXBCLEdBQ0ZYLEVBQUVXLE9BQUYsQ0FBVTlWLElBQVYsQ0FBZXFVLEdBQUcsQ0FBSCxDQUFmLENBREUsR0FFRmMsRUFBRVcsT0FIQyxDQUFQO0FBSUQsR0FSRDs7QUFVQUQsVUFBUWxYLFNBQVIsQ0FBa0J1VixLQUFsQixHQUEwQixZQUFZO0FBQ3BDLFdBQVEsS0FBS3FCLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsS0FBSzVELEdBQUwsR0FBVzFTLElBQVgsQ0FBZ0IsUUFBaEIsQ0FBckM7QUFDRCxHQUZEOztBQUtBO0FBQ0E7O0FBRUEsV0FBU1csTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLQyxJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJbEIsUUFBVS9DLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSWtFLE9BQVVuQixNQUFNbUIsSUFBTixDQUFXLFlBQVgsQ0FBZDtBQUNBLFVBQUlRLFVBQVUsUUFBT1YsTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFqQixJQUE2QkEsTUFBM0M7O0FBRUEsVUFBSSxDQUFDRSxJQUFELElBQVMsZUFBZThCLElBQWYsQ0FBb0JoQyxNQUFwQixDQUFiLEVBQTBDO0FBQzFDLFVBQUksQ0FBQ0UsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxZQUFYLEVBQTBCQSxPQUFPLElBQUk4VixPQUFKLENBQVksSUFBWixFQUFrQnRWLE9BQWxCLENBQWpDO0FBQ1gsVUFBSSxPQUFPVixNQUFQLElBQWlCLFFBQXJCLEVBQStCRSxLQUFLRixNQUFMO0FBQ2hDLEtBUk0sQ0FBUDtBQVNEOztBQUVELE1BQUlJLE1BQU1wRSxFQUFFRSxFQUFGLENBQUtrYSxPQUFmOztBQUVBcGEsSUFBRUUsRUFBRixDQUFLa2EsT0FBTCxHQUEyQnJXLE1BQTNCO0FBQ0EvRCxJQUFFRSxFQUFGLENBQUtrYSxPQUFMLENBQWE5VixXQUFiLEdBQTJCMFYsT0FBM0I7O0FBR0E7QUFDQTs7QUFFQWhhLElBQUVFLEVBQUYsQ0FBS2thLE9BQUwsQ0FBYTdWLFVBQWIsR0FBMEIsWUFBWTtBQUNwQ3ZFLE1BQUVFLEVBQUYsQ0FBS2thLE9BQUwsR0FBZWhXLEdBQWY7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEO0FBS0QsQ0FqSEEsQ0FpSEN0RSxNQWpIRCxDQUFEOztBQW1IQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVFLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsV0FBU3FhLFNBQVQsQ0FBbUI1VixPQUFuQixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDbkMsU0FBSzJHLEtBQUwsR0FBc0JyTCxFQUFFTyxTQUFTK0ssSUFBWCxDQUF0QjtBQUNBLFNBQUtnUCxjQUFMLEdBQXNCdGEsRUFBRXlFLE9BQUYsRUFBV3RDLEVBQVgsQ0FBYzVCLFNBQVMrSyxJQUF2QixJQUErQnRMLEVBQUVvSixNQUFGLENBQS9CLEdBQTJDcEosRUFBRXlFLE9BQUYsQ0FBakU7QUFDQSxTQUFLQyxPQUFMLEdBQXNCMUUsRUFBRTRFLE1BQUYsQ0FBUyxFQUFULEVBQWF5VixVQUFVeFYsUUFBdkIsRUFBaUNILE9BQWpDLENBQXRCO0FBQ0EsU0FBSzFCLFFBQUwsR0FBc0IsQ0FBQyxLQUFLMEIsT0FBTCxDQUFheEMsTUFBYixJQUF1QixFQUF4QixJQUE4QixjQUFwRDtBQUNBLFNBQUtxWSxPQUFMLEdBQXNCLEVBQXRCO0FBQ0EsU0FBS0MsT0FBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUtDLFlBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLbE4sWUFBTCxHQUFzQixDQUF0Qjs7QUFFQSxTQUFLK00sY0FBTCxDQUFvQjVYLEVBQXBCLENBQXVCLHFCQUF2QixFQUE4QzFDLEVBQUVxRixLQUFGLENBQVEsS0FBS3FWLE9BQWIsRUFBc0IsSUFBdEIsQ0FBOUM7QUFDQSxTQUFLQyxPQUFMO0FBQ0EsU0FBS0QsT0FBTDtBQUNEOztBQUVETCxZQUFVelgsT0FBVixHQUFxQixPQUFyQjs7QUFFQXlYLFlBQVV4VixRQUFWLEdBQXFCO0FBQ25CMFMsWUFBUTtBQURXLEdBQXJCOztBQUlBOEMsWUFBVXZYLFNBQVYsQ0FBb0I4WCxlQUFwQixHQUFzQyxZQUFZO0FBQ2hELFdBQU8sS0FBS04sY0FBTCxDQUFvQixDQUFwQixFQUF1Qi9NLFlBQXZCLElBQXVDVyxLQUFLMk0sR0FBTCxDQUFTLEtBQUt4UCxLQUFMLENBQVcsQ0FBWCxFQUFja0MsWUFBdkIsRUFBcUNoTixTQUFTcUcsZUFBVCxDQUF5QjJHLFlBQTlELENBQTlDO0FBQ0QsR0FGRDs7QUFJQThNLFlBQVV2WCxTQUFWLENBQW9CNlgsT0FBcEIsR0FBOEIsWUFBWTtBQUN4QyxRQUFJdlMsT0FBZ0IsSUFBcEI7QUFDQSxRQUFJMFMsZUFBZ0IsUUFBcEI7QUFDQSxRQUFJQyxhQUFnQixDQUFwQjs7QUFFQSxTQUFLUixPQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsT0FBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtqTixZQUFMLEdBQW9CLEtBQUtxTixlQUFMLEVBQXBCOztBQUVBLFFBQUksQ0FBQzVhLEVBQUVnYixRQUFGLENBQVcsS0FBS1YsY0FBTCxDQUFvQixDQUFwQixDQUFYLENBQUwsRUFBeUM7QUFDdkNRLHFCQUFlLFVBQWY7QUFDQUMsbUJBQWUsS0FBS1QsY0FBTCxDQUFvQi9OLFNBQXBCLEVBQWY7QUFDRDs7QUFFRCxTQUFLbEIsS0FBTCxDQUNHakksSUFESCxDQUNRLEtBQUtKLFFBRGIsRUFFRzZQLEdBRkgsQ0FFTyxZQUFZO0FBQ2YsVUFBSXhSLE1BQVFyQixFQUFFLElBQUYsQ0FBWjtBQUNBLFVBQUlpSixPQUFRNUgsSUFBSTZDLElBQUosQ0FBUyxRQUFULEtBQXNCN0MsSUFBSTRCLElBQUosQ0FBUyxNQUFULENBQWxDO0FBQ0EsVUFBSWdZLFFBQVEsTUFBTWpWLElBQU4sQ0FBV2lELElBQVgsS0FBb0JqSixFQUFFaUosSUFBRixDQUFoQzs7QUFFQSxhQUFRZ1MsU0FDSEEsTUFBTTNYLE1BREgsSUFFSDJYLE1BQU05WSxFQUFOLENBQVMsVUFBVCxDQUZHLElBR0gsQ0FBQyxDQUFDOFksTUFBTUgsWUFBTixJQUFzQnBFLEdBQXRCLEdBQTRCcUUsVUFBN0IsRUFBeUM5UixJQUF6QyxDQUFELENBSEUsSUFHbUQsSUFIMUQ7QUFJRCxLQVhILEVBWUdpUyxJQVpILENBWVEsVUFBVTFMLENBQVYsRUFBYUUsQ0FBYixFQUFnQjtBQUFFLGFBQU9GLEVBQUUsQ0FBRixJQUFPRSxFQUFFLENBQUYsQ0FBZDtBQUFvQixLQVo5QyxFQWFHekwsSUFiSCxDQWFRLFlBQVk7QUFDaEJtRSxXQUFLbVMsT0FBTCxDQUFhWSxJQUFiLENBQWtCLEtBQUssQ0FBTCxDQUFsQjtBQUNBL1MsV0FBS29TLE9BQUwsQ0FBYVcsSUFBYixDQUFrQixLQUFLLENBQUwsQ0FBbEI7QUFDRCxLQWhCSDtBQWlCRCxHQS9CRDs7QUFpQ0FkLFlBQVV2WCxTQUFWLENBQW9CNFgsT0FBcEIsR0FBOEIsWUFBWTtBQUN4QyxRQUFJbk8sWUFBZSxLQUFLK04sY0FBTCxDQUFvQi9OLFNBQXBCLEtBQWtDLEtBQUs3SCxPQUFMLENBQWE2UyxNQUFsRTtBQUNBLFFBQUloSyxlQUFlLEtBQUtxTixlQUFMLEVBQW5CO0FBQ0EsUUFBSVEsWUFBZSxLQUFLMVcsT0FBTCxDQUFhNlMsTUFBYixHQUFzQmhLLFlBQXRCLEdBQXFDLEtBQUsrTSxjQUFMLENBQW9COUMsTUFBcEIsRUFBeEQ7QUFDQSxRQUFJK0MsVUFBZSxLQUFLQSxPQUF4QjtBQUNBLFFBQUlDLFVBQWUsS0FBS0EsT0FBeEI7QUFDQSxRQUFJQyxlQUFlLEtBQUtBLFlBQXhCO0FBQ0EsUUFBSWxRLENBQUo7O0FBRUEsUUFBSSxLQUFLZ0QsWUFBTCxJQUFxQkEsWUFBekIsRUFBdUM7QUFDckMsV0FBS29OLE9BQUw7QUFDRDs7QUFFRCxRQUFJcE8sYUFBYTZPLFNBQWpCLEVBQTRCO0FBQzFCLGFBQU9YLGlCQUFpQmxRLElBQUlpUSxRQUFRQSxRQUFRbFgsTUFBUixHQUFpQixDQUF6QixDQUFyQixLQUFxRCxLQUFLK1gsUUFBTCxDQUFjOVEsQ0FBZCxDQUE1RDtBQUNEOztBQUVELFFBQUlrUSxnQkFBZ0JsTyxZQUFZZ08sUUFBUSxDQUFSLENBQWhDLEVBQTRDO0FBQzFDLFdBQUtFLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFPLEtBQUthLEtBQUwsRUFBUDtBQUNEOztBQUVELFNBQUsvUSxJQUFJZ1EsUUFBUWpYLE1BQWpCLEVBQXlCaUgsR0FBekIsR0FBK0I7QUFDN0JrUSxzQkFBZ0JELFFBQVFqUSxDQUFSLENBQWhCLElBQ0tnQyxhQUFhZ08sUUFBUWhRLENBQVIsQ0FEbEIsS0FFTWdRLFFBQVFoUSxJQUFJLENBQVosTUFBbUJ2SixTQUFuQixJQUFnQ3VMLFlBQVlnTyxRQUFRaFEsSUFBSSxDQUFaLENBRmxELEtBR0ssS0FBSzhRLFFBQUwsQ0FBY2IsUUFBUWpRLENBQVIsQ0FBZCxDQUhMO0FBSUQ7QUFDRixHQTVCRDs7QUE4QkE4UCxZQUFVdlgsU0FBVixDQUFvQnVZLFFBQXBCLEdBQStCLFVBQVVuWixNQUFWLEVBQWtCO0FBQy9DLFNBQUt1WSxZQUFMLEdBQW9CdlksTUFBcEI7O0FBRUEsU0FBS29aLEtBQUw7O0FBRUEsUUFBSXRZLFdBQVcsS0FBS0EsUUFBTCxHQUNiLGdCQURhLEdBQ01kLE1BRE4sR0FDZSxLQURmLEdBRWIsS0FBS2MsUUFGUSxHQUVHLFNBRkgsR0FFZWQsTUFGZixHQUV3QixJQUZ2Qzs7QUFJQSxRQUFJMEYsU0FBUzVILEVBQUVnRCxRQUFGLEVBQ1Z1WSxPQURVLENBQ0YsSUFERSxFQUVWalcsUUFGVSxDQUVELFFBRkMsQ0FBYjs7QUFJQSxRQUFJc0MsT0FBT0wsTUFBUCxDQUFjLGdCQUFkLEVBQWdDakUsTUFBcEMsRUFBNEM7QUFDMUNzRSxlQUFTQSxPQUNOckUsT0FETSxDQUNFLGFBREYsRUFFTitCLFFBRk0sQ0FFRyxRQUZILENBQVQ7QUFHRDs7QUFFRHNDLFdBQU9wRyxPQUFQLENBQWUsdUJBQWY7QUFDRCxHQXBCRDs7QUFzQkE2WSxZQUFVdlgsU0FBVixDQUFvQndZLEtBQXBCLEdBQTRCLFlBQVk7QUFDdEN0YixNQUFFLEtBQUtnRCxRQUFQLEVBQ0d3WSxZQURILENBQ2dCLEtBQUs5VyxPQUFMLENBQWF4QyxNQUQ3QixFQUNxQyxTQURyQyxFQUVHd0IsV0FGSCxDQUVlLFFBRmY7QUFHRCxHQUpEOztBQU9BO0FBQ0E7O0FBRUEsV0FBU0ssTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLQyxJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJbEIsUUFBVS9DLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSWtFLE9BQVVuQixNQUFNbUIsSUFBTixDQUFXLGNBQVgsQ0FBZDtBQUNBLFVBQUlRLFVBQVUsUUFBT1YsTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFqQixJQUE2QkEsTUFBM0M7O0FBRUEsVUFBSSxDQUFDRSxJQUFMLEVBQVduQixNQUFNbUIsSUFBTixDQUFXLGNBQVgsRUFBNEJBLE9BQU8sSUFBSW1XLFNBQUosQ0FBYyxJQUFkLEVBQW9CM1YsT0FBcEIsQ0FBbkM7QUFDWCxVQUFJLE9BQU9WLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JFLEtBQUtGLE1BQUw7QUFDaEMsS0FQTSxDQUFQO0FBUUQ7O0FBRUQsTUFBSUksTUFBTXBFLEVBQUVFLEVBQUYsQ0FBS3ViLFNBQWY7O0FBRUF6YixJQUFFRSxFQUFGLENBQUt1YixTQUFMLEdBQTZCMVgsTUFBN0I7QUFDQS9ELElBQUVFLEVBQUYsQ0FBS3ViLFNBQUwsQ0FBZW5YLFdBQWYsR0FBNkIrVixTQUE3Qjs7QUFHQTtBQUNBOztBQUVBcmEsSUFBRUUsRUFBRixDQUFLdWIsU0FBTCxDQUFlbFgsVUFBZixHQUE0QixZQUFZO0FBQ3RDdkUsTUFBRUUsRUFBRixDQUFLdWIsU0FBTCxHQUFpQnJYLEdBQWpCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBcEUsSUFBRW9KLE1BQUYsRUFBVTFHLEVBQVYsQ0FBYSw0QkFBYixFQUEyQyxZQUFZO0FBQ3JEMUMsTUFBRSxxQkFBRixFQUF5QmlFLElBQXpCLENBQThCLFlBQVk7QUFDeEMsVUFBSXlYLE9BQU8xYixFQUFFLElBQUYsQ0FBWDtBQUNBK0QsYUFBT0ksSUFBUCxDQUFZdVgsSUFBWixFQUFrQkEsS0FBS3hYLElBQUwsRUFBbEI7QUFDRCxLQUhEO0FBSUQsR0FMRDtBQU9ELENBbEtBLENBa0tDcEUsTUFsS0QsQ0FBRDs7QUFvS0E7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVRSxDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUkyYixNQUFNLFNBQU5BLEdBQU0sQ0FBVWxYLE9BQVYsRUFBbUI7QUFDM0I7QUFDQSxTQUFLQSxPQUFMLEdBQWV6RSxFQUFFeUUsT0FBRixDQUFmO0FBQ0E7QUFDRCxHQUpEOztBQU1Ba1gsTUFBSS9ZLE9BQUosR0FBYyxPQUFkOztBQUVBK1ksTUFBSTlZLG1CQUFKLEdBQTBCLEdBQTFCOztBQUVBOFksTUFBSTdZLFNBQUosQ0FBY2dILElBQWQsR0FBcUIsWUFBWTtBQUMvQixRQUFJL0csUUFBVyxLQUFLMEIsT0FBcEI7QUFDQSxRQUFJbVgsTUFBVzdZLE1BQU1RLE9BQU4sQ0FBYyx3QkFBZCxDQUFmO0FBQ0EsUUFBSVAsV0FBV0QsTUFBTW1CLElBQU4sQ0FBVyxRQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDbEIsUUFBTCxFQUFlO0FBQ2JBLGlCQUFXRCxNQUFNRSxJQUFOLENBQVcsTUFBWCxDQUFYO0FBQ0FELGlCQUFXQSxZQUFZQSxTQUFTRSxPQUFULENBQWlCLGdCQUFqQixFQUFtQyxFQUFuQyxDQUF2QixDQUZhLENBRWlEO0FBQy9EOztBQUVELFFBQUlILE1BQU13RSxNQUFOLENBQWEsSUFBYixFQUFtQnpELFFBQW5CLENBQTRCLFFBQTVCLENBQUosRUFBMkM7O0FBRTNDLFFBQUkrWCxZQUFZRCxJQUFJeFksSUFBSixDQUFTLGdCQUFULENBQWhCO0FBQ0EsUUFBSTBZLFlBQVk5YixFQUFFd0QsS0FBRixDQUFRLGFBQVIsRUFBdUI7QUFDckNnRixxQkFBZXpGLE1BQU0sQ0FBTjtBQURzQixLQUF2QixDQUFoQjtBQUdBLFFBQUlvTSxZQUFZblAsRUFBRXdELEtBQUYsQ0FBUSxhQUFSLEVBQXVCO0FBQ3JDZ0YscUJBQWVxVCxVQUFVLENBQVY7QUFEc0IsS0FBdkIsQ0FBaEI7O0FBSUFBLGNBQVVyYSxPQUFWLENBQWtCc2EsU0FBbEI7QUFDQS9ZLFVBQU12QixPQUFOLENBQWMyTixTQUFkOztBQUVBLFFBQUlBLFVBQVUxTCxrQkFBVixNQUFrQ3FZLFVBQVVyWSxrQkFBVixFQUF0QyxFQUFzRTs7QUFFdEUsUUFBSXlGLFVBQVVsSixFQUFFTyxRQUFGLEVBQVk2QyxJQUFaLENBQWlCSixRQUFqQixDQUFkOztBQUVBLFNBQUtxWSxRQUFMLENBQWN0WSxNQUFNUSxPQUFOLENBQWMsSUFBZCxDQUFkLEVBQW1DcVksR0FBbkM7QUFDQSxTQUFLUCxRQUFMLENBQWNuUyxPQUFkLEVBQXVCQSxRQUFRM0IsTUFBUixFQUF2QixFQUF5QyxZQUFZO0FBQ25Ec1UsZ0JBQVVyYSxPQUFWLENBQWtCO0FBQ2hCeUUsY0FBTSxlQURVO0FBRWhCdUMsdUJBQWV6RixNQUFNLENBQU47QUFGQyxPQUFsQjtBQUlBQSxZQUFNdkIsT0FBTixDQUFjO0FBQ1p5RSxjQUFNLGNBRE07QUFFWnVDLHVCQUFlcVQsVUFBVSxDQUFWO0FBRkgsT0FBZDtBQUlELEtBVEQ7QUFVRCxHQXRDRDs7QUF3Q0FGLE1BQUk3WSxTQUFKLENBQWN1WSxRQUFkLEdBQXlCLFVBQVU1VyxPQUFWLEVBQW1CNFAsU0FBbkIsRUFBOEI5UyxRQUE5QixFQUF3QztBQUMvRCxRQUFJZ0YsVUFBYThOLFVBQVVqUixJQUFWLENBQWUsV0FBZixDQUFqQjtBQUNBLFFBQUl2QyxhQUFhVSxZQUNadkIsRUFBRXlCLE9BQUYsQ0FBVVosVUFERSxLQUVYMEYsUUFBUWpELE1BQVIsSUFBa0JpRCxRQUFRekMsUUFBUixDQUFpQixNQUFqQixDQUFsQixJQUE4QyxDQUFDLENBQUN1USxVQUFValIsSUFBVixDQUFlLFNBQWYsRUFBMEJFLE1BRi9ELENBQWpCOztBQUlBLGFBQVM0RCxJQUFULEdBQWdCO0FBQ2RYLGNBQ0c3QyxXQURILENBQ2UsUUFEZixFQUVHTixJQUZILENBRVEsNEJBRlIsRUFHR00sV0FISCxDQUdlLFFBSGYsRUFJR3pDLEdBSkgsR0FLR21DLElBTEgsQ0FLUSxxQkFMUixFQU1HSCxJQU5ILENBTVEsZUFOUixFQU15QixLQU56Qjs7QUFRQXdCLGNBQ0dhLFFBREgsQ0FDWSxRQURaLEVBRUdsQyxJQUZILENBRVEscUJBRlIsRUFHR0gsSUFISCxDQUdRLGVBSFIsRUFHeUIsSUFIekI7O0FBS0EsVUFBSXBDLFVBQUosRUFBZ0I7QUFDZDRELGdCQUFRLENBQVIsRUFBV21FLFdBQVgsQ0FEYyxDQUNTO0FBQ3ZCbkUsZ0JBQVFhLFFBQVIsQ0FBaUIsSUFBakI7QUFDRCxPQUhELE1BR087QUFDTGIsZ0JBQVFmLFdBQVIsQ0FBb0IsTUFBcEI7QUFDRDs7QUFFRCxVQUFJZSxRQUFROEMsTUFBUixDQUFlLGdCQUFmLEVBQWlDakUsTUFBckMsRUFBNkM7QUFDM0NtQixnQkFDR2xCLE9BREgsQ0FDVyxhQURYLEVBRUcrQixRQUZILENBRVksUUFGWixFQUdHckUsR0FISCxHQUlHbUMsSUFKSCxDQUlRLHFCQUpSLEVBS0dILElBTEgsQ0FLUSxlQUxSLEVBS3lCLElBTHpCO0FBTUQ7O0FBRUQxQixrQkFBWUEsVUFBWjtBQUNEOztBQUVEZ0YsWUFBUWpELE1BQVIsSUFBa0J6QyxVQUFsQixHQUNFMEYsUUFDR2pGLEdBREgsQ0FDTyxpQkFEUCxFQUMwQjRGLElBRDFCLEVBRUdoRyxvQkFGSCxDQUV3QnlhLElBQUk5WSxtQkFGNUIsQ0FERixHQUlFcUUsTUFKRjs7QUFNQVgsWUFBUTdDLFdBQVIsQ0FBb0IsSUFBcEI7QUFDRCxHQTlDRDs7QUFpREE7QUFDQTs7QUFFQSxXQUFTSyxNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUtDLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlsQixRQUFRL0MsRUFBRSxJQUFGLENBQVo7QUFDQSxVQUFJa0UsT0FBUW5CLE1BQU1tQixJQUFOLENBQVcsUUFBWCxDQUFaOztBQUVBLFVBQUksQ0FBQ0EsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxRQUFYLEVBQXNCQSxPQUFPLElBQUl5WCxHQUFKLENBQVEsSUFBUixDQUE3QjtBQUNYLFVBQUksT0FBTzNYLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JFLEtBQUtGLE1BQUw7QUFDaEMsS0FOTSxDQUFQO0FBT0Q7O0FBRUQsTUFBSUksTUFBTXBFLEVBQUVFLEVBQUYsQ0FBSzZiLEdBQWY7O0FBRUEvYixJQUFFRSxFQUFGLENBQUs2YixHQUFMLEdBQXVCaFksTUFBdkI7QUFDQS9ELElBQUVFLEVBQUYsQ0FBSzZiLEdBQUwsQ0FBU3pYLFdBQVQsR0FBdUJxWCxHQUF2Qjs7QUFHQTtBQUNBOztBQUVBM2IsSUFBRUUsRUFBRixDQUFLNmIsR0FBTCxDQUFTeFgsVUFBVCxHQUFzQixZQUFZO0FBQ2hDdkUsTUFBRUUsRUFBRixDQUFLNmIsR0FBTCxHQUFXM1gsR0FBWDtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQSxNQUFJNEUsZUFBZSxTQUFmQSxZQUFlLENBQVUvRyxDQUFWLEVBQWE7QUFDOUJBLE1BQUVvQixjQUFGO0FBQ0FVLFdBQU9JLElBQVAsQ0FBWW5FLEVBQUUsSUFBRixDQUFaLEVBQXFCLE1BQXJCO0FBQ0QsR0FIRDs7QUFLQUEsSUFBRU8sUUFBRixFQUNHbUMsRUFESCxDQUNNLHVCQUROLEVBQytCLHFCQUQvQixFQUNzRHNHLFlBRHRELEVBRUd0RyxFQUZILENBRU0sdUJBRk4sRUFFK0Isc0JBRi9CLEVBRXVEc0csWUFGdkQ7QUFJRCxDQWpKQSxDQWlKQ2xKLE1BakpELENBQUQ7O0FBbUpBOzs7Ozs7OztBQVNBLENBQUMsVUFBVUUsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxNQUFJZ2MsUUFBUSxTQUFSQSxLQUFRLENBQVV2WCxPQUFWLEVBQW1CQyxPQUFuQixFQUE0QjtBQUN0QyxTQUFLQSxPQUFMLEdBQWUxRSxFQUFFNEUsTUFBRixDQUFTLEVBQVQsRUFBYW9YLE1BQU1uWCxRQUFuQixFQUE2QkgsT0FBN0IsQ0FBZjs7QUFFQSxRQUFJeEMsU0FBUyxLQUFLd0MsT0FBTCxDQUFheEMsTUFBYixLQUF3QjhaLE1BQU1uWCxRQUFOLENBQWUzQyxNQUF2QyxHQUFnRGxDLEVBQUUsS0FBSzBFLE9BQUwsQ0FBYXhDLE1BQWYsQ0FBaEQsR0FBeUVsQyxFQUFFTyxRQUFGLEVBQVk2QyxJQUFaLENBQWlCLEtBQUtzQixPQUFMLENBQWF4QyxNQUE5QixDQUF0Rjs7QUFFQSxTQUFLZ0gsT0FBTCxHQUFlaEgsT0FDWlEsRUFEWSxDQUNULDBCQURTLEVBQ21CMUMsRUFBRXFGLEtBQUYsQ0FBUSxLQUFLNFcsYUFBYixFQUE0QixJQUE1QixDQURuQixFQUVadlosRUFGWSxDQUVULHlCQUZTLEVBRW1CMUMsRUFBRXFGLEtBQUYsQ0FBUSxLQUFLNlcsMEJBQWIsRUFBeUMsSUFBekMsQ0FGbkIsQ0FBZjs7QUFJQSxTQUFLdlgsUUFBTCxHQUFvQjNFLEVBQUV5RSxPQUFGLENBQXBCO0FBQ0EsU0FBSzBYLE9BQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxLQUFMLEdBQW9CLElBQXBCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFFQSxTQUFLSixhQUFMO0FBQ0QsR0FmRDs7QUFpQkFELFFBQU1wWixPQUFOLEdBQWlCLE9BQWpCOztBQUVBb1osUUFBTU0sS0FBTixHQUFpQiw4QkFBakI7O0FBRUFOLFFBQU1uWCxRQUFOLEdBQWlCO0FBQ2YwUyxZQUFRLENBRE87QUFFZnJWLFlBQVFrSDtBQUZPLEdBQWpCOztBQUtBNFMsUUFBTWxaLFNBQU4sQ0FBZ0J5WixRQUFoQixHQUEyQixVQUFVaFAsWUFBVixFQUF3QmlLLE1BQXhCLEVBQWdDZ0YsU0FBaEMsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQ2xGLFFBQUlsUSxZQUFlLEtBQUtyRCxPQUFMLENBQWFxRCxTQUFiLEVBQW5CO0FBQ0EsUUFBSW1RLFdBQWUsS0FBSy9YLFFBQUwsQ0FBYzRTLE1BQWQsRUFBbkI7QUFDQSxRQUFJb0YsZUFBZSxLQUFLelQsT0FBTCxDQUFhc08sTUFBYixFQUFuQjs7QUFFQSxRQUFJZ0YsYUFBYSxJQUFiLElBQXFCLEtBQUtMLE9BQUwsSUFBZ0IsS0FBekMsRUFBZ0QsT0FBTzVQLFlBQVlpUSxTQUFaLEdBQXdCLEtBQXhCLEdBQWdDLEtBQXZDOztBQUVoRCxRQUFJLEtBQUtMLE9BQUwsSUFBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsVUFBSUssYUFBYSxJQUFqQixFQUF1QixPQUFRalEsWUFBWSxLQUFLNlAsS0FBakIsSUFBMEJNLFNBQVNoRyxHQUFwQyxHQUEyQyxLQUEzQyxHQUFtRCxRQUExRDtBQUN2QixhQUFRbkssWUFBWW9RLFlBQVosSUFBNEJwUCxlQUFla1AsWUFBNUMsR0FBNEQsS0FBNUQsR0FBb0UsUUFBM0U7QUFDRDs7QUFFRCxRQUFJRyxlQUFpQixLQUFLVCxPQUFMLElBQWdCLElBQXJDO0FBQ0EsUUFBSVUsY0FBaUJELGVBQWVyUSxTQUFmLEdBQTJCbVEsU0FBU2hHLEdBQXpEO0FBQ0EsUUFBSW9HLGlCQUFpQkYsZUFBZUQsWUFBZixHQUE4Qm5GLE1BQW5EOztBQUVBLFFBQUlnRixhQUFhLElBQWIsSUFBcUJqUSxhQUFhaVEsU0FBdEMsRUFBaUQsT0FBTyxLQUFQO0FBQ2pELFFBQUlDLGdCQUFnQixJQUFoQixJQUF5QkksY0FBY0MsY0FBZCxJQUFnQ3ZQLGVBQWVrUCxZQUE1RSxFQUEyRixPQUFPLFFBQVA7O0FBRTNGLFdBQU8sS0FBUDtBQUNELEdBcEJEOztBQXNCQVQsUUFBTWxaLFNBQU4sQ0FBZ0JpYSxlQUFoQixHQUFrQyxZQUFZO0FBQzVDLFFBQUksS0FBS1YsWUFBVCxFQUF1QixPQUFPLEtBQUtBLFlBQVo7QUFDdkIsU0FBSzFYLFFBQUwsQ0FBY2pCLFdBQWQsQ0FBMEJzWSxNQUFNTSxLQUFoQyxFQUF1Q2hYLFFBQXZDLENBQWdELE9BQWhEO0FBQ0EsUUFBSWlILFlBQVksS0FBS3JELE9BQUwsQ0FBYXFELFNBQWIsRUFBaEI7QUFDQSxRQUFJbVEsV0FBWSxLQUFLL1gsUUFBTCxDQUFjNFMsTUFBZCxFQUFoQjtBQUNBLFdBQVEsS0FBSzhFLFlBQUwsR0FBb0JLLFNBQVNoRyxHQUFULEdBQWVuSyxTQUEzQztBQUNELEdBTkQ7O0FBUUF5UCxRQUFNbFosU0FBTixDQUFnQm9aLDBCQUFoQixHQUE2QyxZQUFZO0FBQ3ZEeGEsZUFBVzFCLEVBQUVxRixLQUFGLENBQVEsS0FBSzRXLGFBQWIsRUFBNEIsSUFBNUIsQ0FBWCxFQUE4QyxDQUE5QztBQUNELEdBRkQ7O0FBSUFELFFBQU1sWixTQUFOLENBQWdCbVosYUFBaEIsR0FBZ0MsWUFBWTtBQUMxQyxRQUFJLENBQUMsS0FBS3RYLFFBQUwsQ0FBY3hDLEVBQWQsQ0FBaUIsVUFBakIsQ0FBTCxFQUFtQzs7QUFFbkMsUUFBSXFWLFNBQWUsS0FBSzdTLFFBQUwsQ0FBYzZTLE1BQWQsRUFBbkI7QUFDQSxRQUFJRCxTQUFlLEtBQUs3UyxPQUFMLENBQWE2UyxNQUFoQztBQUNBLFFBQUlpRixZQUFlakYsT0FBT2IsR0FBMUI7QUFDQSxRQUFJK0YsZUFBZWxGLE9BQU9OLE1BQTFCO0FBQ0EsUUFBSTFKLGVBQWVXLEtBQUsyTSxHQUFMLENBQVM3YSxFQUFFTyxRQUFGLEVBQVlpWCxNQUFaLEVBQVQsRUFBK0J4WCxFQUFFTyxTQUFTK0ssSUFBWCxFQUFpQmtNLE1BQWpCLEVBQS9CLENBQW5COztBQUVBLFFBQUksUUFBT0QsTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFyQixFQUF1Q2tGLGVBQWVELFlBQVlqRixNQUEzQjtBQUN2QyxRQUFJLE9BQU9pRixTQUFQLElBQW9CLFVBQXhCLEVBQXVDQSxZQUFlakYsT0FBT2IsR0FBUCxDQUFXLEtBQUsvUixRQUFoQixDQUFmO0FBQ3ZDLFFBQUksT0FBTzhYLFlBQVAsSUFBdUIsVUFBM0IsRUFBdUNBLGVBQWVsRixPQUFPTixNQUFQLENBQWMsS0FBS3RTLFFBQW5CLENBQWY7O0FBRXZDLFFBQUlxWSxRQUFRLEtBQUtULFFBQUwsQ0FBY2hQLFlBQWQsRUFBNEJpSyxNQUE1QixFQUFvQ2dGLFNBQXBDLEVBQStDQyxZQUEvQyxDQUFaOztBQUVBLFFBQUksS0FBS04sT0FBTCxJQUFnQmEsS0FBcEIsRUFBMkI7QUFDekIsVUFBSSxLQUFLWixLQUFMLElBQWMsSUFBbEIsRUFBd0IsS0FBS3pYLFFBQUwsQ0FBYzhJLEdBQWQsQ0FBa0IsS0FBbEIsRUFBeUIsRUFBekI7O0FBRXhCLFVBQUl3UCxZQUFZLFdBQVdELFFBQVEsTUFBTUEsS0FBZCxHQUFzQixFQUFqQyxDQUFoQjtBQUNBLFVBQUkvYSxJQUFZakMsRUFBRXdELEtBQUYsQ0FBUXlaLFlBQVksV0FBcEIsQ0FBaEI7O0FBRUEsV0FBS3RZLFFBQUwsQ0FBY25ELE9BQWQsQ0FBc0JTLENBQXRCOztBQUVBLFVBQUlBLEVBQUV3QixrQkFBRixFQUFKLEVBQTRCOztBQUU1QixXQUFLMFksT0FBTCxHQUFlYSxLQUFmO0FBQ0EsV0FBS1osS0FBTCxHQUFhWSxTQUFTLFFBQVQsR0FBb0IsS0FBS0QsZUFBTCxFQUFwQixHQUE2QyxJQUExRDs7QUFFQSxXQUFLcFksUUFBTCxDQUNHakIsV0FESCxDQUNlc1ksTUFBTU0sS0FEckIsRUFFR2hYLFFBRkgsQ0FFWTJYLFNBRlosRUFHR3piLE9BSEgsQ0FHV3liLFVBQVUvWixPQUFWLENBQWtCLE9BQWxCLEVBQTJCLFNBQTNCLElBQXdDLFdBSG5EO0FBSUQ7O0FBRUQsUUFBSThaLFNBQVMsUUFBYixFQUF1QjtBQUNyQixXQUFLclksUUFBTCxDQUFjNFMsTUFBZCxDQUFxQjtBQUNuQmIsYUFBS25KLGVBQWVpSyxNQUFmLEdBQXdCaUY7QUFEVixPQUFyQjtBQUdEO0FBQ0YsR0F2Q0Q7O0FBMENBO0FBQ0E7O0FBRUEsV0FBUzFZLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBS0MsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSWxCLFFBQVUvQyxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUlrRSxPQUFVbkIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLENBQWQ7QUFDQSxVQUFJUSxVQUFVLFFBQU9WLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNDOztBQUVBLFVBQUksQ0FBQ0UsSUFBTCxFQUFXbkIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLEVBQXdCQSxPQUFPLElBQUk4WCxLQUFKLENBQVUsSUFBVixFQUFnQnRYLE9BQWhCLENBQS9CO0FBQ1gsVUFBSSxPQUFPVixNQUFQLElBQWlCLFFBQXJCLEVBQStCRSxLQUFLRixNQUFMO0FBQ2hDLEtBUE0sQ0FBUDtBQVFEOztBQUVELE1BQUlJLE1BQU1wRSxFQUFFRSxFQUFGLENBQUs4YyxLQUFmOztBQUVBaGQsSUFBRUUsRUFBRixDQUFLOGMsS0FBTCxHQUF5QmpaLE1BQXpCO0FBQ0EvRCxJQUFFRSxFQUFGLENBQUs4YyxLQUFMLENBQVcxWSxXQUFYLEdBQXlCMFgsS0FBekI7O0FBR0E7QUFDQTs7QUFFQWhjLElBQUVFLEVBQUYsQ0FBSzhjLEtBQUwsQ0FBV3pZLFVBQVgsR0FBd0IsWUFBWTtBQUNsQ3ZFLE1BQUVFLEVBQUYsQ0FBSzhjLEtBQUwsR0FBYTVZLEdBQWI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUFwRSxJQUFFb0osTUFBRixFQUFVMUcsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBWTtBQUMvQjFDLE1BQUUsb0JBQUYsRUFBd0JpRSxJQUF4QixDQUE2QixZQUFZO0FBQ3ZDLFVBQUl5WCxPQUFPMWIsRUFBRSxJQUFGLENBQVg7QUFDQSxVQUFJa0UsT0FBT3dYLEtBQUt4WCxJQUFMLEVBQVg7O0FBRUFBLFdBQUtxVCxNQUFMLEdBQWNyVCxLQUFLcVQsTUFBTCxJQUFlLEVBQTdCOztBQUVBLFVBQUlyVCxLQUFLdVksWUFBTCxJQUFxQixJQUF6QixFQUErQnZZLEtBQUtxVCxNQUFMLENBQVlOLE1BQVosR0FBcUIvUyxLQUFLdVksWUFBMUI7QUFDL0IsVUFBSXZZLEtBQUtzWSxTQUFMLElBQXFCLElBQXpCLEVBQStCdFksS0FBS3FULE1BQUwsQ0FBWWIsR0FBWixHQUFxQnhTLEtBQUtzWSxTQUExQjs7QUFFL0J6WSxhQUFPSSxJQUFQLENBQVl1WCxJQUFaLEVBQWtCeFgsSUFBbEI7QUFDRCxLQVZEO0FBV0QsR0FaRDtBQWNELENBMUpBLENBMEpDcEUsTUExSkQsQ0FBRDs7O0FDejNFQUEsT0FBTyxVQUFVRSxDQUFWLEVBQWE7QUFDbEI7O0FBRUE7O0FBQ0FBLElBQUUseUJBQUYsRUFBNkIrWixPQUE3QjtBQUNELENBTEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBCb290c3RyYXAgdjMuNC4xIChodHRwczovL2dldGJvb3RzdHJhcC5jb20vKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5Jylcbn1cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHZlcnNpb24gPSAkLmZuLmpxdWVyeS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJylcbiAgaWYgKCh2ZXJzaW9uWzBdIDwgMiAmJiB2ZXJzaW9uWzFdIDwgOSkgfHwgKHZlcnNpb25bMF0gPT0gMSAmJiB2ZXJzaW9uWzFdID09IDkgJiYgdmVyc2lvblsyXSA8IDEpIHx8ICh2ZXJzaW9uWzBdID4gMykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gNCcpXG4gIH1cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRyYW5zaXRpb24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdHJhbnNpdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cHM6Ly9tb2Rlcm5penIuY29tLylcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib290c3RyYXAnKVxuXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2UgLy8gZXhwbGljaXQgZm9yIGllOCAoICAuXy4pXG4gIH1cblxuICAvLyBodHRwczovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgJGVsID0gdGhpc1xuICAgICQodGhpcykub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWUgfSlcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkdXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVyblxuXG4gICAgJC5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZCA9IHtcbiAgICAgIGJpbmRUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoaXMpKSByZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhbGVydC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhbGVydHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBTEVSVCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXG4gIHZhciBBbGVydCAgID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgJChlbCkub24oJ2NsaWNrJywgZGlzbWlzcywgdGhpcy5jbG9zZSlcbiAgfVxuXG4gIEFsZXJ0LlZFUlNJT04gPSAnMy40LjEnXG5cbiAgQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgID0gJCh0aGlzKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgICAgPSBzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvclxuICAgIHZhciAkcGFyZW50ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBidXR0b24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9ICQuZXh0ZW5kKHt9LCBCdXR0b24uREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICB9XG5cbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEJ1dHRvbi5ERUZBVUxUUyA9IHtcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGQgICAgPSAnZGlzYWJsZWQnXG4gICAgdmFyICRlbCAgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuICAgIHZhciBkYXRhID0gJGVsLmRhdGEoKVxuXG4gICAgc3RhdGUgKz0gJ1RleHQnXG5cbiAgICBpZiAoZGF0YS5yZXNldFRleHQgPT0gbnVsbCkgJGVsLmRhdGEoJ3Jlc2V0VGV4dCcsICRlbFt2YWxdKCkpXG5cbiAgICAvLyBwdXNoIHRvIGV2ZW50IGxvb3AgdG8gYWxsb3cgZm9ybXMgdG8gc3VibWl0XG4gICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXG5cbiAgICAgIGlmIChzdGF0ZSA9PSAnbG9hZGluZ1RleHQnKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKS5wcm9wKGQsIHRydWUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgJGVsLnJlbW92ZUNsYXNzKGQpLnJlbW92ZUF0dHIoZCkucHJvcChkLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKSwgMClcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGFuZ2VkID0gdHJ1ZVxuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJylcblxuICAgIGlmICgkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgdmFyICRpbnB1dCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW5wdXQnKVxuICAgICAgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ3JhZGlvJykge1xuICAgICAgICBpZiAoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICRwYXJlbnQuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgaWYgKCgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSAhPT0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgfVxuICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIGlmIChjaGFuZ2VkKSAkaW5wdXQudHJpZ2dlcignY2hhbmdlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLXByZXNzZWQnLCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQlVUVE9OIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5idXR0b24nKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicsIChkYXRhID0gbmV3IEJ1dHRvbih0aGlzLCBvcHRpb25zKSkpXG5cbiAgICAgIGlmIChvcHRpb24gPT0gJ3RvZ2dsZScpIGRhdGEudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbikgZGF0YS5zZXRTdGF0ZShvcHRpb24pXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmJ1dHRvblxuXG4gICQuZm4uYnV0dG9uICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXG5cblxuICAvLyBCVVRUT04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5idXR0b24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmJ1dHRvbiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEJVVFRPTiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJylcbiAgICAgIFBsdWdpbi5jYWxsKCRidG4sICd0b2dnbGUnKVxuICAgICAgaWYgKCEoJChlLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZG91YmxlIGNsaWNrIG9uIHJhZGlvcywgYW5kIHRoZSBkb3VibGUgc2VsZWN0aW9ucyAoc28gY2FuY2VsbGF0aW9uKSBvbiBjaGVja2JveGVzXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAvLyBUaGUgdGFyZ2V0IGNvbXBvbmVudCBzdGlsbCByZWNlaXZlIHRoZSBmb2N1c1xuICAgICAgICBpZiAoJGJ0bi5pcygnaW5wdXQsYnV0dG9uJykpICRidG4udHJpZ2dlcignZm9jdXMnKVxuICAgICAgICBlbHNlICRidG4uZmluZCgnaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZScpLmZpcnN0KCkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJykudG9nZ2xlQ2xhc3MoJ2ZvY3VzJywgL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKVxuICAgIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNhcm91c2VsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Nhcm91c2VsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGluZGljYXRvcnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5jYXJvdXNlbC1pbmRpY2F0b3JzJylcbiAgICB0aGlzLm9wdGlvbnMgICAgID0gb3B0aW9uc1xuICAgIHRoaXMucGF1c2VkICAgICAgPSBudWxsXG4gICAgdGhpcy5zbGlkaW5nICAgICA9IG51bGxcbiAgICB0aGlzLmludGVydmFsICAgID0gbnVsbFxuICAgIHRoaXMuJGFjdGl2ZSAgICAgPSBudWxsXG4gICAgdGhpcy4kaXRlbXMgICAgICA9IG51bGxcblxuICAgIHRoaXMub3B0aW9ucy5rZXlib2FyZCAmJiB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKVxuXG4gICAgdGhpcy5vcHRpb25zLnBhdXNlID09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpICYmIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbignbW91c2VlbnRlci5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5wYXVzZSwgdGhpcykpXG4gICAgICAub24oJ21vdXNlbGVhdmUuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMuY3ljbGUsIHRoaXMpKVxuICB9XG5cbiAgQ2Fyb3VzZWwuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDYwMFxuXG4gIENhcm91c2VsLkRFRkFVTFRTID0ge1xuICAgIGludGVydmFsOiA1MDAwLFxuICAgIHBhdXNlOiAnaG92ZXInLFxuICAgIHdyYXA6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWVcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICBjYXNlIDM3OiB0aGlzLnByZXYoKTsgYnJlYWtcbiAgICAgIGNhc2UgMzk6IHRoaXMubmV4dCgpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuY3ljbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gZmFsc2UpXG5cbiAgICB0aGlzLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHRoaXMub3B0aW9ucy5pbnRlcnZhbFxuICAgICAgJiYgIXRoaXMucGF1c2VkXG4gICAgICAmJiAodGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCQucHJveHkodGhpcy5uZXh0LCB0aGlzKSwgdGhpcy5vcHRpb25zLmludGVydmFsKSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB0aGlzLiRpdGVtcyA9IGl0ZW0ucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtJylcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuaW5kZXgoaXRlbSB8fCB0aGlzLiRhY3RpdmUpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFjdGl2ZSkge1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGFjdGl2ZSlcbiAgICB2YXIgd2lsbFdyYXAgPSAoZGlyZWN0aW9uID09ICdwcmV2JyAmJiBhY3RpdmVJbmRleCA9PT0gMClcbiAgICAgICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09ICduZXh0JyAmJiBhY3RpdmVJbmRleCA9PSAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkpXG4gICAgaWYgKHdpbGxXcmFwICYmICF0aGlzLm9wdGlvbnMud3JhcCkgcmV0dXJuIGFjdGl2ZVxuICAgIHZhciBkZWx0YSA9IGRpcmVjdGlvbiA9PSAncHJldicgPyAtMSA6IDFcbiAgICB2YXIgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy4kaXRlbXMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGl0ZW1JbmRleClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgPSB0aGlzXG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKSlcblxuICAgIGlmIChwb3MgPiAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkgfHwgcG9zIDwgMCkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zbGlkaW5nKSAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC5vbmUoJ3NsaWQuYnMuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7IHRoYXQudG8ocG9zKSB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKGFjdGl2ZUluZGV4ID09IHBvcykgcmV0dXJuIHRoaXMucGF1c2UoKS5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpcy5zbGlkZShwb3MgPiBhY3RpdmVJbmRleCA/ICduZXh0JyA6ICdwcmV2JywgdGhpcy4kaXRlbXMuZXEocG9zKSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSB0cnVlKVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgdGhpcy5jeWNsZSh0cnVlKVxuICAgIH1cblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ25leHQnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ3ByZXYnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnNsaWRlID0gZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICB2YXIgJGFjdGl2ZSAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxuICAgIHZhciAkbmV4dCAgICAgPSBuZXh0IHx8IHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbih0eXBlLCAkYWN0aXZlKVxuICAgIHZhciBpc0N5Y2xpbmcgPSB0aGlzLmludGVydmFsXG4gICAgdmFyIGRpcmVjdGlvbiA9IHR5cGUgPT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIHZhciB0aGF0ICAgICAgPSB0aGlzXG5cbiAgICBpZiAoJG5leHQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm4gKHRoaXMuc2xpZGluZyA9IGZhbHNlKVxuXG4gICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSAkbmV4dFswXVxuICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudCgnc2xpZGUuYnMuY2Fyb3VzZWwnLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICB9KVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkZUV2ZW50KVxuICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuc2xpZGluZyA9IHRydWVcblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLnBhdXNlKClcblxuICAgIGlmICh0aGlzLiRpbmRpY2F0b3JzLmxlbmd0aCkge1xuICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB2YXIgJG5leHRJbmRpY2F0b3IgPSAkKHRoaXMuJGluZGljYXRvcnMuY2hpbGRyZW4oKVt0aGlzLmdldEl0ZW1JbmRleCgkbmV4dCldKVxuICAgICAgJG5leHRJbmRpY2F0b3IgJiYgJG5leHRJbmRpY2F0b3IuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgdmFyIHNsaWRFdmVudCA9ICQuRXZlbnQoJ3NsaWQuYnMuY2Fyb3VzZWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnc2xpZGUnKSkge1xuICAgICAgJG5leHQuYWRkQ2xhc3ModHlwZSlcbiAgICAgIGlmICh0eXBlb2YgJG5leHQgPT09ICdvYmplY3QnICYmICRuZXh0Lmxlbmd0aCkge1xuICAgICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgICAgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICBpZiAoaHJlZikge1xuICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ICA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgaHJlZlxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG5cbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcbiAgICB2YXIgc2xpZGVJbmRleCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2xpZGUtdG8nKVxuICAgIGlmIChzbGlkZUluZGV4KSBvcHRpb25zLmludGVydmFsID0gZmFsc2VcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbnMpXG5cbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgJHRhcmdldC5kYXRhKCdicy5jYXJvdXNlbCcpLnRvKHNsaWRlSW5kZXgpXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGVdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGUtdG9dJywgY2xpY2tIYW5kbGVyKVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkY2Fyb3VzZWwgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY29sbGFwc2UuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENPTExBUFNFIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuJHRyaWdnZXIgICAgICA9ICQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gbnVsbFxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxuICB9XG5cbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTiA9IDM1MFxuXG4gIENvbGxhcHNlLkRFRkFVTFRTID0ge1xuICAgIHRvZ2dsZTogdHJ1ZVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmRpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgcmV0dXJuIGhhc1dpZHRoID8gJ3dpZHRoJyA6ICdoZWlnaHQnXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIGFjdGl2ZXNEYXRhXG4gICAgdmFyIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmNoaWxkcmVuKCcucGFuZWwnKS5jaGlsZHJlbignLmluLCAuY29sbGFwc2luZycpXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgYWN0aXZlc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBQbHVnaW4uY2FsbChhY3RpdmVzLCAnaGlkZScpXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVtkaW1lbnNpb25dKDApXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKVtkaW1lbnNpb25dKCcnKVxuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAudHJpZ2dlcignc2hvd24uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbMF1bc2Nyb2xsU2l6ZV0pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8ICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oKSlbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICBbZGltZW5zaW9uXSgwKVxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpID8gJ2hpZGUnIDogJ3Nob3cnXSgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5wYXJlbnQpXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxuICAgICAgLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXG4gICAgICB9LCB0aGlzKSlcbiAgICAgIC5lbmQoKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJHRyaWdnZXIpIHtcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcblxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gICAgJHRyaWdnZXJcbiAgICAgIC50b2dnbGVDbGFzcygnY29sbGFwc2VkJywgIWlzT3BlbilcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRyaWdnZXIpIHtcbiAgICB2YXIgaHJlZlxuICAgIHZhciB0YXJnZXQgPSAkdHJpZ2dlci5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICB8fCAoaHJlZiA9ICR0cmlnZ2VyLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICB9XG5cblxuICAvLyBDT0xMQVBTRSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhICYmIG9wdGlvbnMudG9nZ2xlICYmIC9zaG93fGhpZGUvLnRlc3Qob3B0aW9uKSkgb3B0aW9ucy50b2dnbGUgPSBmYWxzZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jb2xsYXBzZS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG5cblxuICAvLyBDT0xMQVBTRSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuXG4gICAgaWYgKCEkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIHZhciAkdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRoaXMpXG4gICAgdmFyIGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBkcm9wZG93bi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICE9PSAnIycgPyAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKSA6IG51bGxcblxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcbiAgICBpZiAoZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm5cbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgICAgICAgID0gJCh0aGlzKVxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG5cbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cblxuICAgICAgaWYgKGUgJiYgZS50eXBlID09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSAmJiAkLmNvbnRhaW5zKCRwYXJlbnRbMF0sIGUudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfSlcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBjbGVhck1lbnVzKClcblxuICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXG4gICAgICAgICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXG4gICAgICAgICAgLm9uKCdjbGljaycsIGNsZWFyTWVudXMpXG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzXG4gICAgICAgIC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuXG4gICAgICAkcGFyZW50XG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXG4gICAgICAgIC50cmlnZ2VyKCQuRXZlbnQoJ3Nob3duLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChlLndoaWNoKSB8fCAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cblxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBpZiAoIWlzQWN0aXZlICYmIGUud2hpY2ggIT0gMjcgfHwgaXNBY3RpdmUgJiYgZS53aGljaCA9PSAyNykge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgfVxuXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcbiAgICB2YXIgJGl0ZW1zID0gJHBhcmVudC5maW5kKCcuZHJvcGRvd24tbWVudScgKyBkZXNjKVxuXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcblxuICAgIGlmIChlLndoaWNoID09IDM4ICYmIGluZGV4ID4gMCkgICAgICAgICAgICAgICAgIGluZGV4LS0gICAgICAgICAvLyB1cFxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXG5cbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgfVxuXG5cbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmRyb3Bkb3duXG5cbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gIC8vIERST1BET1dOIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5kcm9wZG93bi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBUFBMWSBUTyBTVEFOREFSRCBEUk9QRE9XTiBFTEVNRU5UU1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybScsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSlcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93bi1tZW51JywgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIE1PREFMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRkaWFsb2cgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICAgIHRoaXMuaXNTaG93biA9IG51bGxcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IG51bGxcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gMFxuICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgdGhpcy5maXhlZENvbnRlbnQgPSAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tJ1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdGUpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmZpbmQoJy5tb2RhbC1jb250ZW50JylcbiAgICAgICAgLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxuICAgICAgICB9LCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDBcbiAgTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIE1vZGFsLkRFRkFVTFRTID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IHRydWVcblxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKClcbiAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJylcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICQucHJveHkodGhpcy5oaWRlLCB0aGlzKSlcblxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9uZSgnbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoYXQuJGVsZW1lbnQpKSB0aGF0Lmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudC5hcHBlbmRUbyh0aGF0LiRib2R5KSAvLyBkb24ndCBtb3ZlIG1vZGFscyBkb20gcG9zaXRpb25cbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC5zY3JvbGxUb3AoMClcblxuICAgICAgdGhhdC5hZGp1c3REaWFsb2coKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdpbicpXG5cbiAgICAgIHRoYXQuZW5mb3JjZUZvY3VzKClcblxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgICAgdHJhbnNpdGlvbiA/XG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoIXRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgJChkb2N1bWVudCkub2ZmKCdmb2N1c2luLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgICAub2ZmKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eSh0aGlzLmhpZGVNb2RhbCwgdGhpcykpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAub2ZmKCdmb2N1c2luLmJzLm1vZGFsJykgLy8gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBmb2N1cyBsb29wXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICB0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5rZXlib2FyZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93bikge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRib2R5LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcbiAgICAgIHRoYXQucmVzZXRBZGp1c3RtZW50cygpXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcbiAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuLmJzLm1vZGFsJylcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYmFja2Ryb3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXG5cbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5iYWNrZHJvcCkge1xuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgdGhpcy4kYmFja2Ryb3AgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxuICAgICAgICAuYXBwZW5kVG8odGhpcy4kYm9keSlcblxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaykge1xuICAgICAgICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcbiAgICAgICAgICA/IHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKVxuICAgICAgICAgIDogdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuXG4gICAgICBpZiAoZG9BbmltYXRlKSB0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXG5cbiAgICAgIGRvQW5pbWF0ZSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2spXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrUmVtb3ZlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrUmVtb3ZlKClcblxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGVzZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXG5cbiAgTW9kYWwucHJvdG90eXBlLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkanVzdERpYWxvZygpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYWRqdXN0RGlhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgIW1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVsbFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkgeyAvLyB3b3JrYXJvdW5kIGZvciBtaXNzaW5nIHdpbmRvdy5pbm5lcldpZHRoIGluIElFOFxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpXG4gICAgfVxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMubWVhc3VyZVNjcm9sbGJhcigpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib2R5UGFkID0gcGFyc2VJbnQoKHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCksIDEwKVxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoXG4gICAgaWYgKHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHNjcm9sbGJhcldpZHRoKVxuICAgICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodFxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGVsZW1lbnQpLmNzcygncGFkZGluZy1yaWdodCcpXG4gICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAuZGF0YSgncGFkZGluZy1yaWdodCcsIGFjdHVhbFBhZGRpbmcpXG4gICAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcbiAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgdmFyIHBhZGRpbmcgPSAkKGVsZW1lbnQpLmRhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgJChlbGVtZW50KS5yZW1vdmVEYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA/IHBhZGRpbmcgOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHsgLy8gdGh4IHdhbHNoXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSdcbiAgICB0aGlzLiRib2R5LmFwcGVuZChzY3JvbGxEaXYpXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXG4gICAgdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpXG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoXG4gIH1cblxuXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTW9kYWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKF9yZWxhdGVkVGFyZ2V0KVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5zaG93KSBkYXRhLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXG5cbiAgJC5mbi5tb2RhbCA9IFBsdWdpblxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcblxuXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBNT0RBTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgIHZhciBocmVmID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgdmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHxcbiAgICAgIChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICAgIHZhciBvcHRpb24gPSAkdGFyZ2V0LmRhdGEoJ2JzLm1vZGFsJykgPyAndG9nZ2xlJyA6ICQuZXh0ZW5kKHsgcmVtb3RlOiAhLyMvLnRlc3QoaHJlZikgJiYgaHJlZiB9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldC5vbmUoJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxuICAgICAgJHRhcmdldC5vbmUoJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRoaXMuaXMoJzp2aXNpYmxlJykgJiYgJHRoaXMudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfSlcbiAgICB9KVxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbiwgdGhpcylcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdG9vbHRpcC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0b29sdGlwXG4gKiBJbnNwaXJlZCBieSB0aGUgb3JpZ2luYWwgalF1ZXJ5LnRpcHN5IGJ5IEphc29uIEZyYW1lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBbJ3Nhbml0aXplJywgJ3doaXRlTGlzdCcsICdzYW5pdGl6ZUZuJ11cblxuICB2YXIgdXJpQXR0cnMgPSBbXG4gICAgJ2JhY2tncm91bmQnLFxuICAgICdjaXRlJyxcbiAgICAnaHJlZicsXG4gICAgJ2l0ZW10eXBlJyxcbiAgICAnbG9uZ2Rlc2MnLFxuICAgICdwb3N0ZXInLFxuICAgICdzcmMnLFxuICAgICd4bGluazpocmVmJ1xuICBdXG5cbiAgdmFyIEFSSUFfQVRUUklCVVRFX1BBVFRFUk4gPSAvXmFyaWEtW1xcdy1dKiQvaVxuXG4gIHZhciBEZWZhdWx0V2hpdGVsaXN0ID0ge1xuICAgIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICAgJyonOiBbJ2NsYXNzJywgJ2RpcicsICdpZCcsICdsYW5nJywgJ3JvbGUnLCBBUklBX0FUVFJJQlVURV9QQVRURVJOXSxcbiAgICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxuICAgIGFyZWE6IFtdLFxuICAgIGI6IFtdLFxuICAgIGJyOiBbXSxcbiAgICBjb2w6IFtdLFxuICAgIGNvZGU6IFtdLFxuICAgIGRpdjogW10sXG4gICAgZW06IFtdLFxuICAgIGhyOiBbXSxcbiAgICBoMTogW10sXG4gICAgaDI6IFtdLFxuICAgIGgzOiBbXSxcbiAgICBoNDogW10sXG4gICAgaDU6IFtdLFxuICAgIGg2OiBbXSxcbiAgICBpOiBbXSxcbiAgICBpbWc6IFsnc3JjJywgJ2FsdCcsICd0aXRsZScsICd3aWR0aCcsICdoZWlnaHQnXSxcbiAgICBsaTogW10sXG4gICAgb2w6IFtdLFxuICAgIHA6IFtdLFxuICAgIHByZTogW10sXG4gICAgczogW10sXG4gICAgc21hbGw6IFtdLFxuICAgIHNwYW46IFtdLFxuICAgIHN1YjogW10sXG4gICAgc3VwOiBbXSxcbiAgICBzdHJvbmc6IFtdLFxuICAgIHU6IFtdLFxuICAgIHVsOiBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpXG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IG1hdGNoZXMgc2FmZSBkYXRhIFVSTHMuIE9ubHkgbWF0Y2hlcyBpbWFnZSwgdmlkZW8gYW5kIGF1ZGlvIHR5cGVzLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2lcblxuICBmdW5jdGlvbiBhbGxvd2VkQXR0cmlidXRlKGF0dHIsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSB7XG4gICAgdmFyIGF0dHJOYW1lID0gYXR0ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgIT09IC0xKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCB1cmlBdHRycykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKGF0dHIubm9kZVZhbHVlLm1hdGNoKFNBRkVfVVJMX1BBVFRFUk4pIHx8IGF0dHIubm9kZVZhbHVlLm1hdGNoKERBVEFfVVJMX1BBVFRFUk4pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciByZWdFeHAgPSAkKGFsbG93ZWRBdHRyaWJ1dGVMaXN0KS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgfSlcblxuICAgIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVnRXhwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGF0dHJOYW1lLm1hdGNoKHJlZ0V4cFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB3aGl0ZUxpc3QsIHNhbml0aXplRm4pIHtcbiAgICBpZiAodW5zYWZlSHRtbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgaWYgKHNhbml0aXplRm4gJiYgdHlwZW9mIHNhbml0aXplRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBzYW5pdGl6ZUZuKHVuc2FmZUh0bWwpXG4gICAgfVxuXG4gICAgLy8gSUUgOCBhbmQgYmVsb3cgZG9uJ3Qgc3VwcG9ydCBjcmVhdGVIVE1MRG9jdW1lbnRcbiAgICBpZiAoIWRvY3VtZW50LmltcGxlbWVudGF0aW9uIHx8ICFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnc2FuaXRpemF0aW9uJylcbiAgICBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB1bnNhZmVIdG1sXG5cbiAgICB2YXIgd2hpdGVsaXN0S2V5cyA9ICQubWFwKHdoaXRlTGlzdCwgZnVuY3Rpb24gKGVsLCBpKSB7IHJldHVybiBpIH0pXG4gICAgdmFyIGVsZW1lbnRzID0gJChjcmVhdGVkRG9jdW1lbnQuYm9keSkuZmluZCgnKicpXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldXG4gICAgICB2YXIgZWxOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICBpZiAoJC5pbkFycmF5KGVsTmFtZSwgd2hpdGVsaXN0S2V5cykgPT09IC0xKSB7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJpYnV0ZUxpc3QgPSAkLm1hcChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIGVsIH0pXG4gICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSlcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbjIgPSBhdHRyaWJ1dGVMaXN0Lmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXSwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLm5vZGVOYW1lKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTFxuICB9XG5cbiAgLy8gVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMudHlwZSAgICAgICA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgICAgPSBudWxsXG4gICAgdGhpcy5lbmFibGVkICAgID0gbnVsbFxuICAgIHRoaXMudGltZW91dCAgICA9IG51bGxcbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG4gICAgdGhpcy4kZWxlbWVudCAgID0gbnVsbFxuICAgIHRoaXMuaW5TdGF0ZSAgICA9IG51bGxcblxuICAgIHRoaXMuaW5pdCgndG9vbHRpcCcsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBUb29sdGlwLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRvb2x0aXAuREVGQVVMVFMgPSB7XG4gICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gICAgdGl0bGU6ICcnLFxuICAgIGRlbGF5OiAwLFxuICAgIGh0bWw6IGZhbHNlLFxuICAgIGNvbnRhaW5lcjogZmFsc2UsXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHNlbGVjdG9yOiAnYm9keScsXG4gICAgICBwYWRkaW5nOiAwXG4gICAgfSxcbiAgICBzYW5pdGl6ZSA6IHRydWUsXG4gICAgc2FuaXRpemVGbiA6IG51bGwsXG4gICAgd2hpdGVMaXN0IDogRGVmYXVsdFdoaXRlbGlzdFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbmFibGVkICAgPSB0cnVlXG4gICAgdGhpcy50eXBlICAgICAgPSB0eXBlXG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSB0aGlzLmdldE9wdGlvbnMob3B0aW9ucylcbiAgICB0aGlzLiR2aWV3cG9ydCA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiAkKGRvY3VtZW50KS5maW5kKCQuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpID8gdGhpcy5vcHRpb25zLnZpZXdwb3J0LmNhbGwodGhpcywgdGhpcy4kZWxlbWVudCkgOiAodGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy52aWV3cG9ydCkpXG4gICAgdGhpcy5pblN0YXRlICAgPSB7IGNsaWNrOiBmYWxzZSwgaG92ZXI6IGZhbHNlLCBmb2N1czogZmFsc2UgfVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0gaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciAmJiAhdGhpcy5vcHRpb25zLnNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nICcgKyB0aGlzLnR5cGUgKyAnIG9uIHRoZSB3aW5kb3cuZG9jdW1lbnQgb2JqZWN0IScpXG4gICAgfVxuXG4gICAgdmFyIHRyaWdnZXJzID0gdGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgZm9yICh2YXIgaSA9IHRyaWdnZXJzLmxlbmd0aDsgaS0tOykge1xuICAgICAgdmFyIHRyaWdnZXIgPSB0cmlnZ2Vyc1tpXVxuXG4gICAgICBpZiAodHJpZ2dlciA9PSAnY2xpY2snKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLnRvZ2dsZSwgdGhpcykpXG4gICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcbiAgICAgICAgdmFyIGV2ZW50SW4gID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlZW50ZXInIDogJ2ZvY3VzaW4nXG4gICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdmb2N1c291dCdcblxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50SW4gICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5lbnRlciwgdGhpcykpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRPdXQgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmxlYXZlLCB0aGlzKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuc2VsZWN0b3IgP1xuICAgICAgKHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7IHRyaWdnZXI6ICdtYW51YWwnLCBzZWxlY3RvcjogJycgfSkpIDpcbiAgICAgIHRoaXMuZml4VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFRvb2x0aXAuREVGQVVMVFNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkYXRhQXR0cmlidXRlcyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgpXG5cbiAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xuICAgICAgaWYgKGRhdGFBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGRhdGFBdHRyKSAmJiAkLmluQXJyYXkoZGF0YUF0dHIsIERJU0FMTE9XRURfQVRUUklCVVRFUykgIT09IC0xKSB7XG4gICAgICAgIGRlbGV0ZSBkYXRhQXR0cmlidXRlc1tkYXRhQXR0cl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgZGF0YUF0dHJpYnV0ZXMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNhbml0aXplKSB7XG4gICAgICBvcHRpb25zLnRlbXBsYXRlID0gc2FuaXRpemVIdG1sKG9wdGlvbnMudGVtcGxhdGUsIG9wdGlvbnMud2hpdGVMaXN0LCBvcHRpb25zLnNhbml0aXplRm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyAgPSB7fVxuICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxuXG4gICAgdGhpcy5fb3B0aW9ucyAmJiAkLmVhY2godGhpcy5fb3B0aW9ucywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChkZWZhdWx0c1trZXldICE9IHZhbHVlKSBvcHRpb25zW2tleV0gPSB2YWx1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNpbicgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgfHwgc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHtcbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpIHJldHVybiBzZWxmLnNob3coKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHNlbGYuc2hvdygpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmluU3RhdGUpIHtcbiAgICAgIGlmICh0aGlzLmluU3RhdGVba2V5XSkgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmxlYXZlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3Vzb3V0JyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSByZXR1cm5cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnb3V0J1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5oaWRlKSByZXR1cm4gc2VsZi5oaWRlKClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnb3V0Jykgc2VsZi5oaWRlKClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgdmFyIGluRG9tID0gJC5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzLiRlbGVtZW50WzBdKVxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgIWluRG9tKSByZXR1cm5cbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKClcblxuICAgICAgdmFyIHRpcElkID0gdGhpcy5nZXRVSUQodGhpcy50eXBlKVxuXG4gICAgICB0aGlzLnNldENvbnRlbnQoKVxuICAgICAgJHRpcC5hdHRyKCdpZCcsIHRpcElkKVxuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGlwSWQpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSAkdGlwLmFkZENsYXNzKCdmYWRlJylcblxuICAgICAgdmFyIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcywgJHRpcFswXSwgdGhpcy4kZWxlbWVudFswXSkgOlxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50XG5cbiAgICAgIHZhciBhdXRvVG9rZW4gPSAvXFxzP2F1dG8/XFxzPy9pXG4gICAgICB2YXIgYXV0b1BsYWNlID0gYXV0b1Rva2VuLnRlc3QocGxhY2VtZW50KVxuICAgICAgaWYgKGF1dG9QbGFjZSkgcGxhY2VtZW50ID0gcGxhY2VtZW50LnJlcGxhY2UoYXV0b1Rva2VuLCAnJykgfHwgJ3RvcCdcblxuICAgICAgJHRpcFxuICAgICAgICAuZGV0YWNoKClcbiAgICAgICAgLmNzcyh7IHRvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJyB9KVxuICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgICAuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgdGhpcylcblxuICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8oJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSkgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2luc2VydGVkLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICAgIHZhciBwb3MgICAgICAgICAgPSB0aGlzLmdldFBvc2l0aW9uKClcbiAgICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgICAgaWYgKGF1dG9QbGFjZSkge1xuICAgICAgICB2YXIgb3JnUGxhY2VtZW50ID0gcGxhY2VtZW50XG4gICAgICAgIHZhciB2aWV3cG9ydERpbSA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50ID09ICdib3R0b20nICYmIHBvcy5ib3R0b20gKyBhY3R1YWxIZWlnaHQgPiB2aWV3cG9ydERpbS5ib3R0b20gPyAndG9wJyAgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICAmJiBwb3MudG9wICAgIC0gYWN0dWFsSGVpZ2h0IDwgdmlld3BvcnREaW0udG9wICAgID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAgJiYgcG9zLnJpZ2h0ICArIGFjdHVhbFdpZHRoICA+IHZpZXdwb3J0RGltLndpZHRoICA/ICdsZWZ0JyAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgICYmIHBvcy5sZWZ0ICAgLSBhY3R1YWxXaWR0aCAgPCB2aWV3cG9ydERpbS5sZWZ0ICAgPyAncmlnaHQnICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFxuXG4gICAgICAgICR0aXBcbiAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3JnUGxhY2VtZW50KVxuICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxjdWxhdGVkT2Zmc2V0ID0gdGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgICB0aGlzLmFwcGx5UGxhY2VtZW50KGNhbGN1bGF0ZWRPZmZzZXQsIHBsYWNlbWVudClcblxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJldkhvdmVyU3RhdGUgPSB0aGF0LmhvdmVyU3RhdGVcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93bi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgICB0aGF0LmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09ICdvdXQnKSB0aGF0LmxlYXZlKHRoYXQpXG4gICAgICB9XG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY29tcGxldGUoKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFwcGx5UGxhY2VtZW50ID0gZnVuY3Rpb24gKG9mZnNldCwgcGxhY2VtZW50KSB7XG4gICAgdmFyICR0aXAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgd2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBoZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgLy8gbWFudWFsbHkgcmVhZCBtYXJnaW5zIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGluY2x1ZGVzIGRpZmZlcmVuY2VcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi10b3AnKSwgMTApXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApXG5cbiAgICAvLyB3ZSBtdXN0IGNoZWNrIGZvciBOYU4gZm9yIGllIDgvOVxuICAgIGlmIChpc05hTihtYXJnaW5Ub3ApKSAgbWFyZ2luVG9wICA9IDBcbiAgICBpZiAoaXNOYU4obWFyZ2luTGVmdCkpIG1hcmdpbkxlZnQgPSAwXG5cbiAgICBvZmZzZXQudG9wICArPSBtYXJnaW5Ub3BcbiAgICBvZmZzZXQubGVmdCArPSBtYXJnaW5MZWZ0XG5cbiAgICAvLyAkLmZuLm9mZnNldCBkb2Vzbid0IHJvdW5kIHBpeGVsIHZhbHVlc1xuICAgIC8vIHNvIHdlIHVzZSBzZXRPZmZzZXQgZGlyZWN0bHkgd2l0aCBvdXIgb3duIGZ1bmN0aW9uIEItMFxuICAgICQub2Zmc2V0LnNldE9mZnNldCgkdGlwWzBdLCAkLmV4dGVuZCh7XG4gICAgICB1c2luZzogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICR0aXAuY3NzKHtcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQocHJvcHMudG9wKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKHByb3BzLmxlZnQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgb2Zmc2V0KSwgMClcblxuICAgICR0aXAuYWRkQ2xhc3MoJ2luJylcblxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBwbGFjaW5nIHRpcCBpbiBuZXcgb2Zmc2V0IGNhdXNlZCB0aGUgdGlwIHRvIHJlc2l6ZSBpdHNlbGZcbiAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJyAmJiBhY3R1YWxIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICBvZmZzZXQudG9wID0gb2Zmc2V0LnRvcCArIGhlaWdodCAtIGFjdHVhbEhlaWdodFxuICAgIH1cblxuICAgIHZhciBkZWx0YSA9IHRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKHBsYWNlbWVudCwgb2Zmc2V0LCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgaWYgKGRlbHRhLmxlZnQpIG9mZnNldC5sZWZ0ICs9IGRlbHRhLmxlZnRcbiAgICBlbHNlIG9mZnNldC50b3AgKz0gZGVsdGEudG9wXG5cbiAgICB2YXIgaXNWZXJ0aWNhbCAgICAgICAgICA9IC90b3B8Ym90dG9tLy50ZXN0KHBsYWNlbWVudClcbiAgICB2YXIgYXJyb3dEZWx0YSAgICAgICAgICA9IGlzVmVydGljYWwgPyBkZWx0YS5sZWZ0ICogMiAtIHdpZHRoICsgYWN0dWFsV2lkdGggOiBkZWx0YS50b3AgKiAyIC0gaGVpZ2h0ICsgYWN0dWFsSGVpZ2h0XG4gICAgdmFyIGFycm93T2Zmc2V0UG9zaXRpb24gPSBpc1ZlcnRpY2FsID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXG5cbiAgICAkdGlwLm9mZnNldChvZmZzZXQpXG4gICAgdGhpcy5yZXBsYWNlQXJyb3coYXJyb3dEZWx0YSwgJHRpcFswXVthcnJvd09mZnNldFBvc2l0aW9uXSwgaXNWZXJ0aWNhbClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnJlcGxhY2VBcnJvdyA9IGZ1bmN0aW9uIChkZWx0YSwgZGltZW5zaW9uLCBpc1ZlcnRpY2FsKSB7XG4gICAgdGhpcy5hcnJvdygpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJywgNTAgKiAoMSAtIGRlbHRhIC8gZGltZW5zaW9uKSArICclJylcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLCAnJylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gc2FuaXRpemVIdG1sKHRpdGxlLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLmh0bWwodGl0bGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS50ZXh0KHRpdGxlKVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgJHRpcCA9ICQodGhpcy4kdGlwKVxuICAgIHZhciBlICAgID0gJC5FdmVudCgnaGlkZS5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBpZiAodGhhdC5ob3ZlclN0YXRlICE9ICdpbicpICR0aXAuZGV0YWNoKClcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50KSB7IC8vIFRPRE86IENoZWNrIHdoZXRoZXIgZ3VhcmRpbmcgdGhpcyBjb2RlIHdpdGggdGhpcyBgaWZgIGlzIHJlYWxseSBuZWNlc3NhcnkuXG4gICAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICR0aXBcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIGNvbXBsZXRlKClcblxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5maXhUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgaWYgKCRlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSAhPSAnc3RyaW5nJykge1xuICAgICAgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScsICRlLmF0dHIoJ3RpdGxlJykgfHwgJycpLmF0dHIoJ3RpdGxlJywgJycpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICRlbGVtZW50ICAgPSAkZWxlbWVudCB8fCB0aGlzLiRlbGVtZW50XG5cbiAgICB2YXIgZWwgICAgID0gJGVsZW1lbnRbMF1cbiAgICB2YXIgaXNCb2R5ID0gZWwudGFnTmFtZSA9PSAnQk9EWSdcblxuICAgIHZhciBlbFJlY3QgICAgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChlbFJlY3Qud2lkdGggPT0gbnVsbCkge1xuICAgICAgLy8gd2lkdGggYW5kIGhlaWdodCBhcmUgbWlzc2luZyBpbiBJRTgsIHNvIGNvbXB1dGUgdGhlbSBtYW51YWxseTsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMTQwOTNcbiAgICAgIGVsUmVjdCA9ICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHsgd2lkdGg6IGVsUmVjdC5yaWdodCAtIGVsUmVjdC5sZWZ0LCBoZWlnaHQ6IGVsUmVjdC5ib3R0b20gLSBlbFJlY3QudG9wIH0pXG4gICAgfVxuICAgIHZhciBpc1N2ZyA9IHdpbmRvdy5TVkdFbGVtZW50ICYmIGVsIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnRcbiAgICAvLyBBdm9pZCB1c2luZyAkLm9mZnNldCgpIG9uIFNWR3Mgc2luY2UgaXQgZ2l2ZXMgaW5jb3JyZWN0IHJlc3VsdHMgaW4galF1ZXJ5IDMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMjAyODBcbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IChpc1N2ZyA/IG51bGwgOiAkZWxlbWVudC5vZmZzZXQoKSlcbiAgICB2YXIgc2Nyb2xsICAgID0geyBzY3JvbGw6IGlzQm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgOiAkZWxlbWVudC5zY3JvbGxUb3AoKSB9XG4gICAgdmFyIG91dGVyRGltcyA9IGlzQm9keSA/IHsgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSB9IDogbnVsbFxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHNjcm9sbCwgb3V0ZXJEaW1zLCBlbE9mZnNldClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICByZXR1cm4gcGxhY2VtZW50ID09ICdib3R0b20nID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0LCAgIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgID8geyB0b3A6IHBvcy50b3AgLSBhY3R1YWxIZWlnaHQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggfSA6XG4gICAgICAgIC8qIHBsYWNlbWVudCA9PSAncmlnaHQnICovIHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCB9XG5cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHZhciBkZWx0YSA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgICBpZiAoIXRoaXMuJHZpZXdwb3J0KSByZXR1cm4gZGVsdGFcblxuICAgIHZhciB2aWV3cG9ydFBhZGRpbmcgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmcgfHwgMFxuICAgIHZhciB2aWV3cG9ydERpbWVuc2lvbnMgPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgaWYgKC9yaWdodHxsZWZ0Ly50ZXN0KHBsYWNlbWVudCkpIHtcbiAgICAgIHZhciB0b3BFZGdlT2Zmc2V0ICAgID0gcG9zLnRvcCAtIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGxcbiAgICAgIHZhciBib3R0b21FZGdlT2Zmc2V0ID0gcG9zLnRvcCArIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGwgKyBhY3R1YWxIZWlnaHRcbiAgICAgIGlmICh0b3BFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLnRvcCkgeyAvLyB0b3Agb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCAtIHRvcEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAoYm90dG9tRWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0KSB7IC8vIGJvdHRvbSBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCAtIGJvdHRvbUVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlZnRFZGdlT2Zmc2V0ICA9IHBvcy5sZWZ0IC0gdmlld3BvcnRQYWRkaW5nXG4gICAgICB2YXIgcmlnaHRFZGdlT2Zmc2V0ID0gcG9zLmxlZnQgKyB2aWV3cG9ydFBhZGRpbmcgKyBhY3R1YWxXaWR0aFxuICAgICAgaWYgKGxlZnRFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLmxlZnQpIHsgLy8gbGVmdCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgLSBsZWZ0RWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChyaWdodEVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMucmlnaHQpIHsgLy8gcmlnaHQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0ICsgdmlld3BvcnREaW1lbnNpb25zLndpZHRoIC0gcmlnaHRFZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbHRhXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGVcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICB0aXRsZSA9ICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKVxuICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXG5cbiAgICByZXR1cm4gdGl0bGVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFVJRCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICBkbyBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApXG4gICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG4gICAgcmV0dXJuIHByZWZpeFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kdGlwKSB7XG4gICAgICB0aGlzLiR0aXAgPSAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSlcbiAgICAgIGlmICh0aGlzLiR0aXAubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCEnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4kdGlwXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcudG9vbHRpcC1hcnJvdycpKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAoZSkge1xuICAgICAgc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuICAgICAgaWYgKCFzZWxmKSB7XG4gICAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlKSB7XG4gICAgICBzZWxmLmluU3RhdGUuY2xpY2sgPSAhc2VsZi5pblN0YXRlLmNsaWNrXG4gICAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHNlbGYuZW50ZXIoc2VsZilcbiAgICAgIGVsc2Ugc2VsZi5sZWF2ZShzZWxmKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpID8gc2VsZi5sZWF2ZShzZWxmKSA6IHNlbGYuZW50ZXIoc2VsZilcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5oaWRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub2ZmKCcuJyArIHRoYXQudHlwZSkucmVtb3ZlRGF0YSgnYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGlmICh0aGF0LiR0aXApIHtcbiAgICAgICAgdGhhdC4kdGlwLmRldGFjaCgpXG4gICAgICB9XG4gICAgICB0aGF0LiR0aXAgPSBudWxsXG4gICAgICB0aGF0LiRhcnJvdyA9IG51bGxcbiAgICAgIHRoYXQuJHZpZXdwb3J0ID0gbnVsbFxuICAgICAgdGhhdC4kZWxlbWVudCA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2FuaXRpemVIdG1sID0gZnVuY3Rpb24gKHVuc2FmZUh0bWwpIHtcbiAgICByZXR1cm4gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICB9XG5cbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuXG5cbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFBvcG92ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdCgncG9wb3ZlcicsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoISQuZm4udG9vbHRpcCkgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanMnKVxuXG4gIFBvcG92ZXIuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcbiAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgICBjb250ZW50OiAnJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J1xuICB9KVxuXG5cbiAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBQb3BvdmVyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQb3BvdmVyLkRFRkFVTFRTXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICB2YXIgdHlwZUNvbnRlbnQgPSB0eXBlb2YgY29udGVudFxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gdGhpcy5zYW5pdGl6ZUh0bWwodGl0bGUpXG5cbiAgICAgICAgaWYgKHR5cGVDb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLnNhbml0aXplSHRtbChjb250ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcbiAgICAgICAgdHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCdcbiAgICAgIF0oY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLnRleHQodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpLnRleHQoY29udGVudClcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpbicpXG5cbiAgICAvLyBJRTggZG9lc24ndCBhY2NlcHQgaGlkaW5nIHZpYSB0aGUgYDplbXB0eWAgcHNldWRvIHNlbGVjdG9yLCB3ZSBoYXZlIHRvIGRvXG4gICAgLy8gdGhpcyBtYW51YWxseSBieSBjaGVja2luZyB0aGUgY29udGVudHMuXG4gICAgaWYgKCEkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCgpKSAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaGlkZSgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5nZXRDb250ZW50KClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgcmV0dXJuICRlLmF0dHIoJ2RhdGEtY29udGVudCcpXG4gICAgICB8fCAodHlwZW9mIG8uY29udGVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgby5jb250ZW50LmNhbGwoJGVbMF0pIDpcbiAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Njcm9sbHNweVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFNDUk9MTFNQWSBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKGRvY3VtZW50LmJvZHkpID8gJCh3aW5kb3cpIDogJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSAkLmV4dGVuZCh7fSwgU2Nyb2xsU3B5LkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xuICAgIHRoaXMub2Zmc2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgICA9IDBcblxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFNjcm9sbFNweS5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDEwXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgICAgICAgICAgPSB0aGlzXG4gICAgdmFyIG9mZnNldE1ldGhvZCAgPSAnb2Zmc2V0J1xuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxuXG4gICAgdGhpcy5vZmZzZXRzICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xuICAgICAgb2Zmc2V0TWV0aG9kID0gJ3Bvc2l0aW9uJ1xuICAgICAgb2Zmc2V0QmFzZSAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKVxuICAgIH1cblxuICAgIHRoaXMuJGJvZHlcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCAgID0gJCh0aGlzKVxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICB2YXIgJGhyZWYgPSAvXiMuLy50ZXN0KGhyZWYpICYmICQoaHJlZilcblxuICAgICAgICByZXR1cm4gKCRocmVmXG4gICAgICAgICAgJiYgJGhyZWYubGVuZ3RoXG4gICAgICAgICAgJiYgJGhyZWYuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5vZmZzZXRzLnB1c2godGhpc1swXSlcbiAgICAgICAgdGhhdC50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgIH0pXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0cyAgICAgID0gdGhpcy5vZmZzZXRzXG4gICAgdmFyIHRhcmdldHMgICAgICA9IHRoaXMudGFyZ2V0c1xuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxuICAgIHZhciBpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0c1t0YXJnZXRzLmxlbmd0aCAtIDFdKSAmJiB0aGlzLmFjdGl2YXRlKGkpXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCBvZmZzZXRzWzBdKSB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKClcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgYWN0aXZlVGFyZ2V0ICE9IHRhcmdldHNbaV1cbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cbiAgICAgICAgJiYgKG9mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHwgc2Nyb2xsVG9wIDwgb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICYmIHRoaXMuYWN0aXZhdGUodGFyZ2V0c1tpXSlcbiAgICB9XG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLmNsZWFyKClcblxuICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgK1xuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xuICAgICAgdGhpcy5zZWxlY3RvciArICdbaHJlZj1cIicgKyB0YXJnZXQgKyAnXCJdJ1xuXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXG4gICAgICAucGFyZW50cygnbGknKVxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgaWYgKGFjdGl2ZS5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZS5icy5zY3JvbGxzcHknKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMuc2VsZWN0b3IpXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScsIChkYXRhID0gbmV3IFNjcm9sbFNweSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uc2Nyb2xsc3B5XG5cbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3IgPSBTY3JvbGxTcHlcblxuXG4gIC8vIFNDUk9MTFNQWSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksICRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRhYi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0YWJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gVEFCIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVGFiID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBqc2NzOmRpc2FibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgLy8ganNjczplbmFibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgfVxuXG4gIFRhYi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVGFiLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxuICAgIHZhciAkdWwgICAgICA9ICR0aGlzLmNsb3Nlc3QoJ3VsOm5vdCguZHJvcGRvd24tbWVudSknKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmRhdGEoJ3RhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgIHZhciAkcHJldmlvdXMgPSAkdWwuZmluZCgnLmFjdGl2ZTpsYXN0IGEnKVxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgfSlcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICB9KVxuXG4gICAgJHByZXZpb3VzLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICR0aGlzLnRyaWdnZXIoc2hvd0V2ZW50KVxuXG4gICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGhpcy5jbG9zZXN0KCdsaScpLCAkdWwpXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkcHJldmlvdXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdoaWRkZW4uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICAgIH0pXG4gICAgICAkdGhpcy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyICRhY3RpdmUgICAgPSBjb250YWluZXIuZmluZCgnPiAuYWN0aXZlJylcbiAgICB2YXIgdHJhbnNpdGlvbiA9IGNhbGxiYWNrXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxuICAgICAgJiYgKCRhY3RpdmUubGVuZ3RoICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKSB8fCAhIWNvbnRhaW5lci5maW5kKCc+IC5mYWRlJykubGVuZ3RoKVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5lbmQoKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgZWxlbWVudFxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgbmV4dClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBuZXh0KClcblxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcbiAgfVxuXG5cbiAgLy8gVEFCIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLnRhYicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50YWJcblxuICAkLmZuLnRhYiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRhYi5Db25zdHJ1Y3RvciA9IFRhYlxuXG5cbiAgLy8gVEFCIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQuZm4udGFiLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50YWIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBUQUIgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgUGx1Z2luLmNhbGwoJCh0aGlzKSwgJ3Nob3cnKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQWZmaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBZmZpeC5ERUZBVUxUUywgb3B0aW9ucylcblxuICAgIHZhciB0YXJnZXQgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ID09PSBBZmZpeC5ERUZBVUxUUy50YXJnZXQgPyAkKHRoaXMub3B0aW9ucy50YXJnZXQpIDogJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAub24oJ3Njcm9sbC5icy5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYnMuYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLCB0aGlzKSlcblxuICAgIHRoaXMuJGVsZW1lbnQgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuYWZmaXhlZCAgICAgID0gbnVsbFxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxuICAgIHRoaXMucGlubmVkT2Zmc2V0ID0gbnVsbFxuXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgfVxuXG4gIEFmZml4LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEFmZml4LlJFU0VUICAgID0gJ2FmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b20nXG5cbiAgQWZmaXguREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAwLFxuICAgIHRhcmdldDogd2luZG93XG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgICAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHRoaXMuYWZmaXhlZCA9PSAndG9wJykgcmV0dXJuIHNjcm9sbFRvcCA8IG9mZnNldFRvcCA/ICd0b3AnIDogZmFsc2VcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgPT0gJ2JvdHRvbScpIHtcbiAgICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCkgcmV0dXJuIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXG4gICAgdmFyIGNvbGxpZGVyVG9wICAgID0gaW5pdGlhbGl6aW5nID8gc2Nyb2xsVG9wIDogcG9zaXRpb24udG9wXG4gICAgdmFyIGNvbGxpZGVySGVpZ2h0ID0gaW5pdGlhbGl6aW5nID8gdGFyZ2V0SGVpZ2h0IDogaGVpZ2h0XG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCkgcmV0dXJuICd0b3AnXG4gICAgaWYgKG9mZnNldEJvdHRvbSAhPSBudWxsICYmIChjb2xsaWRlclRvcCArIGNvbGxpZGVySGVpZ2h0ID49IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkpIHJldHVybiAnYm90dG9tJ1xuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBpbm5lZE9mZnNldCkgcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm5cblxuICAgIHZhciBoZWlnaHQgICAgICAgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldCAgICAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxuICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KCQoZG9jdW1lbnQpLmhlaWdodCgpLCAkKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKVxuXG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgIT0gJ29iamVjdCcpICAgICAgICAgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0VG9wID0gb2Zmc2V0XG4gICAgaWYgKHR5cGVvZiBvZmZzZXRUb3AgPT0gJ2Z1bmN0aW9uJykgICAgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcCh0aGlzLiRlbGVtZW50KVxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcblxuICAgIHZhciBhZmZpeCA9IHRoaXMuZ2V0U3RhdGUoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCAhPSBhZmZpeCkge1xuICAgICAgaWYgKHRoaXMudW5waW4gIT0gbnVsbCkgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsICcnKVxuXG4gICAgICB2YXIgYWZmaXhUeXBlID0gJ2FmZml4JyArIChhZmZpeCA/ICctJyArIGFmZml4IDogJycpXG4gICAgICB2YXIgZSAgICAgICAgID0gJC5FdmVudChhZmZpeFR5cGUgKyAnLmJzLmFmZml4JylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgdGhpcy5hZmZpeGVkID0gYWZmaXhcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxuICAgICAgICAuYWRkQ2xhc3MoYWZmaXhUeXBlKVxuICAgICAgICAudHJpZ2dlcihhZmZpeFR5cGUucmVwbGFjZSgnYWZmaXgnLCAnYWZmaXhlZCcpICsgJy5icy5hZmZpeCcpXG4gICAgfVxuXG4gICAgaWYgKGFmZml4ID09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XG4gICAgICAgIHRvcDogc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0IC0gb2Zmc2V0Qm90dG9tXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQUZGSVggUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYWZmaXgnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XG5cbiAgJC5mbi5hZmZpeCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcblxuXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWZmaXggPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBRkZJWCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXG5cbiAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwge31cblxuICAgICAgaWYgKGRhdGEub2Zmc2V0Qm90dG9tICE9IG51bGwpIGRhdGEub2Zmc2V0LmJvdHRvbSA9IGRhdGEub2Zmc2V0Qm90dG9tXG4gICAgICBpZiAoZGF0YS5vZmZzZXRUb3AgICAgIT0gbnVsbCkgZGF0YS5vZmZzZXQudG9wICAgID0gZGF0YS5vZmZzZXRUb3BcblxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgZGF0YSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG4iLCJqUXVlcnkoZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEVuYWJsZSB0b29sdGlwcy5cbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbn0pO1xuIl19
