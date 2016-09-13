/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Caution: monkey patching ahead. Yeah, I know it’s bad, you know it’s bad, we
 * know it’s bad, but hey, it’s not *that* bad when you avoid prototype poisoning.
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
})();
