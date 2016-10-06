# This file is part of the fabschurt/cv package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `asset_url` Liquid tag will prepend the asset directory path (set under
  # the `url.assets` in `_config.yml`) to the passed relative path.
  class AssetUrlTag < Liquid::Tag
    # @see Liquid::Tag#render
    # @raise [RuntimeError] If `url.assets` is not set in `_config.yml`
    def render(context)
      site = context.registers[:site]
      unless site.config['url'].to_h.key?('assets')
        fail RuntimeError, 'The asset root URL is not set in the config file.'
      end

      site.baseurl + site.config['url']['assets'] + site.liquid_renderer.file('*')
                                                                        .parse(@markup)
                                                                        .render!(context)
                                                                        .strip
    end
  end
end

Liquid::Template.register_tag('asset_url', Jekyll::AssetUrlTag)
