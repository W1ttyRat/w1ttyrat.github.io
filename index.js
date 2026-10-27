const username = "w1ttyrat";

// Pixel die in the hero: flicks through faces, then lands on a random one.
const die = document.querySelector('.die');
const dieImg = die.querySelector('img');
const dieNote = document.querySelector('.die-note');
const showFace = n => { dieImg.src = dieImg.src.replace(/die_\d/, `die_${n}`); };
const randomFace = () => 1 + Math.floor(Math.random() * 6);

die.addEventListener('click', () => {
    if (die.classList.contains('rolling')) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let flips = reduceMotion ? 0 : 8;
    die.classList.add('rolling');
    const tick = () => {
        if (flips-- > 0) {
            showFace(randomFace());
            setTimeout(tick, 70);
            return;
        }
        const face = randomFace();
        showFace(face);
        die.classList.remove('rolling');
        dieNote.textContent = `You rolled a ${face}`;
    };
    tick();
});

fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(repos => {
        const container = document.getElementById('repos');
        container.replaceChildren();

        const grouped = repos.reduce((groups, repo) => {
            const language = repo.language || 'Other';
            if (!groups[language]) groups[language] = [];
            groups[language].push(repo);
            return groups;
        }, {});

        Object.keys(grouped).sort().forEach(language => {
            const group = document.createElement('div');
            group.className = 'repo-group';

            const heading = document.createElement('h4');
            heading.textContent = language;

            const list = document.createElement('ul');
            grouped[language]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(repo => {
                    const item = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = repo.html_url;
                    link.textContent = repo.name + (repo.fork ? ' (fork)' : '');
                    item.appendChild(link);
                    if (repo.description) {
                        const description = document.createElement('span');
                        description.textContent = ` ${repo.description}`;
                        item.appendChild(description);
                    }
                    list.appendChild(item);
                });

            group.append(heading, list);
            container.appendChild(group);
        });
    })
    .catch(() => {
        document.getElementById('repos').innerHTML =
            '<p class="muted">GitHub didn\'t return the repository list. You can see them all on ' +
            '<a href="https://github.com/W1ttyRat">github.com/W1ttyRat</a>.</p>';
    });
