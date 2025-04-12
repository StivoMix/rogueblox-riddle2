async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function crptyString(text) {
    let result = '';
    for (let index = 0; index < text.length; index++) {
        result += String.fromCharCode(text.charCodeAt(index) + index);
    }
    return result;
}

const orbHashes = {
1: "0858d974deae352fcd99a8b63fd6d8b1b8d3cff63d81b89b6d40726cb88ddc28",
2: "edacbc854c960eccadaeff8970b3af304caeeff297535e980148bf5ba3c6b411",
3: "99e5c5fbe217ebdf4b64be68c35b260fe3c940ae639fb30ccbf7c9f18b953c85",
4: "d419943286c1501493a52a0f74aaa7e61d183a3a1460d22333e3e192e3c2fb7f",
5: "3d4739b5b4441635b245af22ad509e8f8384a6f5ac4f8d7e887a4a9d77dfa2b5",
6: "0e408a44d72aa3ba09fb86ad2ba510a759581954affd4ac7ed85236d78a67711"
};
const finalHash = "f619da3480fe82d3a09ac2b6e9235197c3948cc64b6c5fd2085596c4655a357e";
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
        markOrbUnlocked(1, crptyString("HNUIN<CL="));
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
        1: "Reach out tenfold to find the howl...",
        2: "Leap into the void of tundra and shout the sacred words.",
        3: "The prowler encrypts again... for the third time.",
        4: "I am in every banner. Four letters long.",
        5: "He who taught humanity the art of ultimate assassination.",
        6: "A fortress shaped like fallen angels, my very own..."
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

function runEncrypt() { 
    const input = document.getElementById("cryptInput").value.trim();
    const result = crptyString(input);
    document.getElementById("cryptOutput").textContent = result || "Encrypted result will appear here.";
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

function playHoverOSound() {
    const hoverOSound = document.getElementById("hoverOSound");
    hoverOSound.currentTime = 0;
    hoverOSound.loop = true;
    hoverOSound.play();
}

function stopHoverOSound() {
    const hoverOSound = document.getElementById("hoverOSound");
    hoverOSound.pause();
    hoverOSound.currentTime = 0;
}

document.querySelectorAll(".orb").forEach(orb => {
    orb.addEventListener("mouseenter", playHoverOSound);
    orb.addEventListener("mouseleave", stopHoverOSound);
});