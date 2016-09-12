/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    this.selectAndProcess('.header-title, [class^="section-wrapper-"] > *, footer p', function (element) {
        element.classList.add('wow');
        element.classList.add('fadeIn');
    });
    (new WOW()).init({live: false});
  });
})();
