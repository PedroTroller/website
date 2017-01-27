# This file is part of the fabschurt/website package.
#
# (c) 2016 Fabien Schurter <fabien@fabschurt.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

Jekyll::Hooks.register :site, :pre_render do |site|
  site.config['url']         = ENV['CANONICAL_ROOT']
  site.config['kontact_url'] = ENV['KONTACT_URL']
end

Jekyll::Hooks.register :documents, :pre_render do |document, payload|
  payload.site['i18n'] = payload.site.data['i18n'][document.data['lang']]
end
