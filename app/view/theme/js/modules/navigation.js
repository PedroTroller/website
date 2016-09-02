/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  // Fetch and enrich the body
  var body = $('body').eq(0);
  body.toggleMenu = function () {
    this.toggleClass('menu-in');
  };
  body.hasMenu = function () {
    return body.hasClass('menu-in');
  };

  // Register menu togglers
  $('#menu-btn').on('click', function (e) {
    body.toggleMenu();
  });
  $('#page').on('click', function (e) {
    if (body.hasMenu()) {
      body.toggleMenu();
    }
  });
  $(document).on('keyup', function (e) {
    if (e.which === 27) {
      body.toggleMenu();
    }
  });

  // Initialize smooth scroll
  var smoothScrollOptions = {
    selector: '.menu-item-link',
    speed:    1500,
    offset:   10,
  };
  var hash   = smoothScroll.escapeCharacters(window.location.hash);
  var toggle = document.querySelector('.menu-item-link[href="' + hash + '"]');
  window.location.hash = '';
  smoothScroll.animateScroll(hash, toggle, smoothScrollOptions);
  smoothScroll.init(smoothScrollOptions);

  // Register scrollspy
  body.scrollspy({target: '#menu'});
});
