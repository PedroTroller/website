# This file is part of the fabschurt/cv package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `absolute_url` Liquid tag will prepend a full URL prefix to the passed
  # relative path (the `CANONICAL_ROOT` environment variable must be set,
  # otherwise an exception will be thrown).
  class AbsoluteUrlTag < Liquid::Tag
    # @see Liquid::Tag#render
    # @raise [RuntimeError] If `ENV['CANONICAL_ROOT]` is not set
    def render(context)
      unless ENV.key?('CANONICAL_ROOT')
        fail RuntimeError, 'The CANONICAL_ROOT environment variable must be set in order to use this Liquid tag.'
      end
      site = context.registers[:site]

      ENV['CANONICAL_ROOT'] + site.baseurl + site.liquid_renderer.file('*')
                                                                 .parse(@markup)
                                                                 .render!(context)
                                                                 .strip
    end
  end
end

Liquid::Template.register_tag('absolute_url', Jekyll::AbsoluteUrlTag)
