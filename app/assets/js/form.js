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
   * Disables the form to prevent any input.
   */
  HTMLFormElement.prototype.freeze = function () {
    document.body.style.cursor = 'progress';
    this.resetErrors();
    for (var element of this) {
      if (element.type === 'submit') {
        new Button(element, 'loading');
      } else {
        element.setAttribute('disabled', 'disabled');
      }
    }
  };

  /**
   * Re-enables the form to allow input.
   */
  HTMLFormElement.prototype.unfreeze = function () {
    document.body.style.cursor = 'auto';
    for (var element of this) {
      if (element.type === 'submit') {
        new Button(element, 'reset');
      } else {
        element.removeAttribute('disabled');
      }
    }
  };

  /**
   * Shows validation errors for each of the form’s fields.
   *
   * @param {Object} errors A hash containing arrays of errors, grouped by field name
   */
  HTMLFormElement.prototype.showErrors = function (errors) {
    if (!this.template) {
      this.template = document.getElementById('template-form-error-list').innerHTML;;
    }
    for (var field of this.elements) {
      var fieldName = field.name;
      if (!fieldName || !errors[fieldName] || !errors[fieldName].length) {
        continue;
      }
      var row = field.closest('.form-row');
      row.appendChild(
        document.createElementFromString(
          Mustache.render(this.template, {errors: errors[fieldName]})
        )
      );
      row.classList.add('has-error');
    }
  };

  /**
   * Removes all the error lists from the form.
   */
  HTMLFormElement.prototype.resetErrors = function () {
    this.queryAndApply('.has-error', function (element) {
      element.classList.remove('.has-error');
    });
    this.queryAndApply('.form-error-list', function (element) {
      element.parentNode.removeChild(element);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Initialize the AJAX contact form
    (function initForm() {
      var form             = document.getElementById('contact-form');
      var notificationArea = document.getElementById('contact-form-notification-area');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data and freeze its UI
        var form     = this;
        var formData = new FormData(form);
        form.freeze();

        // Send the form asynchronously
        fetch(form.action, {
          method:      'POST',
          headers:     {'Accept': 'application/json'},
          body:        formData,
          credentials: 'include',
        }).then(function (response) {
          return response.json();
        }).then(function (responseData) {
          form.unfreeze();
          switch (responseData.status) {
            case 'success':
              notificationArea.notify(config.i18n.contact_form.notification.success, 'success');
              form.reset();
              break;
            case 'fail':
              notificationArea.notify(config.i18n.contact_form.notification.fail);
              form.showErrors(responseData.data);
              break;
            case 'error':
            default:
              throw new Error();
              break;
          }
        }).catch(function (error) {
          notificationArea.notify(config.i18n.contact_form.notification.error, 'danger');
          form.unfreeze();
        });
      });
    })();
  });
})();
