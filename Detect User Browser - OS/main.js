'use strict';

/* ========== VARIABLES ========== */

// Get info about user browser
const userAgent = navigator.userAgent;

// Determine user browser
let browser;
if(userAgent.match(/edge/i))
    browser = 'edge';
else if(userAgent.match(/firefox|fxios/i))
    browser = 'firefox';
else if(userAgent.match(/chrome|chromium|crios/i))
    browser = 'chrome';
else if(userAgent.match(/opr/i))
    browser = 'opera'
else if(userAgent.match(/safari/i))
    browser = 'safari';
else 
    browser = 'Alien browser';

// Determine user operation system
let os;
if(userAgent.match(/linux/i))
    os = 'linux';
else if(userAgent.match(/window/i))
    os = 'window';
else if(userAgent.match(/mac/i))
    os = 'macos';
else 
    os = 'unknown os';
const init = () => {
    document.querySelector(`.${browser}`).classList.add('active');
    document.querySelector(`.${os}`).classList.add('active');
}

window.addEventListener('load', init);