const username = "w1ttyrat";

fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    .then(response => response.json())
    .then(repos => {
        const container = document.getElementById('repos');

        const grouped = repos.reduce((groups, repo) => {
            const language = repo.language || 'Other';
            if (!groups[language]) groups[language] = [];
            groups[language].push(repo);
            return groups;
        }, {});

        const languages = Object.keys(grouped).sort();

        languages.forEach(language => {
            const section = document.createElement('section');
            section.className = 'language-group';

            const heading = document.createElement('h2');
            heading.textContent = language;

            const list = document.createElement('div');
            list.className = 'repo-list';

            grouped[language]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(repo => {
                    const card = document.createElement('a');
                    card.className = "repo-card";
                    card.href = repo.html_url;
                    card.target = "_blank";
                    card.rel = "noopener noreferrer";

                    const title = document.createElement('strong');
                    title.textContent = repo.name;
                    if (repo.fork) {
                        const fork = document.createElement('span');
                        fork.textContent = 'fork';
                        fork.style.fontSize = '0.75em';
                        fork.style.marginLeft = '0.5rem';
                        fork.style.opacity = '0.6';
                        title.appendChild(fork);
                    }

                    const description = document.createElement('p');
                    description.textContent = repo.description || 'No description';

                    card.appendChild(title);
                    card.appendChild(description);

                    list.appendChild(card);
                });

            section.appendChild(heading);
            section.appendChild(list);
            container.appendChild(section);
        });
    });

