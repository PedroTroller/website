/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  $('section').addClass('wow fadeIn');
  new WOW().init({
    offset: 10,
    live:   false,
  });
});
