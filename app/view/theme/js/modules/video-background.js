/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Executes once the YouTube embed API is loaded.
 */
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-background', {
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
      onReady: function(e) {
        e.target.mute();
      },
    },
  });
}
