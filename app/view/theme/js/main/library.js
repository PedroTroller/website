/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Adds a `<script>` tag at the end of the current document.
 *
 * @param {string} scriptUrl The URL of the JS file to be added
 */
document.appendScript = function (scriptUrl) {
  'use strict';

  var script = this.createElement('script');
  script.src = scriptUrl;
  this.body.appendChild(script);
};
