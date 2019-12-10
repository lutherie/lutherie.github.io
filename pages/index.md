---
# List of available pages
---

## English
{% for file in site.static_files %}
  {% if file.path contains '/pages/' %}
    {% if file.path contains '-en ' %}
      {% assign s = file.path.size | minus: 3 %}
[{{ file.basename | slice: 5, file.basename.size }}]({{ file.path | slice: 0, s}})
    {% endif %}
  {% endif %}
{% endfor %}


## Français
{% for file in site.static_files %}
  {% if file.path contains '/pages/' %}
    {% if file.path contains '-fr ' %}
    {% assign s = file.path.size | minus: 3 %}
[{{ file.basename | slice: 5, file.basename.size }}]({{ file.path | slice: 0, s}})
    {% endif %}
  {% endif %}
{% endfor %}
