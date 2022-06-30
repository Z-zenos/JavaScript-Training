
'use strict';

/* ========== VARIABLES ========== */


const select = selector => document.querySelector(selector);

const btnListen = select('.listen'),
      btnShuffle = select('.btn-shuffle'),
      progress = select('.music__progress'),
      progressBar = select('.music__progress-bar'),
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
      maxTime = select('.music__max-time'),
      ulList = select('.list__lists'),
      list = select('.list');

const play_pause = btnListen.children,
      repeat_unrepeat = btnRepeat.children,
      heart_unheart = btnHeart.children,
      maxWidthProgress = Number.parseInt(window.getComputedStyle(progress).width);

let id,
    current,
    isPlaying,
    audio,
    timerId,
    isRepeat,
    isNewSong,
    duration,
    listSong;

/* ========== HANDLER FUNCTION ========== */

const createList = () => {
    ulList.innerHTML = '';
    album.forEach((s, i) => ulList.insertAdjacentHTML('beforeend', 
        `
            <li class="list__item ${isPlaying && i === id ? 'running' : ''} ${s.heart ? 'active' : ''}" data-id=${i}>
                <i class="fa-solid fa-heart"></i>
                <span class="list__number">${i}. </span>
                <div class="list__info">
                    <p class="list__name">${s.name.slice(0, 10) + '...'}</p>
                    <p class="list__author">${s.artist.slice(0, 10) + '...'}</p>
                </div>
                <div class="list__image">
                    <img src="${s.img}" alt="song image">
                </div>
            </li>
        `
    ));
    listSong = ulList.querySelectorAll('.list__item');
}

const init = () => {
    id = current = 0;
    isPlaying = false;
    clearInterval(timerId);
    isRepeat = false;
    isNewSong = true;
    renderSong(id);
    createList();
}

const switchify = box => [...box].forEach(icon => icon.classList.toggle('active'));

const repeat = () => {
    isRepeat = !isRepeat;
    switchify(repeat_unrepeat);
}

const heartify = () => {
    album[id].heart = !album[id].heart;
    listSong.forEach((l, i) => {
        l.classList.remove('active');
        album[i].heart && l.classList.add('active');
    });
    switchify(heart_unheart);
}

const handleTime = time => {
    time = Number.parseInt(time);
    const min = Number.parseInt(time / 60),
          second = time % 60
    return `${min}:${(second + '').padStart(2, '0')}`;   
}

const renderSong = id => {

    // Run progress bar
    progressBar.style.width = `${Number.parseInt(current * maxWidthProgress / duration)}px`;
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
    if(
        album[id].heart && heart_unheart[0].classList.contains('active') ||
        !album[id].heart && heart_unheart[1].classList.contains('active')
    )
        switchify(heart_unheart);        
}

const clearAudio = () => {
    // Remove current audio
    audio.pause();
    audio = null;
}

const reset = () => {
    // Auto play
    isPlaying = current > 0 ? false : true;
    
    // Reset current time audio
    currentTime.textContent = '0:00';
    audio.currentTime = current = 0;
    // audio.pause();
    clearInterval(timerId);
    // switchify(play_pause);
}

const tick = () => {
    // Run time
    currentTime.textContent = handleTime(++current);

    // Run progress bar
    progressBar.style.width = `${Number.parseInt(current * maxWidthProgress / duration)}px`;

    // If current time = max time 
    if(current === duration) {
        reset();
        if(!isRepeat)  {
            clearAudio();
            // To load new song 
            isNewSong = true;
            // Check last song
            id = id === album.length ? 0 : id + 1;
        }
        play();
    }
}

const play = () => {
    // Display UI and load source
    renderSong(id);

    isPlaying = !isPlaying;

    if(isPlaying) {
        [...play_pause].forEach(p => {
            p.classList.remove('active');
            if(p.classList.contains('fa-pause'))
                p.classList.add('active');
        });
        // Spin disk 
        listSong.forEach((l, i) => {
            l.classList.remove('running');
            if(i === id) l.classList.add('running');
        });
        // Play audio
        audio.play();
        timerId = setInterval(tick, 1000);
    }
    else {
        [...play_pause].forEach(p => {
            p.classList.remove('active');
            if(p.classList.contains('fa-play'))
                p.classList.add('active');
        });
        audio.pause();
        clearInterval(timerId);
    }
}

const moveProgress = e => {
    // Get distance between left viewport and position of progress
    const leftProgressCoords = e.currentTarget.getBoundingClientRect().left;
    
    // Get x coordinate of cursor 
    const xCursor = e.x;

    // Subtraction = current progress 
    const dest = xCursor - leftProgressCoords;
    progressBar.style.width = `${dest}px`;

    // Edit time of song 
    current = audio.currentTime = Number.parseInt(dest / maxWidthProgress * duration);
    currentTime.textContent = handleTime(current);
}

const shuffle = () => {
    if(!btnShuffle.classList.contains('active')) {
        for(let i = album.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));

            // skip current song (not shuffle)
            if(j === id) continue;
            // Swap
            [album[i], album[j]] = [album[j], album[i]];
        }
    }
    createList();
    btnShuffle.classList.toggle('active');
}

const nextSong = function() {
    reset();
    clearAudio();
    if(id + this >= album.length) 
        id = 0;
    else if(id + this < 0)      
        id = album.length - 1;
    else id += this;

    isNewSong = true;
    play();
}

const chooseSong = (e) => {
    // Check correct element
    const song = e.target.closest('.list__item');
    if(!song)   return;

    // Get song id
    id = +song.dataset.id;
    isNewSong = true;

    reset();
    clearAudio();
    play();
}

const displayList = () => list.classList.toggle('active');

window.addEventListener('load', init);
btnListen.addEventListener('click', play);
btnRepeat.addEventListener('click', repeat);
btnHeart.addEventListener('click', heartify);
progress.addEventListener('mousedown', moveProgress);
btnShuffle.addEventListener('click', shuffle);

btnForward.addEventListener('click', nextSong.bind(1));    // +1 -> next song 
btnBackward.addEventListener('click', nextSong.bind(-1));  // -1 -> previos song
ulList.addEventListener('click', chooseSong);
btnList.addEventListener('click', displayList);
