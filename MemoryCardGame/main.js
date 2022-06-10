
/* ========== VARIABLES ========== */

const moves = document.querySelector('.moves'),
      time = document.querySelector('.time'),
      playArea = document.querySelector('.memory__play'),
      card = document.querySelectorAll('.card'),
      btn = document.querySelector('.btn'),
      resultText = document.querySelector('.resultText');


let pokemonArr,
    twoPokemon,
    flipNum,
    move,
    second,
    timerId,
    numberCardsFlipped;


/* ========== HANDLER FUNCTION ========== */

// Create random position for each image
const shuffle = () => {
    for(let i = pokemonArr.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        // Swap
        [pokemonArr[i], pokemonArr[j]] = [pokemonArr[j], pokemonArr[i]];
    }
}

// Random pokemon image
const createRandomPokemons = () => {
    let randImgNum;
    for(let i = 0; i < 8; i++) {
        // Random image from Images folder
        randImgNum = Math.floor(Math.random() * 898) + 1;
        pokemonArr.push({
            id: i,
            src: `images/${(randImgNum + '').padStart(3, '0')}.png`
        });
    }

    pokemonArr = [...pokemonArr, ...pokemonArr];
    shuffle();

    // Display UI
    pokemonArr.forEach(pok => playArea.insertAdjacentHTML('beforeend', `
        <div class="card">
            <div class="card__side card__side--front">?</div>
            <div class="card__side card__side--back">
                <img src=${pok.src} alt="pokemon image" class="card__img" data-id=${pok.id}>
            </div>
        </div>
    `));
}

const init = () => {
    clearInterval(timerId);
    playArea.innerHTML = '';
    pokemonArr = [];
    twoPokemon = [];
    moves.textContent = flipNum = move = second = numberCardsFlipped = 0;
    time.textContent = '0s';
    resultText.textContent = 'You Win !';
    resultText.classList.remove('active');
    playArea.classList.add('memory__play--active');
    createRandomPokemons();
}

// Compare 2 image when they are flipped
const compare = () => {

    // Compare base id
    if(twoPokemon[0].id !== twoPokemon[1].id) {
        twoPokemon.forEach(p => p.card.classList.remove('card__active'));
    }
    else {
     
        numberCardsFlipped += 2;

        // If flipped all card then win game
        if(numberCardsFlipped === pokemonArr.length) {
            resultText.classList.add('active');
            clearInterval(timerId);
        }
    }

    // Reset twoPokemon array and flipNum for next times
    twoPokemon = [];
    flipNum = 0;
    playArea.classList.toggle('memory__play--active');
}

const flipCard = (e) => {
    const side = e.target;
    let parent;
    
    if(side.classList.contains('card__side')) {
        ++flipNum;
        moves.textContent = ++move;
        parent = side.parentElement;
        parent.classList.add('card__active');
        twoPokemon.push({
            card: parent,
            id: parent.querySelector('.card__img').dataset.id
        });
    }

    // If enough 2 twice flip then compare 
    if(flipNum === 2) {
        // Prevent click 3rd, 4th... image when comparing 2 image that were clicked
        playArea.classList.toggle('memory__play--active');
        setTimeout(compare, 1000);
    }
}

const startGame = () => {
    init();

    // Remove pointer-events property to play
    playArea.classList.remove('memory__play--active');
    timerId = setInterval(() => {
        time.textContent = `${++second}s`;

        // if timeout and number card that were flipped less than total cards then game over
        if(second === 60 && numberCardsFlipped < pokemonArr.length) {
            resultText.textContent = 'You Loss !';
            resultText.classList.add('active');
            playArea.classList.add('memory__play--active');
            clearInterval(timerId);
        }

    }, 1000);
    btn.textContent = 'Restart';
}


/* ========== EVENT ========== */

playArea.addEventListener('click', flipCard);
btn.addEventListener('click', startGame);
window.addEventListener('load', init);
