// Roll & Ruin page: the rolling die, the looping gameplay clip, land particles and scroll
// reveal. Everything here is decoration: with JavaScript off the page shows all its content.
(function () {
    "use strict";

    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    // ---- The die: rolls once on load and on every tap ----
    var die = document.getElementById("die");
    var face = document.getElementById("die-face");
    var note = document.getElementById("die-note");
    var LINES = ["", "A 1. Nudge it?", "A 2. Short hop.", "A 3. Steady.", "A 4. Nice.", "A 5. Big stride.",
        "A 6! Off you go."];
    var rolling = false;

    function show(value) {
        face.src = "img/die_" + value + ".png";
    }

    function roll(announce) {
        if (rolling) {
            return;
        }
        var value = 1 + Math.floor(Math.random() * 6);
        if (calm) {
            show(value);
            note.textContent = LINES[value];
            return;
        }
        rolling = true;
        die.classList.remove("landed");
        die.classList.add("rolling");
        var ticks = 0;
        var timer = setInterval(function () {
            show(1 + Math.floor(Math.random() * 6));
            ticks += 1;
            if (ticks >= 8) {
                clearInterval(timer);
                show(value);
                die.classList.remove("rolling");
                die.classList.add("landed");
                if (announce) {
                    note.textContent = LINES[value];
                }
                rolling = false;
            }
        }, 70);
    }

    if (die && face && note) {
        for (var n = 1; n <= 6; n += 1) {
            new Image().src = "img/die_" + n + ".png"; // so faces don't flicker in mid-roll
        }
        die.addEventListener("click", function () { roll(true); });
        if (!calm) {
            setTimeout(function () { roll(false); }, 600);
        }
    }

    // ---- The gameplay clip: plays only while on screen, never under reduced motion ----
    var clip = document.getElementById("loop");
    if (clip && calm) {
        clip.controls = true;
    } else if (clip && "IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                clip.play().catch(function () { clip.controls = true; });
            } else {
                clip.pause();
            }
        }, { threshold: 0.25 }).observe(clip);
    }

    // ---- Land particles: a few drifting pixels per card ----
    if (!calm) {
        document.querySelectorAll(".land").forEach(function (land) {
            for (var i = 0; i < 7; i += 1) {
                var bit = document.createElement("i");
                bit.style.left = Math.round(Math.random() * 95) + "%";
                bit.style.setProperty("--t", (4 + Math.random() * 4).toFixed(1) + "s");
                bit.style.setProperty("--d", (-Math.random() * 8).toFixed(1) + "s");
                bit.setAttribute("aria-hidden", "true");
                land.appendChild(bit);
            }
        });
    }

    // ---- Scroll reveal ----
    var hidden = document.querySelectorAll(".reveal");
    if (calm || !("IntersectionObserver" in window)) {
        hidden.forEach(function (el) { el.classList.add("in"); });
    } else {
        var seen = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    seen.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        hidden.forEach(function (el) { seen.observe(el); });
    }
}());
