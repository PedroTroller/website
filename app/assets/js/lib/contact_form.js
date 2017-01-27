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
   * Decorates a `<form>` element with asynchronous sending capabilities and
   * various UX enhancements.
   *
   * @class
   * @author Fabien Schurter <fabien@fabschurt.com>
   *
   * @param {HTMLFormElement}  target            The decorated `<form>` node
   * @param {NotificationArea} notifier          A `NotificationArea` instance
   * @param {String}           errorListTemplate The Mustache template that represents a form-control error list
   */
  const ContactForm = function (target, notifier, errorListTemplate) {
    Object.defineProperties(this, {
      target:            {value: target},
      formControls:      {value: target.querySelectorAll('input, textarea, button')},
      notifier:          {value: notifier},
      errorListTemplate: {value: String(errorListTemplate).trim()},
    });
    target.addEventListener('submit', this.onSubmit.bind(this));
  };

  /**
   * Disables all the target form’s controls to prevent user input and displays
   * a global busy state.
   */
  ContactForm.prototype.disable = function () {
    document.body.style.cursor = 'progress';
    this.resetErrors();
    this.formControls.forEach(control => {
      switch (control.type) {
        case 'submit':
          new Button(control, 'loading')
          break;
        default:
          control.setAttribute('disabled', 'disabled');
      }
    });
  };

  /**
   * Re-enables all the target form’s controls to allow user input and hides the
   * global busy state.
   */
  ContactForm.prototype.enable = function () {
    document.body.style.cursor = 'auto';
    this.formControls.forEach(control => {
      switch (control.type) {
        case 'submit':
          new Button(control, 'reset');
          break;
        default:
          control.removeAttribute('disabled');
      }
    });
  };

  /**
   * Displays validation errors for each of the form’s controls.
   *
   * @param {Object} errors A hash containing arrays of errors, grouped by control name
   */
  ContactForm.prototype.showErrors = function (errors) {
    this.formControls.forEach(control => {
      if (!control.name || !errors[control.name] || !errors[control.name].length) {
        return;
      }
      const parentRow = control.closest('.form-row');
      parentRow.appendChild(
        document.createElementFromString(
          Mustache.render(this.errorListTemplate, {errors: errors[control.name]})
        )
      );
      parentRow.classList.add('has-error');
    });
  };

  /**
   * Removes all the control error lists from the form.
   */
  ContactForm.prototype.resetErrors = function () {
    this.target.querySelectorAll('.form-row.has-error').forEach(row => {
      row.classList.remove('has-error');
    });
    this.target.querySelectorAll('.form-error-list').forEach(list => {
      list.parentNode.removeChild(list);
    });
  };

  /**
   * Traps regular form submits and replaces them with custom AJAX behavior.
   *
   * @param {Event} event
   *
   * @listens submit
   */
  ContactForm.prototype.onSubmit = function (event) {
    event.preventDefault();

    // Get form data and freeze its UI
    var formData = new FormData(this.target);
    this.disable();

    // Send the form asynchronously
    fetch(this.target.action, {
      method:      'POST',
      headers:     {'Accept': 'application/json'},
      body:        formData,
      credentials: 'include',
    })
      .then(response => response.json())
      .then(responseData => {
        this.enable();
        switch (responseData.status) {
          case 'success':
            this.notifier.notify(config.i18n.contact_form.notification.success, 'success');
            this.target.reset();
            break;
          case 'fail':
            this.notifier.notify(config.i18n.contact_form.notification.fail, 'danger');
            this.showErrors(responseData.data);
            break;
          case 'error':
          default:
            throw new Error();
        }
      })
      .catch(() => {
        this.enable();
        this.notifier.notify(config.i18n.contact_form.notification.error, 'danger');
      })
    ;
  }

  // Export
  window.ContactForm = ContactForm;
})();
