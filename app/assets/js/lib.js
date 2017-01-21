/*
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
   * Creates a DOM element from its HTML string representation.
   *
   * @param {String} htmlString The HTML string representation of the element to create
   *
   * @throws {Error} If the passed HTML string represents anything else than a single-rooted valid HTML node hierarchy
   *
   * @return {HTMLElement} The resulting DOM element
   */
  document.createElementFromString = function (htmlString) {
    var template = this.createElement('div');
    template.innerHTML = htmlString.trim();
    if (template.childNodes.length !== 1) {
      throw new Error('The passed HTML string must represent a single-rooted valid HTML node hierarchy.');
    }

    return template.firstChild;
  };

  /**
   * Selects a node list and process each node with the passed closure.
   *
   * @param {String}   selector The CSS selector targeting the desired elements
   * @param {Function} closure  The closure which will process each node in the list
   *
   * @return {NodeList} The processed node list
   */
  document.queryAndApply = Element.prototype.queryAndApply = function (selector, closure) {
    var nodeList = this.querySelectorAll(selector);
    Array.prototype.forEach.call(nodeList, closure);

    return nodeList;
  };

  /**
   * Removes all child nodes.
   */
  Node.prototype.empty = function () {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  };

  /**
   * Displays a Bootstrap alert as only child node.
   *
   * @param {String} message The message to display
   * @param {String} type    The alert type (one of *success*, *info*, *warning* or *danger*)
   */
  HTMLDivElement.prototype.notify = function (message, type) {
    if (!this.template) {
      this.template = document.getElementById('template-notification').innerHTML;
    }
    var notification = document.createElementFromString(
      Mustache.render(this.template, {
        type:        type,
        message:     message,
        close_label: config.i18n.contact_form.notification.close,
      })
    );
    this.empty();
    this.appendChild(notification);
    smoothScroll.animateScroll(this, null, {offset: 12});
    notification.classList.add('in');
    new Alert(notification);
  };
})();
