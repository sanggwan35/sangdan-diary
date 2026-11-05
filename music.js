const musicList = [
    {
        title: "Like A Raspberry",
        src: "music/Like A Raspberry.mp3"
    },
    {
        title: "Love song",
        src: "music/Love song.mp3"
    },
    {
        title: "Kataomoi",
        src: "music/Kataomoi.mp3"
    },
    {
        title: "Tsukue Sasuru",
        src: "music/Tsukue Sasuru.mp3"
    },
    {
        title: "毎朝",
        src: "music/毎朝.mp3"
    }
];

let currentMusicIndex =
    Number(localStorage.getItem("musicIndex")) || 0;

let musicPosition =
    Number(localStorage.getItem("musicPosition")) || 0;

let musicVolume =
    Number(localStorage.getItem("musicVolume"));

if (isNaN(musicVolume)) {
    musicVolume = 0.5;
}

function saveMusicState(audio) {
    localStorage.setItem(
        "musicIndex",
        currentMusicIndex
    );

    localStorage.setItem(
        "musicPosition",
        audio.currentTime
    );

    localStorage.setItem(
        "musicVolume",
        audio.volume
    );
}

const musicAudio = document.createElement("audio");
musicAudio.id = "music-audio";
musicAudio.volume = musicVolume;

document.body.appendChild(musicAudio);

const musicPlayer = document.createElement("div");
musicPlayer.id = "music-player";

musicPlayer.innerHTML = `
    <button id="music-prev">⏮</button>
    <button id="music-play">▶</button>
    <button id="music-next">⏭</button>
    <span id="music-title"></span>
    <input id="music-volume" type="range" min="0" max="1" step="0.01">
`;

document.body.appendChild(musicPlayer);

const musicPlay = document.getElementById("music-play");
const musicPrev = document.getElementById("music-prev");
const musicNext = document.getElementById("music-next");
const musicTitle = document.getElementById("music-title");
const musicVolumeControl = document.getElementById("music-volume");

musicVolumeControl.value = musicVolume;

function loadMusic(index, resume = true) {
    currentMusicIndex = index;

    musicAudio.src = musicList[index].src;
    musicTitle.textContent = musicList[index].title;

    if (resume && index === Number(localStorage.getItem("musicIndex"))) {
        musicAudio.addEventListener(
            "loadedmetadata",
            () => {
                musicAudio.currentTime = musicPosition;
            },
            { once: true }
        );
    }
}

musicPlay.addEventListener("click", async () => {
    if (musicAudio.paused) {
        await musicAudio.play();
        musicPlay.textContent = "⏸";
    } else {
        musicAudio.pause();
        musicPlay.textContent = "▶";
        saveMusicState(musicAudio);
    }
});

musicPrev.addEventListener("click", () => {
    currentMusicIndex =
        (currentMusicIndex - 1 + musicList.length) % musicList.length;

    loadMusic(currentMusicIndex, false);
    musicAudio.play();
    musicPlay.textContent = "⏸";
});

musicNext.addEventListener("click", () => {
    currentMusicIndex =
        (currentMusicIndex + 1) % musicList.length;

    loadMusic(currentMusicIndex, false);
    musicAudio.play();
    musicPlay.textContent = "⏸";
});

musicVolumeControl.addEventListener("input", () => {
    musicAudio.volume = Number(musicVolumeControl.value);
    saveMusicState(musicAudio);
});

musicAudio.addEventListener("timeupdate", () => {
    localStorage.setItem(
        "musicPosition",
        musicAudio.currentTime
    );
});

musicAudio.addEventListener("ended", () => {
    musicNext.click();
});

loadMusic(currentMusicIndex);