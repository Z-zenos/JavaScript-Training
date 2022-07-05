const cookieBox = document.querySelector('.cookie'),
      btnEat = document.querySelector('.btn--solid'),
      btnLearnmore = document.querySelector('.btn--outline');

const init = () => {
    // Check whether cookie is set ?
    if(document.cookie) 
        // Close cookie box
        cookieBox.classList.remove('cookie--active');
    else 
        cookieBox.classList.add('cookie--active');
}

const eatCookie = () => {
    document.cookie = `creator: z-codev;`;
    if(document.cookie)
        cookieBox.classList.remove('cookie--active');
    else alert("Cookie can't be set! Please unblock this site from the cookie setting of your browser.");
}

btnEat.addEventListener('click', eatCookie);
window.addEventListener('load', init);