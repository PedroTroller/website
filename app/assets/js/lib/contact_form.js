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
   * The prototype for `ContactForm` objects.
   *
   * A `ContactForm` object decorates an `HTMLFormElement` node with asynchronous
   * sending capabilities and various UX enhancements.
   *
   * @author Fabien Schurter <fabien@fabschurt.com>
   */
  const prototype = {
    /**
     * Binds event listeners required for the form to function as expected.
     */
    bindListeners() {
      this.innerForm.addEventListener('submit', this.catchSubmit.bind(this));
      this.innerForm
        .querySelector('.captcha-refresh-btn')
        .addEventListener('click', this.refreshCaptcha.bind(this))
      ;
    },

    /**
     * Disables all the target form’s controls to prevent user input and displays
     * a global busy state.
     */
    disable() {
      document.body.style.cursor = 'progress';
      this.formControls.forEach(control => {
        switch (control.type) {
          case 'submit':
            new Button(control, 'loading')
            break;
          default:
            control.setAttribute('disabled', 'disabled');
        }
      });
    },

    /**
     * Re-enables all the target form’s controls to allow user input and hides
     * the global busy state.
     */
    enable() {
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
    },

    /**
     * Displays validation errors for each of the form’s controls.
     *
     * @param {Object.<String, String[]>} errors A hash containing arrays of error messages, grouped by control name
     */
    showErrors(errors) {
      this.formControls.forEach(control => {
        if (!control.name || !errors[control.name] || !errors[control.name].length) {
          return; // Don’t do anything if the control has no errors
        }
        const parentRow = control.closest('.form-row');
        parentRow.appendChild(
          document.createElementFromString(
            Mustache.render(this.errorListTemplate, {errors: errors[control.name]})
          )
        );
        parentRow.classList.add('has-error');
      });
    },

    /**
     * Removes all the error lists from the form.
     */
    hideErrors() {
      this.innerForm
        .querySelectorAll('.form-row.has-error')
        .forEach(row => row.classList.remove('has-error'))
      ;
      this.innerForm
        .querySelectorAll('.form-error-list')
        .forEach(list => list.parentNode.removeChild(list))
      ;
    },

    /**
     * Refreshes the current captcha image.
     *
     * @this {ContactForm}
     */
    refreshCaptcha() {
      this.captchaImage.setAttribute(
        'src',
        this.captchaImage
          .getAttribute('src')
          .replace(/(\?|&)ts=\d+/, `$1ts=${Date.now()}`)
      );
    },

    /**
     * Traps regular form submits and replaces them with custom AJAX behavior.
     *
     * @param {Event} event
     *
     * @listens submit
     *
     * @this {ContactForm}
     */
    catchSubmit(event) {
      event.preventDefault();

      // Get form data and freeze its UI
      const formData = new FormData(this.innerForm);
      this.disable();
      this.hideErrors();

      // Send the form asynchronously
      fetch(this.innerForm.action, {
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
              this.refreshCaptcha();
              this.innerForm.reset();
              this.notifier.notify('success', jekyllConfig.i18n.contact_form.notification.success);
              break;
            case 'fail':
              this.showErrors(responseData.data);
              this.notifier.notify('danger', jekyllConfig.i18n.contact_form.notification.fail);
              break;
            case 'error':
            default:
              throw new Error();
          }
        })
        .catch(() => {
          this.enable();
          this.notifier.notify('danger', jekyllConfig.i18n.contact_form.notification.error);
        })
      ;
    },
  };

  /**
   * The factory for `ContactForm` objects.
   *
   * @param {HTMLFormElement}  innerForm         The decorated element
   * @param {NotificationArea} notifier          A `NotificationArea` instance
   * @param {String}           errorListTemplate The Mustache template that represents a form control error list
   *
   * @returns {ContactForm}
   */
  const ContactForm = function (innerForm, notifier, errorListTemplate) {
    return Object.create(prototype, {
      innerForm:         {value: innerForm},
      formControls:      {value: innerForm.querySelectorAll('input, textarea, button')},
      captchaImage:      {value: innerForm.querySelector('.captcha-img')},
      notifier:          {value: notifier},
      errorListTemplate: {value: String(errorListTemplate).trim()},
    });
  };

  // Export
  window.ContactForm = ContactForm;
})();
