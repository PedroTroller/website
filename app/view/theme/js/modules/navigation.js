/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  // Fetch and enrich menu element
  var menu = $('#menu');
  menu.toggle = function () {
    this.toggleClass('visible');
  };
  menu.isVisible = function () {
    return this.hasClass('visible');
  };

  // Register menu togglers
  $('#menu-btn').on('click', function (e) {
    menu.toggle();
  });
  $('#page').on('click', function (e) {
    if (menu.isVisible()) {
      menu.toggle();
    }
  });
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    smoothScroll.animateScroll($($(this).attr('href'))[0], this, {speed: 1500});
    if (menu.isVisible()) {
      menu.toggle();
    }
  });
  $(document).on('keyup', function (e) {
    if (e.which === 27) {
      menu.toggle();
    }
  });

  // Register scrollspy
  $('body').scrollspy({target: '#menu'});
});
