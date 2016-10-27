## Quelques réalisations

<ul class="work-example-list">
    {% for work_example in site.data.work[page.lang] %}
        <li class="work-example">
            <img class="work-example-img" src="{{ site.baseurl }}/data/img/{{ work_example[1].img }}" alt="" width="292" height="183" />
            <div class="work-example-details-wrapper">
                <div class="work-example-details">
                    <h3 class="work-example-title">
                        <a class="work-example-link" href="{{ work_example[1].url }}" target="_blank" title="{{ i18n.click_to_open_project }}">{{ work_example[0] }}</a>
                    </h3>
                    <div class="work-example-description">
                        <p>{{ work_example[1].desc }}</p>
                    </div>
                    <ul class="work-example-tech-list">
                        {% for tech in work_example[1].tech %}
                            <li class="work-example-tech-list-item">{{ tech }}</li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
        </li>
    {% endfor %}
</ul>
