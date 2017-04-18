(function($) {

  'use strict';

  function findTruncPoint(dim, max, txt, start, end, $worker, token, reverse) {
    var makeContent = function(content) {
      $worker.text(content);
      $worker[reverse ? 'prepend' : 'append'](token);
    };

    var opt1, opt2, mid, opt1dim, opt2dim;

    if (reverse) {
      opt1 = start === 0 ? '' : txt.slice(-start);
      opt2 = txt.slice(-end);
    } else {
      opt1 = txt.slice(0, start);
      opt2 = txt.slice(0, end);
    }

    if (max < $worker.html(token)[dim]()) {
      return 0;
    }

    makeContent(opt2);
    opt1dim = $worker[dim]();
    makeContent(opt1);
    opt2dim = $worker[dim]();
    if (opt1dim < opt2dim) {
      return end;
    }

    mid = parseInt((start + end) / 2, 10);
    opt1 = reverse ? txt.slice(-mid) : txt.slice(0, mid);

    makeContent(opt1);
    if ($worker[dim]() === max) {
      return mid;
    }

    if ($worker[dim]() > max) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }

    return findTruncPoint(dim, max, txt, start, end, $worker, token, reverse);
  }

  $.fn.truncate = function(options) {
    // backward compatibility
    if (options && !! options.center && !options.side) {
      options.side = 'center';
      delete options.center;
    }

    if (options && !(/^(left|right|center)$/).test(options.side)) {
      delete options.side;
    }

    var defaults = {
      width: 'auto',
      token: '&hellip;',
      side: 'right',
      addclass: false,
      addtitle: false,
      multiline: false,
      assumeSameStyle: false
    };
    options = $.extend(defaults, options);

    var fontCSS;
    var $element;
    var $truncateWorker;
    var elementText;

    if (options.assumeSameStyle) {
      $element = $(this[0]);
      fontCSS = {
        'fontFamily': $element.css('fontFamily'),
        'fontSize': $element.css('fontSize'),
        'fontStyle': $element.css('fontStyle'),
        'fontWeight': $element.css('fontWeight'),
        'font-variant': $element.css('font-variant'),
        'text-indent': $element.css('text-indent'),
        'text-transform': $element.css('text-transform'),
        'letter-spacing': $element.css('letter-spacing'),
        'word-spacing': $element.css('word-spacing'),
        'display': 'none'
      };
      $truncateWorker = $('<span/>')
        .css(fontCSS)
        .appendTo('body');
    }

    return this.each(function() {
      $element = $(this);
      elementText = $element.text();
      if (!options.assumeSameStyle) {
        fontCSS = {
          'fontFamily': $element.css('fontFamily'),
          'fontSize': $element.css('fontSize'),
          'fontStyle': $element.css('fontStyle'),
          'fontWeight': $element.css('fontWeight'),
          'font-variant': $element.css('font-variant'),
          'text-indent': $element.css('text-indent'),
          'text-transform': $element.css('text-transform'),
          'letter-spacing': $element.css('letter-spacing'),
          'word-spacing': $element.css('word-spacing'),
          'display': 'none'
        };
        $truncateWorker = $('<span/>')
          .css(fontCSS)
          .text(elementText)
          .appendTo('body');
      } else {
        $truncateWorker.text(elementText);
      }

      var originalWidth = $truncateWorker.width();
      var truncateWidth = parseInt(options.width, 10) || $element.width();
      var dimension = 'width';
      var truncatedText, originalDim, truncateDim;

      if (options.multiline) {
        $truncateWorker.width($element.width());
        dimension = 'height';
        originalDim = $truncateWorker.height();
        truncateDim = $element.height() + 1;
      } else {
        originalDim = originalWidth;
        truncateDim = truncateWidth;
      }

      truncatedText = {
        before: '',
        after: ''
      };
      if (originalDim > truncateDim) {
        var truncPoint, truncPoint2;
        $truncateWorker.text('');

        if (options.side === 'left') {
          truncPoint = findTruncPoint(
            dimension, truncateDim, elementText, 0, elementText.length,
            $truncateWorker, options.token, true
          );
          truncatedText.after = elementText.slice(-1 * truncPoint);

        } else if (options.side === 'center') {
          truncateDim = parseInt(truncateDim / 2, 10) - 1;
          truncPoint = findTruncPoint(
            dimension, truncateDim, elementText, 0, elementText.length,
            $truncateWorker, options.token, false
          );
          truncPoint2 = findTruncPoint(
            dimension, truncateDim, elementText, 0, elementText.length,
            $truncateWorker, '', true
          );
          truncatedText.before = elementText.slice(0, truncPoint);
          truncatedText.after = elementText.slice(-1 * truncPoint2);

        } else if (options.side === 'right') {
          truncPoint = findTruncPoint(
            dimension, truncateDim, elementText, 0, elementText.length,
            $truncateWorker, options.token, false
          );
          truncatedText.before = elementText.slice(0, truncPoint);
        }

        if (options.addclass) {
          $element.addClass(options.addclass);
        }

        if (options.addtitle) {
          $element.attr('title', elementText);
        }

        truncatedText.before = $truncateWorker
          .text(truncatedText
            .before).html();
        truncatedText.after = $truncateWorker
          .text(truncatedText.after)
          .html();
        $element.empty().html(
          truncatedText.before + options.token + truncatedText.after
        );

      }

      if (!options.assumeSameStyle) {
        $truncateWorker.remove();
      }
    });

    if (options.assumeSameStyle) {
      $truncateWorker.remove();
    }
  };
})(jQuery);

/*
 *    jQuery dotdotdot 1.6.16
 *
 *    Copyright (c) Fred Heusschen
 *    www.frebsite.nl
 *
 *    Plugin website:
 *    dotdotdot.frebsite.nl
 *
 *    Dual licensed under the MIT and GPL licenses.
 *    http://en.wikipedia.org/wiki/MIT_License
 *    http://en.wikipedia.org/wiki/GNU_General_Public_License
 */

