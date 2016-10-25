/*!
 * This file is part of the fabschurt/website package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
  'use strict';

  /**
   * Adds a `<script>` tag at the end of the current document.
   *
   * @param {String} scriptUrl The URL of the JS file to be added
   */
  document.appendScript = function (scriptUrl) {
    var script = this.createElement('script');
    script.src = scriptUrl;
    this.body.appendChild(script);
  };

  /**
   * Selects a node list and pass each node through the passed closure.
   *
   * @param {String}   selector       The CSS selector targeting the desired elements
   * @param {Function} appliedClosure The closure by which each node will be processed
   *
   * @return {NodeList} The selected node list
   */
  document.selectAndProcess = function (selector, appliedClosure) {
    var nodeList = this.querySelectorAll(selector);
    Array.prototype.forEach.call(nodeList, appliedClosure);

    return nodeList;
  };

  // When DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Register and initialize reveal animation
    (function initRevealAnimations() {
      document.selectAndProcess('.section, .footer', function (element) {
        element.classList.add('wow');
        element.classList.add('fadeIn');
      });
      (new WOW()).init();
    })();

    // Load livereload script for `dev` environment
    (function initLiveReload() {
      if (config.environment === 'dev') {
        document.appendScript('//' + location.host.split(':')[0] + ':35729/livereload.js');
      }
    })();
  });
})();
