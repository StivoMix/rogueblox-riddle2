async function sha256(text) {
    const encoder = new TextEncoder(); //test
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const orbHashes = {
2: "d49b0c040fd87532f032f4409e1af8cdb61b5929bb236b3c1f18d2978fa8ac61",
3: "7467cb862f48ac6ca60696b165134ac270df81371c8763f1de25a78a0da24b51",
4: "11eed40bb457ee437ab2bd533029d9c957dae9a8694d34182bdd0b9a09db6948",
5: "3d4739b5b4441635b245af22ad509e8f8384a6f5ac4f8d7e887a4a9d77dfa2b5",
6: "fbe450db8d3d7c979b89d17d49244ecd7f26b3f2402a48d4b0be934ff8254397"
};
const finalHash = "0c6a4db935efffad10ca1677958cdcb8a5955d49d1ff8a84b6839c2aeb029f67";
const orbStates = JSON.parse(localStorage.getItem('orbStates')) || { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };
const orbCodes = JSON.parse(localStorage.getItem('orbCodes')) || {};
let orb1Clicks = 0;

function saveProgress() {
    localStorage.setItem('orbStates', JSON.stringify(orbStates));
    localStorage.setItem('orbCodes', JSON.stringify(orbCodes));
}

function markOrbUnlocked(orbNum, code) {
    orbStates[orbNum] = true;
    orbCodes[orbNum] = code;
    displayOrbCode(orbNum, code);
    const unlockSound = document.getElementById("unlockSound");
    unlockSound.currentTime = 0;
    unlockSound.play();

    const orbElement = document.querySelector(`.orb:nth-child(${orbNum})`);
    if (orbElement) {
        orbElement.classList.add("unlocked");
    }

    saveProgress();
    checkAllOrbsCollected();
}

function clickOrb(orbNum) {
    if (orbNum === 1 && !orbStates[1]) {
        orb1Clicks++;
        if (orb1Clicks >= 10) {
        markOrbUnlocked(1);
        }
    }
}

function displayOrbCode(orbNum, code) {
    const orbCodeElement = document.getElementById(`orb${orbNum}-code`);
    if (orbCodeElement) {
        orbCodeElement.textContent = code || "(unlocked)";
    }
}

async function submitCode() {
    const input = document.getElementById("codeInput").value.trim();
    const hashedInput = await sha256(input);

    for (let i = 1; i <= 6; i++) {
        if (!orbStates[i] && hashedInput === orbHashes[i]) {
        markOrbUnlocked(i, input);
        return;
        }
    }

    alert("Invalid or already used code.");
}

function showHint() {
    const val = document.getElementById("hintSelect").value;
    const hints = {
        1: `The code is not a number found in books or deep in caves,
            Nor is it hidden in the shadows where the hollow behaves.
            To move ahead, you must ignore the five who stand in line,
            And focus on the pioneer, the one who starts the design.
            It holds the weight of all your fingers, a double-digit soul,
            A cycle finished, a decade reached, to make the vision whole.
            Don't seek a sequence, don't seek a key, or symbols in the dark,
            Just wake the First with constant taps to light the final spark`,
        2: `I am built of gears and metal skin,
            Born from a forge where the humans begin.
            I need no breath, I feel no pain,
            And oil, not blood, flows through my vein.
            I am the future in a child's frame,
            Tell me now, what is my name?`,
        3: `I wear no crown, yet I bring the law,
            A silent threat that makes the chaotic drawl.
            Through the desert sands, I seek my foe,
            Trading silver to make my justice grow.
            Order is my weapon, vengeance in my soul,
            Which class plays this role?`,
        4: `I rule a realm of permanent shade,
            Where all dead souls are finally laid.
            When your crimson journey comes to an end,
            I am the keeper, I am the friend.
            Give me your past, your burdens, your strife,
            And I shall grant you a brand new life.
            Who am I?`,
        5: `I dwell where the frozen tundra sighs,
            In a cathedral built of darkened skies.
            A whisper, a flash, a breath you take,
            I am the final choice you make.
            I hold the steel that kings must fear,
            And teach the craft of a silent tear.
            For the Blackmoon, I bring the night,
            Who am I?`,
        6: `I am the change that the daybreak brings,
            A soul that flies on solar wings.
            Not born of earth, but of sky and flame,
            Helergic power is my true name.
            With every breath, the heat I sow,
            The Sun’s own light begins to glow.
            What am I?`
    };
    document.getElementById("hintText").textContent = hints[val];
}

async function submitFinal() {
    const entered = document.getElementById("finalInput").value.trim();
    const hashed = await sha256(entered);
    if (hashed === finalHash) {
        sessionStorage.setItem("authenticated", btoa("true"));
        window.location.href = "correct.html";
        playVictoryAnimation();
    } else {
        alert("Wrong final password!");
    }
}

function checkAllOrbsCollected() {
    const allCollected = Object.values(orbStates).every(state => state === true);
    if (allCollected) {
        document.getElementById("final-section").style.display = "block";
        document.getElementById("submit-section").style.display = "none";
        document.getElementById("hint-box").style.display = "none";
        document.getElementById("finalHint").style.display = "block";
    }
}

function resetOrbs() {
    localStorage.removeItem('orbStates');
    localStorage.removeItem('orbCodes');
    location.reload();
}

window.onload = () => {
    const savedStates = JSON.parse(localStorage.getItem("orbStates"));
    const savedCodes = JSON.parse(localStorage.getItem("orbCodes"));

    if (savedStates) {
        Object.assign(orbStates, savedStates);
    }
    if (savedCodes) {
        Object.assign(orbCodes, savedCodes);
    }

    for (let i = 1; i <= 6; i++) {
        if (orbStates[i]) {
        displayOrbCode(i, orbCodes[i]);
        const orbElement = document.querySelector(`.orb:nth-child(${i})`);
        if (orbElement) {
            orbElement.classList.add("unlocked");
        }
        }
    }

    checkAllOrbsCollected();
};

function playHoverSound() {
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.currentTime = 0;
    hoverSound.play();
}

function playClickSound() {
    const clickSound = document.getElementById("clickSound");
    clickSound.currentTime = 0;
    clickSound.play();
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseover", playHoverSound);
    button.addEventListener("click", playClickSound);
});

function playSelectionSound() {
    const selectionSound = document.getElementById("selectionSound");
    selectionSound.currentTime = 0;
    selectionSound.play();
}

function playSelectSound() {
    const selectSound = document.getElementById("selectSound");
    selectSound.currentTime = 0;
    selectSound.play();
}

const hintSelect = document.getElementById("hintSelect");
hintSelect.addEventListener("focus", playSelectionSound);
hintSelect.addEventListener("change", playSelectSound);

function playInputFocusSound() {
    const inputFocusSound = document.getElementById("inputFocusSound");
    inputFocusSound.currentTime = 0;
    inputFocusSound.play();
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", playInputFocusSound);
});

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const volumeSlider = document.getElementById("volumeSlider");

musicToggle.addEventListener("change", () => {
    if (musicToggle.checked) {
        bgMusic.volume = volumeSlider.value;
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
});

volumeSlider.addEventListener("input", () => {
    bgMusic.volume = volumeSlider.value;
});