(function($, undef) {
  if ($.fn.dotdotdot) {
    return;
  }

  $.fn.dotdotdot = function(o) {
    if (this.length == 0) {
      $.fn.dotdotdot.debug('No element found for "' + this.selector + '".');
      return this;
    }
    if (this.length > 1) {
      return this.each(
        function() {
          $(this).dotdotdot(o);
        }
      );
    }


    var $dot = this;

    if ($dot.data('dotdotdot')) {
      $dot.trigger('destroy.dot');
    }

    $dot.data('dotdotdot-style', $dot.attr('style') || '');
    $dot.css('word-wrap', 'break-word');
    if ($dot.css('white-space') === 'nowrap') {
      $dot.css('white-space', 'normal');
    }

    $dot.bind_events = function() {
      $dot.bind(
        'update.dot',
        function(e, c) {
          e.preventDefault();
          e.stopPropagation();

          opts.maxHeight = (typeof opts.height == 'number') ? opts.height : getTrueInnerHeight($dot);

          opts.maxHeight += opts.tolerance;

          if (typeof c != 'undefined') {
            if (typeof c == 'string' || c instanceof HTMLElement) {
              c = $('<div />').append(c).contents();
            }
            if (c instanceof $) {
              orgContent = c;
            }
          }

          $inr = $dot.wrapInner('<div class="dotdotdot" />').children();
          $inr.contents()
            .detach()
            .end()
            .append(orgContent.clone(true))
            .find('br')
            .replaceWith('  <br />  ')
            .end()
            .css({
              'height': 'auto',
              'width': 'auto',
              'border': 'none',
              'padding': 0,
              'margin': 0
            });

          var after = false,
            trunc = false;

          if (conf.afterElement) {
            after = conf.afterElement.clone(true);
            after.show();
            conf.afterElement.detach();
          }

          if (test($inr, opts)) {
            if (opts.wrap == 'children') {
              trunc = children($inr, opts, after);
            } else {
              trunc = ellipsis($inr, $dot, $inr, opts, after);
            }
          }
          $inr.replaceWith($inr.contents());
          $inr = null;

          if ($.isFunction(opts.callback)) {
            opts.callback.call($dot[0], trunc, orgContent);
          }

          conf.isTruncated = trunc;
          return trunc;
        }

      ).bind(
        'isTruncated.dot',
        function(e, fn) {
          e.preventDefault();
          e.stopPropagation();

          if (typeof fn == 'function') {
            fn.call($dot[0], conf.isTruncated);
          }
          return conf.isTruncated;
        }

      ).bind(
        'originalContent.dot',
        function(e, fn) {
          e.preventDefault();
          e.stopPropagation();

          if (typeof fn == 'function') {
            fn.call($dot[0], orgContent);
          }
          return orgContent;
        }

      ).bind(
        'destroy.dot',
        function(e) {
          e.preventDefault();
          e.stopPropagation();

          $dot.unwatch()
            .unbind_events()
            .contents()
            .detach()
            .end()
            .append(orgContent)
            .attr('style', $dot.data('dotdotdot-style') || '')
            .data('dotdotdot', false);
        }
      );
      return $dot;
    }; // /bind_events

    $dot.unbind_events = function() {
      $dot.unbind('.dot');
      return $dot;
    }; // /unbind_events

    $dot.watch = function() {
      $dot.unwatch();
      if (opts.watch == 'window') {
        var $window = $(window),
          _wWidth = $window.width(),
          _wHeight = $window.height();

        $window.bind(
          'resize.dot' + conf.dotId,
          function() {
            if (_wWidth != $window.width() || _wHeight != $window.height() || !opts.windowResizeFix) {
              _wWidth = $window.width();
              _wHeight = $window.height();

              if (watchInt) {
                clearInterval(watchInt);
              }
              watchInt = setTimeout(
                function() {
                  $dot.trigger('update.dot');
                }, 100
              );
            }
          }
        );
      } else {
        watchOrg = getSizes($dot);
        watchInt = setInterval(
          function() {
            if ($dot.is(':visible')) {
              var watchNew = getSizes($dot);
              if (watchOrg.width != watchNew.width ||
                watchOrg.height != watchNew.height) {
                $dot.trigger('update.dot');
                watchOrg = watchNew;
              }
            }
          }, 500
        );
      }
      return $dot;
    };
    $dot.unwatch = function() {
      $(window).unbind('resize.dot' + conf.dotId);
      if (watchInt) {
        clearInterval(watchInt);
      }
      return $dot;
    };

    var orgContent = $dot.contents(),
      opts = $.extend(true, {}, $.fn.dotdotdot.defaults, o),
      conf = {},
      watchOrg = {},
      watchInt = null,
      $inr = null;


    if (!(opts.lastCharacter.remove instanceof Array)) {
      opts.lastCharacter.remove = $.fn.dotdotdot.defaultArrays.lastCharacter.remove;
    }
    if (!(opts.lastCharacter.noEllipsis instanceof Array)) {
      opts.lastCharacter.noEllipsis = $.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis;
    }


    conf.afterElement = getElement(opts.after, $dot);
    conf.isTruncated = false;
    conf.dotId = dotId++;


    $dot.data('dotdotdot', true)
      .bind_events()
      .trigger('update.dot');

    if (opts.watch) {
      $dot.watch();
    }

    return $dot;
  };


  //  public
  $.fn.dotdotdot.defaults = {
    'ellipsis': '... ',
    'wrap': 'word',
    'fallbackToLetter': true,
    'lastCharacter': {},
    'tolerance': 0,
    'callback': null,
    'after': null,
    'height': null,
    'watch': false,
    'windowResizeFix': true
  };
  $.fn.dotdotdot.defaultArrays = {
    'lastCharacter': {
      'remove': [' ', '\u3000', ',', ';', '.', '!', '?'],
      'noEllipsis': []
    }
  };
  $.fn.dotdotdot.debug = function(msg) {};


  //  private
  var dotId = 1;

  function children($elem, o, after) {
    var $elements = $elem.children(),
      isTruncated = false;

    $elem.empty();

    for (var a = 0, l = $elements.length; a < l; a++) {
      var $e = $elements.eq(a);
      $elem.append($e);
      if (after) {
        $elem.append(after);
      }
      if (test($elem, o)) {
        $e.remove();
        isTruncated = true;
        break;
      } else {
        if (after) {
          after.detach();
        }
      }
    }
    return isTruncated;
  }

  function ellipsis($elem, $d, $i, o, after) {
    var isTruncated = false;

    //    Don't put the ellipsis directly inside these elements
    var notx = 'table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style';

    //    Don't remove these elements even if they are after the ellipsis
    var noty = 'script, .dotdotdot-keep';

    $elem
      .contents()
      .detach()
      .each(
        function() {

          var e = this,
            $e = $(e);

          if (typeof e == 'undefined' || (e.nodeType == 3 && $.trim(e.data).length == 0)) {
            return true;
          } else if ($e.is(noty)) {
            $elem.append($e);
          } else if (isTruncated) {
            return true;
          } else {
            $elem.append($e);
            if (after) {
              $elem[$elem.is(notx) ? 'after' : 'append'](after);
            }
            if (test($i, o)) {
              if (e.nodeType == 3) // node is TEXT
              {
                isTruncated = ellipsisElement($e, $d, $i, o, after);
              } else {
                isTruncated = ellipsis($e, $d, $i, o, after);
              }

              if (!isTruncated) {
                $e.detach();
                isTruncated = true;
              }
            }

            if (!isTruncated) {
              if (after) {
                after.detach();
              }
            }
          }
        }
    );

    return isTruncated;
  }

  function ellipsisElement($e, $d, $i, o, after) {
    var e = $e[0];

    if (!e) {
      return false;
    }

    var txt = getTextContent(e),
      space = (txt.indexOf(' ') !== -1) ? ' ' : '\u3000',
      separator = (o.wrap == 'letter') ? '' : space,
      textArr = txt.split(separator),
      position = -1,
      midPos = -1,
      startPos = 0,
      endPos = textArr.length - 1;


    //    Only one word
    if (o.fallbackToLetter && startPos == 0 && endPos == 0) {
      separator = '';
      textArr = txt.split(separator);
      endPos = textArr.length - 1;
    }

    while (startPos <= endPos && !(startPos == 0 && endPos == 0)) {
      var m = Math.floor((startPos + endPos) / 2);
      if (m == midPos) {
        break;
      }
      midPos = m;

      setTextContent(e, textArr.slice(0, midPos + 1).join(separator) + o.ellipsis);

      if (!test($i, o)) {
        position = midPos;
        startPos = midPos;
      } else {
        endPos = midPos;

        //    Fallback to letter
        if (o.fallbackToLetter && startPos == 0 && endPos == 0) {
          separator = '';
          textArr = textArr[0].split(separator);
          position = -1;
          midPos = -1;
          startPos = 0;
          endPos = textArr.length - 1;
        }
      }
    }

    if (position != -1 && !(textArr.length == 1 && textArr[0].length == 0)) {
      txt = addEllipsis(textArr.slice(0, position + 1).join(separator), o);
      setTextContent(e, txt);
    } else {
      var $w = $e.parent();
      $e.detach();

      var afterLength = (after && after.closest($w).length) ? after.length : 0;

      if ($w.contents().length > afterLength) {
        e = findLastTextNode($w.contents().eq(-1 - afterLength), $d);
      } else {
        e = findLastTextNode($w, $d, true);
        if (!afterLength) {
          $w.detach();
        }
      }
      if (e) {
        txt = addEllipsis(getTextContent(e), o);
        setTextContent(e, txt);
        if (afterLength && after) {
          $(e).parent().append(after);
        }
      }
    }

    return true;
  }

  function test($i, o) {
    return $i.innerHeight() > o.maxHeight;
  }

  function addEllipsis(txt, o) {
    while ($.inArray(txt.slice(-1), o.lastCharacter.remove) > -1) {
      txt = txt.slice(0, -1);
    }
    if ($.inArray(txt.slice(-1), o.lastCharacter.noEllipsis) < 0) {
      txt += o.ellipsis;
    }
    return txt;
  }

  function getSizes($d) {
    return {
      'width': $d.innerWidth(),
      'height': $d.innerHeight()
    };
  }

  function setTextContent(e, content) {
    if (e.innerText) {
      e.innerText = content;
    } else if (e.nodeValue) {
      e.nodeValue = content;
    } else if (e.textContent) {
      e.textContent = content;
    }

  }

  function getTextContent(e) {
    if (e.innerText) {
      return e.innerText;
    } else if (e.nodeValue) {
      return e.nodeValue;
    } else if (e.textContent) {
      return e.textContent;
    } else {
      return "";
    }
  }

  function getPrevNode(n) {
    do {
      n = n.previousSibling;
    }
    while (n && n.nodeType !== 1 && n.nodeType !== 3);

    return n;
  }

  function findLastTextNode($el, $top, excludeCurrent) {
    var e = $el && $el[0],
      p;
    if (e) {
      if (!excludeCurrent) {
        if (e.nodeType === 3) {
          return e;
        }
        if ($.trim($el.text())) {
          return findLastTextNode($el.contents().last(), $top);
        }
      }
      p = getPrevNode(e);
      while (!p) {
        $el = $el.parent();
        if ($el.is($top) || !$el.length) {
          return false;
        }
        p = getPrevNode($el[0]);
      }
      if (p) {
        return findLastTextNode($(p), $top);
      }
    }
    return false;
  }

  function getElement(e, $i) {
    if (!e) {
      return false;
    }
    if (typeof e === 'string') {
      e = $(e, $i);
      return (e.length) ? e : false;
    }
    return !e.jquery ? false : e;
  }

  function getTrueInnerHeight($el) {
    var h = $el.innerHeight(),
      a = ['paddingTop', 'paddingBottom'];

    for (var z = 0, l = a.length; z < l; z++) {
      var m = parseInt($el.css(a[z]), 10);
      if (isNaN(m)) {
        m = 0;
      }
      h -= m;
    }
    return h;
  }


  //  override jQuery.html
  var _orgHtml = $.fn.html;
  $.fn.html = function(str) {
    if (str != undef && !$.isFunction(str) && this.data('dotdotdot')) {
      return this.trigger('update', [str]);
    }
    return _orgHtml.apply(this, arguments);
  };


  //  override jQuery.text
  var _orgText = $.fn.text;
  $.fn.text = function(str) {
    if (str != undef && !$.isFunction(str) && this.data('dotdotdot')) {
      str = $('<div />').text(str).html();
      return this.trigger('update', [str]);
    }
    return _orgText.apply(this, arguments);
  };


})(jQuery);

