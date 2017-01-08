# This file is part of the fabschurt/website package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

module Jekyll
  # The `include_content` Liquid tag will search for partials in the `_content`
  # subdirectory of the include directory and render one of them, trying to load
  # either an HTML or Markdown file in order (and raising an exception if nothing
  # is found).
  #
  # The target Markdown file(s) can contain Liquid tags, they’ll be parsed.
  #
  # @author Fabien Schurter <fabien@fabschurt.com>
  class IncludeContentTag < Liquid::Tag
    @@CONTENT_SUBFOLDER = '_content'
    @@CONTENT_FORMATS   = [:html, :md]

    # @see Liquid::Tag#render
    # @raise [IOError] If no resolvable partial file can be found
    def render(context)
      site = context.registers[:site]
      rendered_slug =
        site.liquid_renderer
          .file('*')
          .parse(@markup)
          .render!(context)
          .strip
      partial_path = "#{@@CONTENT_SUBFOLDER}/#{rendered_slug}"

      @@CONTENT_FORMATS.each do |file_ext|
        full_path = site.in_source_dir("#{partial_path}.#{file_ext}")
        if File.exist?(full_path)
          content =
            site.liquid_renderer
              .file(full_path)
              .parse(File.read(full_path, site.file_read_opts))
              .render!(context)
          case file_ext
          when :html
            return content
          when :md
            return site.find_converter_instance(Jekyll::Converters::Markdown).convert(content)
          end
        end
      end

      fail IOError, "Could not resolve `#{rendered_slug}` as a valid content partial."
    end
  end
end

Liquid::Template.register_tag('include_content', Jekyll::IncludeContentTag)
