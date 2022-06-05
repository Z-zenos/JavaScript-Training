'use strict';

/* ========== VARIABLES ========== */
const input = document.querySelector('input'),
      btnDelete = document.querySelector('.fa-xmark'),
      search = document.querySelector('.search'),
      word = document.querySelector('.word'),
      phonetic = document.querySelector('.phonetic'),
      volumne = document.querySelector('.fa-volume-high'),
      partOfSpeech = document.querySelector('.part-of-speech'),
      infoBox = document.querySelector('.info'),
      details = document.querySelector('.details'),
      guide = document.querySelector('.guide'),
      searching = document.querySelector('.searching'),
      soundErr = document.querySelector('.sound-error'),
      searchErr = document.querySelector('.search-error');


let synonyms,
    audio;

/* ========== EVENT HANDLER ========== */

// Clear input
const clearInput = () => {
    input.value = '';
    btnDelete.classList.remove('active');
}

// Search by entering when type letter in input
const searchWord = (e = '') => {
    if(!input.value) {
        btnDelete.classList.remove('active');
        search.classList.remove('active');
    }
    else {
        search.classList.add('active');
        btnDelete.classList.add('active');
    }
    if(e.key === 'Enter') displayUI();
}

// Search by clicking synonym in synonym box
const searchFromSynonym = () => {
    // search handler for synonym
    synonyms = Array.from(document.querySelectorAll('.synonyms'));
    synonyms.forEach(synBox => synBox.addEventListener('click', e => {
        // Event delegation
        if(e.target.classList.contains('synonym')) {
            input.value = e.target.textContent;
            displayUI.call(e.target.textContent);
        }
    }));
}

// Emit pronunciation of word 
const play = () => {
    if(!audio) {
        soundErr.style.opacity = 1;
        setTimeout(() => soundErr.style.opacity = 0, 1000);
    }
    else audio.play();
}

input.value = '';
searchWord();

const getWordAPI = async wordInput => {

    // Remove guide
    guide.style.display = 'none';
    searching.style.display = 'block';

    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${wordInput}`)
        .then(data => {
            if(!data.ok) throw new Error('Word unknown');
            return data.json();
        })
        .then(item => item[0])
        .catch(error => error);
}     

const displayUI = async function() {
    try {
        const wordDetails = await getWordAPI(input.value);
        
        // Display UI
        searching.style.display = 'none';
        if(wordDetails instanceof Error)    throw new Error(wordDetails.message);
        searchErr.style.opacity = 0;

        // Word
        word.textContent = wordDetails.word;
        
        // Get sound and phonetic (prrority: us, uk)
        const [phonetics] = wordDetails.phonetics;
        phonetic.textContent = phonetics.text;
        audio = phonetics.audio ? new Audio(phonetics.audio) : null;
        
        // part of speech
        partOfSpeech.textContent = '';
        partOfSpeech.insertAdjacentHTML('beforeend', `
            ${wordDetails.meanings
                .map(pos => `<a href="#" class="link">${pos.partOfSpeech}</a>`)
                .join(', ')
            }
        `);
        
        // Meaning
        const info = wordDetails.meanings;
       
        details.textContent = '';
        details.insertAdjacentHTML(
            'beforeend', 
            info
                .map(w => `
                    <div class="type">
                        <p class="heading-type">${w.partOfSpeech}</p>
                        <div class="details-box meaning">
                            <h3 class="heading">Meaning</h3>
                            <p class="text">${w.definitions[0].definition}</p>
                        </div>
                        <div class="details-box example">
                            <h3 class="heading">Example</h3>
                            <p class="text">${w.definitions[0].example || 'none'}</p>
                        </div>
                        <div class="details-box synonyms">
                            <h3 class="heading">Synonyms</h3>
                            <p class="text">
                                ${
                                    w.synonyms
                                    .map(s => `<span class="link synonym">${s}</span>`)
                                    .join(', ') || 'none'
                                }
                            </p>
                        </div>
                    </div> 
                `)
                .join('')
        );

        infoBox.style.display = 'block';

        
        // Smooth scroll into position of part of speech in dictionary box when click link (part of speech)
        const type = Array.from(document.querySelectorAll('.type'));
        Array.from(document.querySelectorAll('.link')).forEach((l, i) => l.addEventListener('click', e => {
            e.preventDefault();
            type[i].scrollIntoView({ behavior: 'smooth' });
        }));

        // Attach click event for each synonym
        searchFromSynonym();
    } catch (error) {
        searchErr.style.opacity = 1;
        console.error(`ERROR: ${error.message} 💥`);
    }
}

/* ========== FIRE EVENT ========== */

btnDelete.addEventListener('click', clearInput);
input.addEventListener('keyup', searchWord);
search.addEventListener('click', displayUI);
volumne.addEventListener('click', play);

