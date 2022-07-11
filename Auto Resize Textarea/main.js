
'use strict';

/* VARIABLE */
const textArea = document.querySelector('textarea');

const init = () => textArea.value = '';

const autoResize = function(e) {
    textArea.style.height = `${60}px`;
    /*
        * The scrollHeight property returns the height of an element including padding, but excluding borders, scrollbars, or margins.
        * The scrollHeight property returns the height in pixels.
    */
    textArea.style.height = `${e.target.scrollHeight}px`;
}

textArea.addEventListener('keyup', autoResize);

window.addEventListener('load', init);