/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

window.addEventListener('load', function () {
  new Masonry(document.querySelector('.skill-list'), {
    itemSelector: '.skill-group',
    columnWidth:  304,
    fitWidth:     true,
  });
});
