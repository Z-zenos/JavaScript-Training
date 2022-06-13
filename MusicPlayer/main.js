
'use strict';

/* ========== VARIABLES ========== */


const select = selector => document.querySelector(selector);

const btnListen = select('.listen'),
      btnShuffle = select('.btn-shuffle'),
      btnProgress = select('.music__progress'),
      btnBackward = select('.btn-backward'),
      btnForward = select('.btn-forward'),
      btnList = select('.btn-list-music'),
      btnHeart = select('.heart'),
      btnRepeat = select('.repeat'),
      image = select('.music__img'),
      nameSong = select('.music__name'),
      author = select('.music__author'),
      btnOpt = select('.btn-option'),
      currentTime = select('.music__current-time'),
      maxTime = select('.music__max-time');

const play_pause = btnListen.children,
      repeat_unrepeat = btnRepeat.children,
      heart_unheart = btnHeart.children;

let id,
    current,
    isPlaying,
    audio,
    timerId,
    isRepeat,
    isNewSong,
    duration;

/* ========== HANDLER FUNCTION ========== */

const init = () => {
    id = current = 0;
    isPlaying = false;
    clearInterval(timerId);
    isRepeat = false;
    isNewSong = true;
    renderSong(id);
}

const switchify = box => [...box].forEach(icon => icon.classList.toggle('active'));

const repeat = () => {
    isRepeat = !isRepeat;
    switchify(repeat_unrepeat);
}

const heartify = () => {
    album[id].heart = !album[id].heart;
    switchify(heart_unheart);
}

const handleTime = time => {
    time = Number.parseInt(time);
    const min = Number.parseInt(time / 60),
          second = time % 60
    return `${min}:${(second + '').padStart(2, '0')}`;   
}

const renderSong = id => {
    if(!isNewSong)  return;

    isNewSong = false;

    // Load and display image;
    image.src = album[id].img;

    // Load audio
    audio = new Audio(album[id].src);

    // Display max time
    audio.onloadedmetadata = () => {
        duration = Math.floor(audio.duration);
        maxTime.textContent = handleTime(duration);
    };


    // Display name, author
    nameSong.textContent = album[id].name;
    author.textContent = album[id].artist;

    // Display heart
    if(album[id].heart) 
        btnHeart.classList.add('fa-solid');
}


const play = () => {
    // Display UI and load source
    renderSong();

    isPlaying = !isPlaying;
    // Switch play icon and pause icon 
    switchify(play_pause);

    if(isPlaying) {
        const tick = () => {
            // Run time
            currentTime.textContent = handleTime(++current);
    
            // If current time = max time 
            if(current === duration) {
                currentTime.textContent = '0:00';
                current = 0;
                // audio.pause();
                clearInterval(timerId);

                // Auto play
                isPlaying = false;
                if(!isRepeat) {
                    // To load new song 
                    isNewSong = true;

                    // Check last song
                    id = id === album.length ? 0 : id + 1;
                    renderSong(id);
                }
                play();
            }
        }
        
        // Play audio
        tick();
        audio.play();
        timerId = setInterval(tick, 1000);
    }
    else {
        audio.pause();
        clearInterval(timerId);
    }
}

window.addEventListener('load', init);
btnListen.addEventListener('click', play);
btnRepeat.addEventListener('click', repeat);
btnHeart.addEventListener('click', heartify);