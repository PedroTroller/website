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

  document.addEventListener('DOMContentLoaded', function () {
    // Initialize WOW reveal animations
    this.querySelectorAll('.section, .footer').forEach(element => element.classList.add('wow', 'fadeIn'));
    (new WOW()).init();

    // Initialize smooth scroll
    smoothScroll.init({
      selector: 'a',
      offset:   36,
    });

    // Initialize AJAX contact form
    const contactForm = ContactForm(
      document.getElementById('contact-form'),
      NotificationArea(
        document.getElementById('contact-form-notification-area'),
        document.getElementById('template-notification').innerHTML
      ),
      document.getElementById('template-form-error-list').innerHTML
    );
    contactForm.bindListeners();

    // Load LiveReload script (development environment only)
    if (jekyllConfig.environment === 'dev') {
      const host = location.host.split(':')[0];
      this.appendScript(`//${host}:35729/livereload.js`);
    }
  });
})();
