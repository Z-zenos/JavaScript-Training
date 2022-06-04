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
      searching = document.querySelector('.searching');



/* ========== EVENT HANDLER ========== */

// Clear input
const clearInput = () => {
    input.value = '';
    btnDelete.classList.remove('active');
}

const searchWord = (e = '') => {
    if(!input.value) btnDelete.classList.remove('active');
    else btnDelete.classList.add('active');
    
    if(e.key === 'Enter') displayUI();
}

input.value = '';
searchWord();

const getWordAPI = wordInput => {

    // Remove guide
    guide.style.display = 'none';
    searching.style.display = 'block';
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${wordInput}`)
        .then(data => {
            if(!data.ok)    throw new Error('Word unknown');
            return data.json();
        })
        .then(item => item[0])
        .catch(error => console.error(`ERROR: ${error.message} 💥`));
}
        

const displayUI = async function() {
    try {
        const wordDetails = await getWordAPI(input.value);
        console.log(wordDetails);

        // Delay searching ...
        await new Promise(resolve => setTimeout(resolve, 1000));
        searching.style.display = 'none'
        // Display UI


        // Word
        word.textContent = wordDetails.word;
        
        // Get sound and phonetic (prrority: us, uk)
        for(const p of wordDetails.phonetics) {
            if(p.text && p.audio) {
                phonetic.textContent = p.text;
                
                break;
            }

        }

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
        console.log(info);
       
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


    } catch (error) {
        console.error('Some thing went wrong');
    }
}


/* ========== FIRE EVENT ========== */

btnDelete.addEventListener('click', clearInput);
input.addEventListener('keyup', searchWord);
search.addEventListener('click', displayUI);

