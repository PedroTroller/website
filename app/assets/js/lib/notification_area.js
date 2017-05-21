/*
 * This file is part of the fabschurt/website package.
 *
 * (c) 2016-2017 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(() => {
  'use strict';

  /**
   * The prototype for `NotificationArea` objects.
   *
   * A `NotificationArea` object decorates an `HTMLDivElement` node with
   * notification capabilities.
   *
   * @author Fabien Schurter <fabien@fabschurt.com>
   */
  const prototype = {
    /**
     * Displays a Bootstrap alert as only child of the target node.
     *
     * @param {String} type    The Bootstrap alert type (one of *success*, *info*, *warning* or *danger*)
     * @param {String} message The message to display in the notification
     */
    notify(type, message) {
      const notification = document.createElementFromString(
        Mustache.render(this.template, {
          type,
          message,
          close_label: jekyllConfig.i18n.contact_form.notification.close,
        })
      );
      this.empty();
      this.innerDiv.appendChild(notification);
      smoothScroll.animateScroll(this.innerDiv, null, {offset: 17});
      notification.classList.add('in');
      new Alert(notification);
    },

    /**
     * Removes all child nodes.
     */
    empty() {
      while (this.innerDiv.firstChild) {
        this.innerDiv.removeChild(this.innerDiv.firstChild);
      }
    },
  };

  /**
   * The factory for `NotificationArea` objects.
   *
   * @param {HTMLDivElement} innerDiv The decorated element
   * @param {String}         template The Mustache template that represents the notification to display
   *
   * @returns {NotificationArea}
   */
  const NotificationArea = function (innerDiv, template) {
    return Object.create(prototype, {
      innerDiv: {value: innerDiv},
      template: {value: String(template).trim()},
    });
  };

  // Export
  window.NotificationArea = NotificationArea;
})();