(function(module, undefined) {

  /*
   *
   */

  function getStyle(element, property) {
    // IE8 and below does not support getComputedStyle. Use currentStyle instead.
    var styles = (window.getComputedStyle && window.getComputedStyle(element) || element.currentStyle);
    return parseFloat(styles[property]);
  }

  /*
   *
   */

  function height(element) {
    var total = getStyle(element, 'height');
    var boxModel = getStyle(element, 'boxSizing');
    if (boxModel === 'border-box') {
      return total - getStyle(element, 'paddingTop') - getStyle(element, 'paddingBottom');
    } else {
      // Assume content-box model
      return total;
    }
  }

  /* Trims leading and trailing whitespace. Regular expression taken from jQuery.
   * See https://github.com/jquery/jquery/blob/master/speed/jquery-basis.js
   *
   * str - The original string to trim.
   *
   * Returns trimmed string.
   */

  function trim(str) {
    return (str || '').replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
  }

  /*
   *
   */

  function getHTMLInRange(node, startIndex, endIndex) {
    var index, childNode;
    var childNodes = node.childNodes,
      length = childNodes.length,
      html = '';

    for (index = startIndex; index <= endIndex && index < length; index++) {
      childNode = childNodes[index];
      if (childNode.nodeType === childNode.COMMENT_NODE) {
        // Need the commend node HTML in order to reconstruct original DOM structure
        // This manual way is the only way to get a comment node's HTML
        html += '<!--' + childNode.nodeValue + '-->';
      } else {
        html += childNode.outerHTML || childNode.nodeValue;
      }
    }
    return html;
  }

  /* Truncates a text node using binary search.
   *
   * textNode - The text node to truncate.
   * rootNode - The root node (ancestor of the textNode) to measure the truncated height.
   * options  - An object containing:
   *            showMore  - The HTML string to append at the end of the string.
   *            maxHeight - The maximum height for the root node.
   *
   * Returns nothing.
   */

  function truncateTextNode(textNode, rootNode, options) {
    var originalHTML = textNode.nodeValue,
      mid,
      low = 0,
      high = originalHTML.length,
      chunk,
      maxChunk = '';

    // Binary Search
    while (low <= high) {
      mid = low + ((high - low) >> 1); // Integer division

      chunk = trim(originalHTML.substr(0, mid + 1)) + options.showMore;
      textNode.nodeValue = chunk;

      if (height(rootNode) > options.maxHeight) {
        high = mid - 1;
      } else {
        low = mid + 1;
        maxChunk = maxChunk.length > chunk.length ? maxChunk : chunk;
      }
    }

    textNode.nodeValue = maxChunk;
  }

  function truncateNestedNode(element, rootNode, options) {

    var childNodes = element.childNodes,
      length = childNodes.length;

    if (length === 0) {

      // Base case: single element remaining

      if (element.nodeType === element.TEXT_NODE) {
        // Truncate the text node
        truncateTextNode(element, rootNode, options);
      } else {
        // Remove the node itself
        element.parentNode.removeChild(element);
      }

      return;

    } else {

      // Recursive case: iterate backwards on children nodes until tipping node is found

      var index, node, chunk;
      var originalHTML = element.innerHTML;

      for (index = length - 1; index >= 0; index--) {
        node = childNodes[index];

        chunk = getHTMLInRange(element, 0, index);
        element.innerHTML = chunk;

        if (height(rootNode) <= options.maxHeight) {

          // Check if element is not the last child
          if (index + 1 <= length - 1) {
            // Reset HTML so original childNodes tree is available
            element.innerHTML = originalHTML;

            chunk += getHTMLInRange(element, index + 1, index + 1);
            element.innerHTML = chunk;

            index += 1;
          }

          return truncateNestedNode(childNodes[index], rootNode, options);
        }
      }

      return truncateNestedNode(childNodes[0], rootNode, options);

    }
  }

  /* Public: Creates an instance of Truncate.
   *
   * element - A DOM element to be truncated.
   * options - An Object literal containing setup options.
   *
   * Examples:
   *
   *   var element = document.createElement('span');
   *   element.innerHTML = 'This is<br>odd.';
   *   var truncated = new Truncate(element, {
   *     lines: 1,
   *     lineHeight: 16,
   *     showMore: '<a class="show-more">Show More</a>',
   *     showLess: '<a class="show-more">Show Less</a>'
   *   });
   *
   *   // Update HTML
   *   truncated.update('This is not very odd.');
   *
   *   // Undo truncation
   *   truncated.expand();
   *
   *   // Redo truncation
   *   truncated.collapse();
   */

  function Truncate(element, options) {
    this.options = options || {};
    options.showMore = typeof options.showMore !== 'undefined' ? options.showMore : 'â€¦';
    options.showLess = typeof options.showLess !== 'undefined' ? options.showLess : '';

    this.options.maxHeight = options.lines * options.lineHeight;

    this.element = element;
    this.originalHTML = element.innerHTML;
    this.cachedHTML = null;

    this.update();
  }

  /* Public: Updates the inner HTML of the element and re-truncates.
   *
   * newHTML - The new HTML.
   *
   * Returns nothing.
   */
  Truncate.prototype.update = function(newHTML) {
    // Update HTML if provided, otherwise default to current inner HTML.
    if (newHTML) {
      this.originalHTML = this.element.innerHTML = newHTML;
    }

    // Already meets height requirement
    if (height(this.element) <= this.options.maxHeight) {
      return;
    }

    var visibility = this.element.style.visibility;
    this.element.style.visibility = 'hidden';

    truncateNestedNode(this.element, this.element, this.options);
    this.cachedHTML = this.element.innerHTML;

    this.element.style.visibility = visibility;
  };

  /* Public: Expands the element to show content in full.
   *
   * Returns nothing.
   */
  Truncate.prototype.expand = function() {
    this.element.innerHTML = this.originalHTML + this.options.showLess;
  };

  /* Public: Collapses the element to the truncated state.
   * Uses the cached HTML from .update().
   *
   * Returns nothing.
   */
  Truncate.prototype.collapse = function() {
    this.element.innerHTML = this.cachedHTML;
  };

  module.Truncate = Truncate;

})(window);

