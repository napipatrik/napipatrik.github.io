module Jekyll
  class StaticPathGenerator < Generator
    safe true
    priority :low

    def generate(site)
      raw = File.read('./assets/js/patrikok.js')[/\[.+\]/m]
      list = eval(raw)
      list.each_with_index { |item, id| site.pages << StaticPage.new(site, site.source, item, id.to_s) }
    end
  end

  class StaticPage < Page
    def initialize(site, base, quote, quote_id)
      @site = site
      @base = base
      @dir = quote_id
      @name = 'index.html'

      self.process(@name)
      read_yaml(base, 'index.html')
      self.data = {
          "layout" => "home",
          "quote" => quote,
          "quote_id" => quote_id,
      }
    end
  end
end
