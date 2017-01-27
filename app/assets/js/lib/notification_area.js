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
   * Decorates a `<div>` element with notification capabilities.
   *
   * @class
   * @author Fabien Schurter <fabien@fabschurt.com>
   *
   * @param {HTMLDivElement} target   The decorated `<div>` node
   * @param {String}         template The Mustache template that represents the notification to display
   */
  const NotificationArea = function (target, template) {
    Object.defineProperties(this, {
      target:   {value: target},
      template: {value: String(template).trim()},
    });
  };

  /**
   * Displays a Bootstrap alert as only child node of the target node.
   *
   * @param {String} message The message to display in the notification
   * @param {String} type    The Bootstrap alert type (one of *success*, *info*, *warning* or *danger*)
   */
  NotificationArea.prototype.notify = function (message, type) {
    const notification = document.createElementFromString(
      Mustache.render(this.template, {
        type:        type,
        message:     message,
        close_label: config.i18n.contact_form.notification.close,
      })
    );
    this.target.empty().appendChild(notification);
    smoothScroll.animateScroll(this.target, null, {offset: 12});
    notification.classList.add('in');
    new Alert(notification);
  };

  // Export
  window.NotificationArea = NotificationArea;
})();
