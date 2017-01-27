/*
 * This file is part of the fabschurt/website package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(() => {
  'use strict';

  /**
   * Adds a `<script>` tag at the end of the document.
   *
   * @param {String} scriptUrl The URL of the JS file to be added
   */
  document.appendScript = function (scriptUrl) {
    const script = this.createElement('script');
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
   * @returns {HTMLElement} The generated DOM element
   */
  document.createElementFromString = function (htmlString) {
    const container = this.createElement('div');
    container.innerHTML = htmlString;
    if (container.childNodes.length !== 1) {
      throw new Error('The passed HTML string must represent a single-rooted valid HTML node hierarchy.');
    }

    return container.firstChild;
  };

  /**
   * Removes all child nodes.
   *
   * @returns {Node} A self-reference
   */
  Node.prototype.empty = function () {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    return this;
  };
})();
