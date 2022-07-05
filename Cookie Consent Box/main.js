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
    // Add expire date is tomorrow from setted
    const now = new Date();
    const tomorrow = now.setDate(now.getDate() + 1);
    document.cookie = `username: z-codev; expires=${new Date(tomorrow)}`;
    if(document.cookie)
        cookieBox.classList.remove('cookie--active');
    else alert("Cookie can't be set! Please unblock this site from the cookie setting of your browser.");
}

btnEat.addEventListener('click', eatCookie);
window.addEventListener('load', init);

/*
    * Cookies are data, stored in small text files, on your computer.
    * When a web server has sent a web page to a browser, the connection is shut down, and the server forgets everything about the user.
    * Cookies were invented to solve the problem "how to remember information about the user":
    * When a user visits a web page, his/her name can be stored in a cookie.
    * Next time the user visits the page, the cookie "remembers" his/her name.
    * When a browser requests a web page from a server, cookies belonging to the page are added to the request. This way the server gets the necessary data to "remember" information about users.
*/