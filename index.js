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

