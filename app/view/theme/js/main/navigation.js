/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  // Fetch menu reference
  var menu = $('#menu');

  /**
   * Toggles the `visible` class on the menu.
   */
  menu.toggle = function () {
    this.toggleClass('visible');
  };

  /**
   * Removes the `visible` class from the menu if it has it.
   */
  menu.hide = function () {
    if (this.hasClass('visible')) {
      this.removeClass('visible');
    }
  }

  // Register menu togglers
  $('#menu-btn').on('click', function (e) {
    menu.toggle();
  });
  $('#page').on('click', function (e) {
    menu.hide();
  });
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    smoothScroll.animateScroll($($(this).attr('href'))[0], this, {speed: 1500});
    menu.hide();
  });
  $(document).on('keyup', function (e) {
    if (e.which === 27) {
      menu.hide();
    }
  });

  // Register scrollspy
  $('body').scrollspy({target: '#menu'});
});
