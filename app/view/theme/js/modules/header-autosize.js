/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$(function () {
  $('section > h1').each(function () {
    $(this).fitText(0.75, {maxFontSize: $(this).css('font-size')});
  });
  $('section > h2').each(function () {
    $(this).fitText(1.0, {maxFontSize: $(this).css('font-size')});
  });
});
