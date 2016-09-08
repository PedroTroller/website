/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  $('.header-title, [class^="section-wrapper-"] > *, footer p').addClass('wow fadeIn');
  new WOW().init({live: false});
});