/*!

    Copyright (c) 2011 Peter van der Spek

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    
 */


(function($) {

  /**
   * Hash containing mapping of selectors to settings hashes for target selectors that should be live updated.
   *
   * @type {Object.<string, Object>}
   * @private
   */
  var liveUpdatingTargetSelectors = {};

  /**
   * Interval ID for live updater. Contains interval ID when the live updater interval is active, or is undefined
   * otherwise.
   *
   * @type {number}
   * @private
   */
  var liveUpdaterIntervalId;

  /**
   * Boolean indicating whether the live updater is running.
   *
   * @type {boolean}
   * @private
   */
  var liveUpdaterRunning = false;

  /**
   * Set of default settings.
   *
   * @type {Object.<string, string>}
   * @private
   */
  var defaultSettings = {
    ellipsis: '...',
    setTitle: 'never',
    live: false
  };

  /**
   * Perform ellipsis on selected elements.
   *
   * @param {string} selector the inner selector of elements that ellipsis may work on. Inner elements not referred to by this
   *      selector are left untouched.
   * @param {Object.<string, string>=} options optional options to override default settings.
   * @return {jQuery} the current jQuery object for chaining purposes.
   * @this {jQuery} the current jQuery object.
   */
  $.fn.ellipsis = function(selector, options) {
    var subjectElements, settings;

    subjectElements = $(this);

    // Check for options argument only.
    if (typeof selector !== 'string') {
      options = selector;
      selector = undefined;
    }

    // Create the settings from the given options and the default settings.
    settings = $.extend({}, defaultSettings, options);

    // If selector is not set, work on immediate children (default behaviour).
    settings.selector = selector;

    // Do ellipsis on each subject element.
    subjectElements.each(function() {
      var elem = $(this);

      // Do ellipsis on subject element.
      ellipsisOnElement(elem, settings);
    });

    // If live option is enabled, add subject elements to live updater. Otherwise remove from live updater.
    if (settings.live) {
      addToLiveUpdater(subjectElements.selector, settings);

    } else {
      removeFromLiveUpdater(subjectElements.selector);
    }

    // Return jQuery object for chaining.
    return this;
  };


  /**
   * Perform ellipsis on the given container.
   *
   * @param {jQuery} containerElement jQuery object containing one DOM element to perform ellipsis on.
   * @param {Object.<string, string>} settings the settings for this ellipsis operation.
   * @private
   */

  function ellipsisOnElement(containerElement, settings) {
    var containerData = containerElement.data('jqae');
    if (!containerData) containerData = {};

    // Check if wrapper div was already created and bound to the container element.
    var wrapperElement = containerData.wrapperElement;

    // If not, create wrapper element.
    if (!wrapperElement) {
      wrapperElement = containerElement.wrapInner('<div/>').find('>div');

      // Wrapper div should not add extra size.
      wrapperElement.css({
        margin: 0,
        padding: 0,
        border: 0
      });
    }

    // Check if the original wrapper element content was already bound to the wrapper element.
    var wrapperElementData = wrapperElement.data('jqae');
    if (!wrapperElementData) wrapperElementData = {};

    var wrapperOriginalContent = wrapperElementData.originalContent;

    // If so, clone the original content, re-bind the original wrapper content to the clone, and replace the
    // wrapper with the clone.
    if (wrapperOriginalContent) {
      wrapperElement = wrapperElementData.originalContent.clone(true)
        .data('jqae', {
          originalContent: wrapperOriginalContent
        }).replaceAll(wrapperElement);

    } else {
      // Otherwise, clone the current wrapper element and bind it as original content to the wrapper element.

      wrapperElement.data('jqae', {
        originalContent: wrapperElement.clone(true)
      });
    }

    // Bind the wrapper element and current container width and height to the container element. Current container
    // width and height are stored to detect changes to the container size.
    containerElement.data('jqae', {
      wrapperElement: wrapperElement,
      containerWidth: containerElement.width(),
      containerHeight: containerElement.height()
    });

    // Calculate with current container element height.
    var containerElementHeight = containerElement.height();

    // Calculate wrapper offset.
    var wrapperOffset = (parseInt(containerElement.css('padding-top'), 10) || 0) + (parseInt(containerElement.css('border-top-width'), 10) || 0) - (wrapperElement.offset().top - containerElement.offset().top);

    // Normally the ellipsis characters are applied to the last non-empty text-node in the selected element. If the
    // selected element becomes empty during ellipsis iteration, the ellipsis characters cannot be applied to that
    // selected element, and must be deferred to the previous selected element. This parameter keeps track of that.
    var deferAppendEllipsis = false;

    // Loop through all selected elements in reverse order.
    var selectedElements = wrapperElement;
    if (settings.selector) selectedElements = $(wrapperElement.find(settings.selector).get().reverse());

    selectedElements.each(function() {
      var selectedElement = $(this),
        originalText = selectedElement.text(),
        ellipsisApplied = false;

      // Check if we can safely remove the selected element. This saves a lot of unnecessary iterations.
      if (wrapperElement.innerHeight() - selectedElement.innerHeight() > containerElementHeight + wrapperOffset) {
        selectedElement.remove();

      } else {
        // Reverse recursively remove empty elements, until the element that contains a non-empty text-node.
        removeLastEmptyElements(selectedElement);

        // If the selected element has not become empty, start ellipsis iterations on the selected element.
        if (selectedElement.contents().length) {

          // If a deffered ellipsis is still pending, apply it now to the last text-node.
          if (deferAppendEllipsis) {
            getLastTextNode(selectedElement).get(0).nodeValue += settings.ellipsis;
            deferAppendEllipsis = false;
          }

          // Iterate until wrapper element height is less than or equal to the original container element
          // height plus possible wrapperOffset.
          while (wrapperElement.innerHeight() > containerElementHeight + wrapperOffset) {
            // Apply ellipsis on last text node, by removing one word.
            ellipsisApplied = ellipsisOnLastTextNode(selectedElement);

            // If ellipsis was succesfully applied, remove any remaining empty last elements and append the
            // ellipsis characters.
            if (ellipsisApplied) {
              removeLastEmptyElements(selectedElement);

              // If the selected element is not empty, append the ellipsis characters.
              if (selectedElement.contents().length) {
                getLastTextNode(selectedElement).get(0).nodeValue += settings.ellipsis;

              } else {
                // If the selected element has become empty, defer the appending of the ellipsis characters
                // to the previous selected element.
                deferAppendEllipsis = true;
                selectedElement.remove();
                break;
              }

            } else {
              // If ellipsis could not be applied, defer the appending of the ellipsis characters to the
              // previous selected element.
              deferAppendEllipsis = true;
              selectedElement.remove();
              break;
            }
          }

          // If the "setTitle" property is set to "onEllipsis" and the ellipsis has been applied, or if the
          // property is set to "always", the add the "title" attribute with the original text. Else remove the
          // "title" attribute. When the "setTitle" property is set to "never" we do not touch the "title"
          // attribute.
          if (((settings.setTitle == 'onEllipsis') && ellipsisApplied) || (settings.setTitle == 'always')) {
            selectedElement.attr('title', originalText);

          } else if (settings.setTitle != 'never') {
            selectedElement.removeAttr('title');
          }
        }
      }
    });
  }

  /**
   * Performs ellipsis on the last text node of the given element. Ellipsis is done by removing a full word.
   *
   * @param {jQuery} element jQuery object containing a single DOM element.
   * @return {boolean} true when ellipsis has been done, false otherwise.
   * @private
   */

  function ellipsisOnLastTextNode(element) {
    var lastTextNode = getLastTextNode(element);

    // If the last text node is found, do ellipsis on that node.
    if (lastTextNode.length) {
      var text = lastTextNode.get(0).nodeValue;

      // Find last space character, and remove text from there. If no space is found the full remaining text is
      // removed.
      var pos = text.lastIndexOf(' ');
      if (pos > -1) {
        text = $.trim(text.substring(0, pos));
        lastTextNode.get(0).nodeValue = text;

      } else {
        lastTextNode.get(0).nodeValue = '';
      }

      return true;
    }

    return false;
  }

  /**
   * Get last text node of the given element.
   *
   * @param {jQuery} element jQuery object containing a single element.
   * @return {jQuery} jQuery object containing a single text node.
   * @private
   */

  function getLastTextNode(element) {
    if (element.contents().length) {

      // Get last child node.
      var contents = element.contents();
      var lastNode = contents.eq(contents.length - 1);

      // If last node is a text node, return it.
      if (lastNode.filter(textNodeFilter).length) {
        return lastNode;

      } else {
        // Else it is an element node, and we recurse into it.

        return getLastTextNode(lastNode);
      }

    } else {
      // If there is no last child node, we append an empty text node and return that. Normally this should not
      // happen, as we test for emptiness before calling getLastTextNode.

      element.append('');
      var contents = element.contents();
      return contents.eq(contents.length - 1);
    }
  }

  /**
   * Remove last empty elements. This is done recursively until the last element contains a non-empty text node.
   *
   * @param {jQuery} element jQuery object containing a single element.
   * @return {boolean} true when elements have been removed, false otherwise.
   * @private
   */

  function removeLastEmptyElements(element) {
    if (element.contents().length) {

      // Get last child node.
      var contents = element.contents();
      var lastNode = contents.eq(contents.length - 1);

      // If last child node is a text node, check for emptiness.
      if (lastNode.filter(textNodeFilter).length) {
        var text = lastNode.get(0).nodeValue;
        text = $.trim(text);

        if (text == '') {
          // If empty, remove the text node.
          lastNode.remove();

          return true;

        } else {
          return false;
        }

      } else {
        // If the last child node is an element node, remove the last empty child nodes on that node.
        while (removeLastEmptyElements(lastNode)) {}

        // If the last child node contains no more child nodes, remove the last child node.
        if (lastNode.contents().length) {
          return false;

        } else {
          lastNode.remove();

          return true;
        }
      }
    }

    return false;
  }

  /**
   * Filter for testing on text nodes.
   *
   * @return {boolean} true when this node is a text node, false otherwise.
   * @this {Node}
   * @private
   */

  function textNodeFilter() {
    return this.nodeType === 3;
  }

  /**
   * Add target selector to hash of target selectors. If this is the first target selector added, start the live
   * updater.
   *
   * @param {string} targetSelector the target selector to run the live updater for.
   * @param {Object.<string, string>} settings the settings to apply on this target selector.
   * @private
   */

  function addToLiveUpdater(targetSelector, settings) {
    // Store target selector with its settings.
    liveUpdatingTargetSelectors[targetSelector] = settings;

    // If the live updater has not yet been started, start it now.
    if (!liveUpdaterIntervalId) {
      liveUpdaterIntervalId = window.setInterval(function() {
        doLiveUpdater();
      }, 200);
    }
  }

  /**
   * Remove the target selector from the hash of target selectors. It this is the last remaining target selector
   * being removed, stop the live updater.
   *
   * @param {string} targetSelector the target selector to stop running the live updater for.
   * @private
   */

  function removeFromLiveUpdater(targetSelector) {
    // If the hash contains the target selector, remove it.
    if (liveUpdatingTargetSelectors[targetSelector]) {
      delete liveUpdatingTargetSelectors[targetSelector];

      // If no more target selectors are in the hash, stop the live updater.
      if (!liveUpdatingTargetSelectors.length) {
        if (liveUpdaterIntervalId) {
          window.clearInterval(liveUpdaterIntervalId);
          liveUpdaterIntervalId = undefined;
        }
      }
    }
  };

  /**
   * Run the live updater. The live updater is periodically run to check if its monitored target selectors require
   * re-applying of the ellipsis.
   *
   * @private
   */

  function doLiveUpdater() {
    // If the live updater is already running, skip this time. We only want one instance running at a time.
    if (!liveUpdaterRunning) {
      liveUpdaterRunning = true;

      // Loop through target selectors.
      for (var targetSelector in liveUpdatingTargetSelectors) {
        $(targetSelector).each(function() {
          var containerElement, containerData;

          containerElement = $(this);
          containerData = containerElement.data('jqae');

          // If container element dimensions have changed, or the container element is new, run ellipsis on
          // that container element.
          if ((containerData.containerWidth != containerElement.width()) ||
            (containerData.containerHeight != containerElement.height())) {
            ellipsisOnElement(containerElement, liveUpdatingTargetSelectors[targetSelector]);
          }
        });
      }

      liveUpdaterRunning = false;
    }
  };

})(jQuery);

