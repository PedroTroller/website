/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function headerAutosize() {
  'use strict';

  var driveMapping = {
    h1: 0.75,
    h2: 1.0,
  };
  document.addEventListener('DOMContentLoaded', function () {
    this.selectAndProcess('h1, h2', function (element) {
      fitText(element, driveMapping[element.nodeName.toLowerCase()], {
        maxFontSize: getComputedStyle(element).getPropertyValue('font-size'),
      });
    });
  });
})();
