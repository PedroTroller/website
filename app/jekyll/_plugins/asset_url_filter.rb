# This file is part of the fabschurt/website package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `asset_url` filter will prepend the asset directory’s URL (set with
  # `asset_url` in `_config.yml`) to the passed relative path.
  #
  # @author Fabien Schurter <fabien@fabschurt.com>
  module AssetUrlFilter
    # @param relative_url    [String]  The asset file’s URL, relative to the asset directory
    # @param prepend_baseurl [Boolean] Whether to prepend the site’s `baseurl` or not (optional, defaults to `true`)
    #
    # @return [String] The prefixed asset URL
    def asset_url(relative_url, prepend_baseurl = true)
      base_url  = prepend_baseurl ? @context.registers[:site].baseurl : ''
      asset_url = @context.registers[:site].config['asset_url'].to_s

      base_url + asset_url + relative_url.to_s
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetUrlFilter)
