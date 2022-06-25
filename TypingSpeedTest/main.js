'use strict';

/* ========== VARIABLES ========== */

const input = document.querySelector('input'),
      time = document.querySelector('.time'),
      mistakes = document.querySelector('.mistakes'),
      wpm = document.querySelector('.wpm'),
      cpm = document.querySelector('.cpm'),
      btn = document.querySelector('.btn'),
      paragraph = document.querySelector('.paragraph'),
      errorChars = document.querySelector('.error-chars'),
      ratio = document.querySelector('.ratio'),
      level = document.querySelector('.level'),
      paragraphBox = document.querySelector('.paragraph-box');

paragraph.innerHTML = paragraph.innerText
                        .split('')
                        .map(c => `<span>${c}</span>`)
                        .join('');
              

let i, mistakesCount, wpmCount, cpmCount, timer, timeId, typingIncorrect;
const spanArr = document.querySelectorAll('.paragraph span');



/* ========== HANDLER FUNCTION ========== */

const init = () => {
    if(timeId)  clearInterval(timeId);
    time.textContent = `60s`;
    timer = 60;
    mistakes.textContent = wpm.textContent = cpm.textContent = 0;
    i = mistakesCount = wpmCount = cpmCount = 0;
    errorChars.textContent = input.value = ratio.textContent = level.textContent = '';
    typingIncorrect = new Set();
    spanArr.forEach(span => span.classList.remove('correct', 'incorrect'));
}

const calcScoreLevel = score => {
    if(score < 30) return 'D';
    else if(score >= 30 && score < 50)  return 'C';
    else if(score >= 50 && score < 70)  return 'B';
    else if(score >= 70 && score < 90)  return 'A';
    else return 'S';
}

const displayResult = () => {
    errorChars.textContent = [...typingIncorrect].join(' ');
    ratio.textContent = `${((cpmCount ? (1 - mistakesCount / cpmCount) : 0) * 100).toFixed(2)}%`;
    level.textContent = calcScoreLevel(wpmCount - mistakesCount / timer);

    // Turn off focus of input and turn off timer and disable input event of input
    input.blur();
    clearInterval(timeId);
    input.removeEventListener('input', checkTyping);
}

let numberWordToMove = 30,
    topPos  = 0;

const checkTyping = () => {
    let currentSpan = spanArr[i];
    let current = spanArr[i].textContent;

    // Change color of character that was typed
    if(current === input.value) {
        currentSpan.classList.add('correct');
    }
    else {
        currentSpan.classList.add('incorrect');
        
        // Push character incorrect to set
        typingIncorrect.add(current);

        // Count mistake
        mistakes.textContent = ++mistakesCount;
    }
    // Count word
    if(current === ' ')
        wpm.textContent = ++wpmCount;

    // Count character typed
    cpm.textContent = ++cpmCount;
    input.value = '';
    ++i;

    // Move viewport of paragraph box
    if(wpmCount >= numberWordToMove) {
        numberWordToMove += 30;
        topPos += 100;
        input.style.top = `${topPos}px`;
        paragraphBox.scrollTo({
            "behavior": "smooth",
            "top": topPos
        });
    }

    if(i >= spanArr.length)
        displayResult();
}

const startTyping = () => {
    btn.textContent = 'Try again';
    input.addEventListener('input', checkTyping);
    
    const tick = () => {
        // Decreate time
        time.textContent = `${--timer}s`;

        // If timer = 0 then 
        if(!timer) displayResult();
    }
    
    // return id of setInterval and fire timer 
    return setInterval(tick, 1000);
}


// Typing again, reset timeleft, mistakes, wpm, cpm,...
const reset = () => {
    init();
    timeId = startTyping();

    // Click button and focus input 
    input.focus();
}


init();
btn.addEventListener('click', reset);

