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

  document.addEventListener('DOMContentLoaded', function () {
    /**
     * Initializes WOW reveal animations.
     */
    (function initRevealAnimations() {
      document.queryAndApply('.section, .footer', function (element) {
        element.classList.add('wow');
        element.classList.add('fadeIn');
      });
      (new WOW()).init();
    })();

    /**
     * Initializes smooth scroll.
     */
    (function initSmoothScroll() {
      smoothScroll.init({
        selector: 'a',
        offset:   36,
      });
    })();

    /**
     * Loads LiveReload script (development environment only).
     */
    (function initLiveReload() {
      if (config.environment === 'dev') {
        document.appendScript('//' + location.host.split(':')[0] + ':35729/livereload.js');
      }
    })();
  });
})();
