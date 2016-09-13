/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Fetch menu reference
    var menu = this.getElementById('menu');

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
    this.getElementById('menu-btn').addEventListener('click', function () {
      menu.toggle();
    });

    // Hide menu when the user clicks anywhere else
    this.getElementById('page').addEventListener('click', function () {
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
    this.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) {
        menu.toggle();
      }
    });
  });

  window.addEventListener('load', function () {
    // Register scrollspy
    gumshoe.init({
      selector: '#main-nav a',
      offset:   100,
    });
  });

  window.addEventListener('orientationchange', function () {
    // Leave the whole mess the time to resize before recalculating distances
    setTimeout(function () {
      gumshoe.setDistances();
    }, 500);
  });
})();
