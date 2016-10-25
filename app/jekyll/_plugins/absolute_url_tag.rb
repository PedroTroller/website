# This file is part of the fabschurt/website package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `absolute_url` Liquid tag will prepend a full URL prefix to the passed
  # relative path (depends on the `CANONICAL_ROOT` environment variable).
  class AbsoluteUrlTag < Liquid::Tag
    # @see Liquid::Tag#render
    def render(context)
      site = context.registers[:site]

      ENV['CANONICAL_ROOT'].to_s +
      site.baseurl               +
      site.liquid_renderer
        .file('*')
        .parse(@markup)
        .render!(context)
        .strip
    end
  end
end

Liquid::Template.register_tag('absolute_url', Jekyll::AbsoluteUrlTag)