/**!
 * trunk8 v1.3.1
 * https://github.com/rviscomi/trunk8
 *
 * Copyright 2012 Rick Viscomi
 * Released under the MIT License.
 *
 * Date: September 26, 2012
 */

(function($) {
  var methods,
    utils,
    SIDES = {
      /* cen...ter */
      center: 'center',
      /* ...left */
      left: 'left',
      /* right... */
      right: 'right'
    },
    WIDTH = {
      auto: 'auto'
    };

  function trunk8(element) {
    this.$element = $(element);
    this.original_text = this.$element.html();
    this.settings = $.extend({}, $.fn.trunk8.defaults);
  }

  trunk8.prototype.updateSettings = function(options) {
    this.settings = $.extend(this.settings, options);
  };

  function stripHTML(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;

    if (typeof tmp.textContent != 'undefined') {
      return tmp.textContent;
    }

    return tmp.innerText
  }

  function getHtmlArr(str) {
    /* Builds an array of strings and designated */
    /* HTML tags around them. */
    if (stripHTML(str) === str) {
      return str.split(/\s/g);
    }
    var allResults = [],
      reg = /<([a-z]+)([^<]*)(?:>(.*?(?!<\1>)*)<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/ig,
      outArr = reg.exec(str),
      lastI,
      ind;
    while (outArr && lastI !== reg.lastIndex) {
      lastI = reg.lastIndex;
      if (outArr[5]) {
        allResults.push(outArr[5]);
      } else if (outArr[1]) {
        allResults.push({
          tag: outArr[1],
          attribs: outArr[2],
          content: outArr[3],
          after: outArr[4]
        });
      }
      outArr = reg.exec(str);
    }
    for (ind = 0; ind < allResults.length; ind++) {
      if (typeof allResults[ind] !== 'string' &&
        allResults[ind].content) {
        allResults[ind].content = getHtmlArr(allResults[ind].content);
      }
    }
    return allResults;
  }

  function rebuildHtmlFromBite(bite, htmlObject, fill) {
    // Take the processed bite after binary-search
    // truncated and re-build the original HTML
    // tags around the processed string.
    bite = bite.replace(fill, '');

    var biteHelper = function(contentArr, tagInfo) {
      var retStr = '',
        content,
        biteContent,
        biteLength,
        nextWord,
        i;
      for (i = 0; i < contentArr.length; i++) {
        content = contentArr[i];
        biteLength = $.trim(bite).split(' ').length;
        if ($.trim(bite).length) {
          if (typeof content === 'string') {
            if (!/<br\s*\/?>/.test(content)) {
              if (biteLength === 1 && $.trim(bite).length <= content.length) {
                content = bite;
                // We want the fill to go inside of the last HTML
                // element if the element is a container.
                if (tagInfo === 'p' || tagInfo === 'div') {
                  content += fill;
                }
                bite = '';
              } else {
                bite = bite.replace(content, '');
              }
            }
            retStr += $.trim(content) + ((i === contentArr.length - 1 || biteLength <= 1) ? '' : ' ');
          } else {
            biteContent = biteHelper(content.content, content.tag);
            if (content.after) bite = bite.replace(content.after, '');
            if (biteContent) {
              if (!content.after) content.after = ' ';
              retStr += '<' + content.tag + content.attribs + '>' + biteContent + '</' + content.tag + '>' + content.after;
            }
          }
        }
      }
      return retStr;
    },
      htmlResults = biteHelper(htmlObject);

    // Add fill if doesn't exist. This will place it outside the HTML elements.
    if (htmlResults.slice(htmlResults.length - fill.length) === fill) {
      htmlResults += fill;
    }

    return htmlResults;
  }

  function truncate() {
    var data = this.data('trunk8'),
      settings = data.settings,
      width = settings.width,
      side = settings.side,
      fill = settings.fill,
      parseHTML = settings.parseHTML,
      line_height = utils.getLineHeight(this) * settings.lines,
      str = data.original_text,
      length = str.length,
      max_bite = '',
      lower, upper,
      bite_size,
      bite,
      text,
      htmlObject;

    /* Reset the field to the original string. */
    this.html(str);
    text = this.text();

    /* If string has HTML and parse HTML is set, build */
    /* the data struct to house the tags */
    if (parseHTML && stripHTML(str) !== str) {
      htmlObject = getHtmlArr(str);
      str = stripHTML(str);
      length = str.length;
    }

    if (width === WIDTH.auto) {
      /* Assuming there is no "overflow: hidden". */
      if (this.height() <= line_height) {
        /* Text is already at the optimal trunkage. */
        return;
      }

      /* Binary search technique for finding the optimal trunkage. */
      /* Find the maximum bite without overflowing. */
      lower = 0;
      upper = length - 1;

      while (lower <= upper) {
        bite_size = lower + ((upper - lower) >> 1);

        bite = utils.eatStr(str, side, length - bite_size, fill);

        if (parseHTML && htmlObject) {
          bite = rebuildHtmlFromBite(bite, htmlObject, fill);
        }

        this.html(bite);

        /* Check for overflow. */
        if (this.height() > line_height) {
          upper = bite_size - 1;
        } else {
          lower = bite_size + 1;

          /* Save the bigger bite. */
          max_bite = (max_bite.length > bite.length) ? max_bite : bite;
        }
      }

      /* Reset the content to eliminate possible existing scroll bars. */
      this.html('');

      /* Display the biggest bite. */
      this.html(max_bite);

      if (settings.tooltip) {
        this.attr('title', text);
      }
    } else if (!isNaN(width)) {
      bite_size = length - width;

      bite = utils.eatStr(str, side, bite_size, fill);

      this.html(bite);

      if (settings.tooltip) {
        this.attr('title', str);
      }
    } else {
      $.error('Invalid width "' + width + '".');
    }
  }

  methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('trunk8');

        if (!data) {
          $this.data('trunk8', (data = new trunk8(this)));
        }

        data.updateSettings(options);

        truncate.call($this);
      });
    },

    /** Updates the text value of the elements while maintaining truncation. */
    update: function(new_string) {
      return this.each(function() {
        var $this = $(this);

        /* Update text. */
        if (new_string) {
          $this.data('trunk8').original_text = new_string;
        }

        /* Truncate accordingly. */
        truncate.call($this);
      });
    },

    revert: function() {
      return this.each(function() {
        /* Get original text. */
        var text = $(this).data('trunk8').original_text;

        /* Revert element to original text. */
        $(this).html(text);
      });
    },

    /** Returns this instance's settings object. NOT CHAINABLE. */
    getSettings: function() {
      return $(this.get(0)).data('trunk8').settings;
    }
  };

  utils = {
    /** Replaces [bite_size] [side]-most chars in [str] with [fill]. */
    eatStr: function(str, side, bite_size, fill) {
      var length = str.length,
        key = utils.eatStr.generateKey.apply(null, arguments),
        half_length,
        half_bite_size;

      /* If the result is already in the cache, return it. */
      if (utils.eatStr.cache[key]) {
        return utils.eatStr.cache[key];
      }

      /* Common error handling. */
      if ((typeof str !== 'string') || (length === 0)) {
        $.error('Invalid source string "' + str + '".');
      }
      if ((bite_size < 0) || (bite_size > length)) {
        $.error('Invalid bite size "' + bite_size + '".');
      } else if (bite_size === 0) {
        /* No bite should show no truncation. */
        return str;
      }
      if (typeof(fill + '') !== 'string') {
        $.error('Fill unable to be converted to a string.');
      }

      /* Compute the result, store it in the cache, and return it. */
      switch (side) {
        case SIDES.right:
          /* str... */
          return utils.eatStr.cache[key] =
            $.trim(str.substr(0, length - bite_size)) + fill;

        case SIDES.left:
          /* ...str */
          return utils.eatStr.cache[key] =
            fill + $.trim(str.substr(bite_size));

        case SIDES.center:
          /* Bit-shift to the right by one === Math.floor(x / 2) */
          half_length = length >> 1; // halve the length
          half_bite_size = bite_size >> 1; // halve the bite_size

          /* st...r */
          return utils.eatStr.cache[key] =
            $.trim(utils.eatStr(str.substr(0, length - half_length), SIDES.right, bite_size - half_bite_size, '')) +
            fill +
            $.trim(utils.eatStr(str.substr(length - half_length), SIDES.left, half_bite_size, ''));

        default:
          $.error('Invalid side "' + side + '".');
      }
    },

    getLineHeight: function(elem) {
      var floats = $(elem).css('float');
      if (floats !== 'none') {
        $(elem).css('float', 'none');
      }
      var pos = $(elem).css('position');
      if (pos === 'absolute') {
        $(elem).css('position', 'static');
      }

      var html = $(elem).html(),
        wrapper_id = 'line-height-test',
        line_height;

      /* Set the content to a small single character and wrap. */
      $(elem).html('i').wrap('<div id="' + wrapper_id + '" />');

      /* Calculate the line height by measuring the wrapper.*/
      line_height = $('#' + wrapper_id).innerHeight();

      /* Remove the wrapper and reset the content. */
      $(elem).html(html).css({
        'float': floats,
        'position': pos
      }).unwrap();

      return line_height;
    }
  };

  utils.eatStr.cache = {};
  utils.eatStr.generateKey = function() {
    return Array.prototype.join.call(arguments, '');
  };

  $.fn.trunk8 = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.trunk8');
    }
  };

  /* Default trunk8 settings. */
  $.fn.trunk8.defaults = {
    fill: '&hellip;',
    lines: 1,
    side: SIDES.right,
    tooltip: true,
    width: WIDTH.auto,
    parseHTML: false
  };
})(jQuery);

