/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  // Enrich the body object
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

  // Register scrollspy
  body.scrollspy({target: '#menu'});
});
