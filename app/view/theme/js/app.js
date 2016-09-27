/*!
 * This file is part of the fabschurt/cv package.
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

  /**
   * Executes once the YouTube embed API is loaded.
   */
  window.onYouTubeIframeAPIReady = function () {
    var videoSelector = 'video-background';
    var player = new YT.Player(videoSelector, {
      videoId: 'NZlfxWMr7nc',
      playerVars: {
        controls:        0,
        disablekb:       1,
        showinfo:        0,
        cc_load_policty: 0,
        iv_load_policy:  3,
        modestbranding:  1,
        rel:             0,
        autoplay:        1,
        loop:            1,
        start:           55,
      },
      events: {
        onReady: function (e) {
          e.target.mute();
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            document.getElementById(videoSelector).style.opacity = 1;
          }
        },
      },
    });
  }

  // When DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Auto-size <h1> and <h2> headers
    (function initHeaderAutosize() {
      var driveMapping = {
        h1: 0.75,
        h2: 1.0,
      };
      document.selectAndProcess('h1, h2', function (element) {
        fitText(element, driveMapping[element.nodeName.toLowerCase()], {
          maxFontSize: getComputedStyle(element).getPropertyValue('font-size'),
        });
      });
    })();

    // Register and initialize reveal animation
    (function initRevealAnimations() {
      document.selectAndProcess('.header-title, [class^="section-wrapper-"] > *, footer p', function (element) {
        element.classList.add('wow');
        element.classList.add('fadeIn');
      });
      (new WOW()).init({live: false});
    })();

    // Initialize interactive menu and smooth scroll
    (function initNavigation() {
      // Fetch menu reference
      var menu = document.getElementById('menu');

      /**
       * Toggles the `visible` class on the menu.
       */
      menu.toggle = function () {
        this.classList.toggle('visible');
      };

      /**
       * Removes the `visible` class from the menu if it has it.
       */
      menu.hide = function () {
        if (this.classList.contains('visible')) {
          this.classList.remove('visible');
        }
      }

      // Toggle menu on menu button click
      document.getElementById('menu-btn').addEventListener('click', function () {
        menu.toggle();
      });

      // Hide menu when the user clicks anywhere else
      document.getElementById('page').addEventListener('click', function () {
        menu.hide();
      });

      // Smoothly scroll to anchor on menu item click
      menu.addEventListener('click', function (e) {
        if (e.target.nodeName.toLowerCase() !== 'a' || e.target.getAttribute('href').charAt(0) !== '#') {
          return;
        }
        e.preventDefault();
        smoothScroll.animateScroll(document.querySelector(e.target.getAttribute('href')), e.target, {
          speed: 1500,
          callback: function (anchor, toggle) {
            location.hash = anchor.getAttribute('id');
          },
        });
        menu.hide();
      });

      // Hide menu when `ESC` key is pressed
      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) {
          menu.toggle();
        }
      });
    })();

    // Initialize the fullscren video background for non-mobile devices only
    (function initVideoBackground() {
      if (!(new MobileDetect(navigator.userAgent)).mobile()) {
        document.appendScript('https://www.youtube.com/iframe_api');
      }
    })();
  });

  // When everything is loaded
  window.addEventListener('load', function () {
    // Initialize cascade (Masonry) layout
    (function initCascadeLayout() {
      new Masonry(document.querySelector('.skill-list'), {
        columnWidth: 292,
        fitWidth:    true,
      });
    })();

    // Initialize scrollspy for main menu
    (function initScrollspy() {
      gumshoe.init({
        selector: '#main-nav a',
        offset:   100,
      });
    })();
  });

  // When screen orientation changes
  window.addEventListener('orientationchange', function () {
    // Give the whole mess the time to resize before recalculating distances
    (function initGumshoeTimeoutProxy() {
      setTimeout(function () {
        gumshoe.setDistances();
      }, 500);
    })();
  });
})();