/*  Truncate.js - v0.1.0
 *  Copyright 2013, Jeff Chan
 *  Released under the MIT license
 *  More Information: http://github.com/jeffchan/truncate.js
 */
(function(module, $, undefined) {

  var BLOCK_TAGS = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'col', 'colgroup', 'object', 'embed', 'param', 'ol', 'ul', 'dl', 'blockquote', 'select', 'optgroup', 'option', 'textarea', 'script', 'style'];

  function setText(element, text) {
    if (element.innerText) {
      element.innerText = text;
    } else if (element.nodeValue) {
      element.nodeValue = text;
    } else if (element.textContent) {
      element.textContent = text;
    } else {
      return false;
    }
  }

  /* Truncate the nearest sibling node.
   * If no valid immediate sibling is found, traverse one level up to a cousin node.
   *
   * $element  - The jQuery node to truncate.
   * $rootNode - The jQuery root node to measure the truncated height.
   * $clipNode - The jQuery node to insert right after the truncation point.
   * options   - An object containing:
   *             ellipsis  - The ellipsis string to append at the end of the truncation.
   *             maxHeight - The maximum height for the root node.
   *
   * Returns true if truncation happened, false otherwise.
   */

  function truncateNearestSibling($element, $rootNode, $clipNode, options) {
    var $parent = $element.parent();
    var $prevSibling;

    $element.remove();

    // Take into account length of $clipNode element previous inserted.
    var clipLength = $clipNode ? $clipNode.length : 0;

    if ($parent.contents().length > clipLength) {

      // Valid previous sibling element (sharing same parent node) exists,
      // so attempt to truncate it.
      $prevSibling = $parent.contents().eq(-1 - clipLength);
      return truncateTextContent($prevSibling, $rootNode, $clipNode, options);

    } else {

      // No previous sibling element (sharing same parent node) exists.
      // Therefore, search parent's sibling.

      var $parentSibling = $parent.prev();
      $prevSibling = $parentSibling.contents().eq(-1);

      if ($prevSibling.length) {

        // Because traversal is in-order so the algorithm already checked that
        // this point meets the height requirement. As such, it's safe to truncate here.
        setText($prevSibling[0], $prevSibling.text() + options.ellipsis);
        $parent.remove();

        if ($clipNode.length) {
          $parentSibling.append($clipNode);
        }
        return true;
      }
    }

    return false;
  }

  /* Truncates the text content of a node using binary search.
   * If no valid truncation point is found, attempt to truncate its nearest sibling.
   *
   * $textNode - The jQuery node to truncate.
   * $rootNode - The jQuery root node to measure the truncated height.
   * $clipNode - The jQuery node to insert right after the truncation point.
   * options   - An object containing:
   *             ellipsis  - The ellipsis string to append at the end of the truncation.
   *             maxHeight - The maximum height for the root node.
   *
   * Returns true if truncation happened, false otherwise.
   */

  function truncateTextContent($element, $rootNode, $clipNode, options) {
    var element = $element[0];
    var original = $element.text();

    var maxChunk = '';
    var mid, chunk;
    var low = 0;
    var high = original.length;

    // Binary Search
    while (low <= high) {
      mid = low + ((high - low) >> 1); // Integer division

      chunk = $.trim(original.substr(0, mid + 1)) + options.ellipsis;
      setText(element, chunk);

      if ($rootNode.height() > options.maxHeight) {
        high = mid - 1;
      } else {
        low = mid + 1;
        maxChunk = maxChunk.length > chunk.length ? maxChunk : chunk;
      }
    }

    if (maxChunk.length > 0) {
      setText(element, maxChunk);
      return true;
    } else {
      return truncateNearestSibling($element, $rootNode, $clipNode, options);
    }
  }

  /* Recursively truncates a nested node. Traverses the children node tree in-rder.
   *
   * $element  - The jQuery nested node to truncate.
   * $rootNode - The jQuery root node to measure the truncated height.
   * $clipNode - The jQuery node to insert right after the truncation point.
   * options   - An object containing:
   *             ellipsis  - The ellipsis string to append at the end of the truncation.
   *             maxHeight - The maximum height for the root node.
   *
   * Returns true if truncation happened, false otherwise.
   */

  function truncateNestedNode($element, $rootNode, $clipNode, options) {
    var element = $element[0];

    var $children = $element.contents();
    var $child, child;

    var index = 0;
    var length = $children.length;
    var truncated = false;

    $element.empty();

    for (; index < length && !truncated; index++) {

      $child = $children.eq(index);
      child = $child[0];

      if (child.nodeType === 8) { // comment node
        continue;
      }

      element.appendChild(child);

      if ($clipNode.length) {
        if ($.inArray(element.tagName.toLowerCase(), BLOCK_TAGS) >= 0) {
          // Certain elements like <li> should not be appended to.
          $element.after($clipNode);
        } else {
          $element.append($clipNode);
        }
      }

      if ($rootNode.height() > options.maxHeight) {
        if (child.nodeType === 3) { // text node
          truncated = truncateTextContent($child, $rootNode, $clipNode, options);
        } else {
          truncated = truncateNestedNode($child, $rootNode, $clipNode, options);
        }
      }

      if (!truncated && $clipNode.length) {
        $clipNode.remove();
      }

    }

    return truncated;
  }

  /* Public: Creates an instance of Truncate.
   *
   * element - A DOM element to be truncated.
   * options - An Object literal containing setup options.
   *
   * Examples:
   *
   *   var element = document.createElement('span');
   *   element.innerHTML = 'This is<br>odd.';
   *   var truncated = new Truncate(element, {
   *     lines: 1,
   *     lineHeight: 16,
   *     ellipsis: 'â€¦ ',
   *     showMore: '<a class="show-more">Show More</a>',
   *     showLess: '<a class="show-less">Show Less</a>'
   *   });
   *
   *   // Update HTML
   *   truncated.update('This is not very odd.');
   *
   *   // Undo truncation
   *   truncated.expand();
   *
   *   // Redo truncation
   *   truncated.collapse();
   */

  function Truncate(element, options) {
    this.element = element;
    this.$element = $(element);

    this._name = 'truncate';
    this._defaults = {
      lines: 1,
      ellipsis: 'â€¦',
      showMore: '',
      showLess: ''
    };

    this.options = $.extend({}, this._defaults, options);

    if (this.options.maxHeight === undefined) {
      this.options.maxHeight = parseInt(this.options.lines, 10) * parseInt(this.options.lineHeight, 10);
    }

    this.$clipNode = $($.parseHTML(this.options.showMore), this.$element);

    this.original = this.cached = element.innerHTML;

    this.isTruncated = false; // True if the original content overflows the container.
    this.isCollapsed = true; // True if the container is currently collapsed.

    this.update();
  }

  Truncate.prototype = {

    /* Public: Updates the inner HTML of the element and re-truncates. Will not
     * perform an updade if the container is currently expanded, instead it
     * will wait until the next time .collapse() is called.
     *
     * html - The new HTML.
     *
     * Returns nothing.
     */
    update: function(html) {
      var wasExpanded = !this.isCollapsed;

      // Update HTML if provided, otherwise use the current html and restore
      // the truncated content to the original if it's currently present.
      if (html) {
        this.original = this.element.innerHTML = html;
      } else if (this.isCollapsed && this.element.innerHTML === this.cached) {
        this.element.innerHTML = this.original;
      }

      // Wrap the contents in order to ignore container's margin/padding.
      var $wrap = this.$element.wrapInner('<div/>').children();
      $wrap.css({
        border: 'none',
        margin: 0,
        padding: 0,
        width: 'auto',
        height: 'auto'
      });

      this.isTruncated = false;
      // Check if already meets height requirement
      if ($wrap.height() > this.options.maxHeight) {
        this.isTruncated = truncateNestedNode($wrap, $wrap, this.$clipNode, this.options);
      } else {
        this.isCollapsed = false;
      }

      // Restore the wrapped contents
      $wrap.replaceWith($wrap.contents());

      // Cache the truncated content
      this.cached = this.element.innerHTML;

      // If the container was expanded when .update() was called then restore
      // it to it's previous state.
      if (wasExpanded) {
        this.element.innerHTML = this.original;
      }
    },

    /* Public: Expands the element to show content in full.
     *
     * Returns nothing.
     */
    expand: function() {
      if (!this.isCollapsed) {
        return;
      }

      this.isCollapsed = false;
      this.element.innerHTML = this.isTruncated ? this.original + this.options.showLess : this.original;
    },

    /* Public: Collapses the element to the truncated state.
     * Uses the cached HTML from .update() by default.
     *
     * retruncate - True to retruncate original HTML, otherwise use cached HTML.
     *
     * Returns nothing.
     */
    collapse: function(retruncate) {
      if (this.isCollapsed) {
        return;
      }

      this.isCollapsed = true;

      retruncate = retruncate || false;
      if (retruncate) {
        this.update();
      } else {
        this.element.innerHTML = this.cached;
      }
    }
  };

  // Lightweight plugin wrapper preventing multiple instantiations
  $.fn.truncate = function(options) {
    var args = $.makeArray(arguments).slice(1);
    return this.each(function() {
      var truncate = $.data(this, 'jquery-truncate');
      if (!truncate) {
        $.data(this, 'jquery-truncate', new Truncate(this, options));
      } else if (typeof truncate[options] === 'function') {
        truncate[options].apply(truncate, args);
      }
    });
  };

  module.Truncate = Truncate;

})(this, jQuery);
