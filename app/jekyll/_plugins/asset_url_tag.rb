# This file is part of the fabschurt/website package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `asset_url` Liquid tag will prepend the asset directory path (set under
  # the `asset_url` in `_config.yml`) to the passed relative path.
  class AssetUrlTag < Liquid::Tag
    # @see Liquid::Tag#render
    def render(context)
      site = context.registers[:site]

      site.baseurl +
      site.config['asset_url'].to_s +
      site.liquid_renderer
        .file('*')
        .parse(@markup)
        .render!(context)
        .strip
    end
  end
end

Liquid::Template.register_tag('asset_url', Jekyll::AssetUrlTag)
