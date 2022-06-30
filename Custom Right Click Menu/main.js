

const contextMenu = document.querySelector('.right-cl-menu'),
      optionMenu = document.querySelector('.option-menu');


const docEl = document.documentElement;

const setPosition = (top, left, rightContextMenu = true) => {
    contextMenu.style.top = `${top + 15}px`;
    contextMenu.style.left = `${left + 15}px`;

    // If cursor near viewport right then move option menu 
    !rightContextMenu ? 
        optionMenu.classList.add('active') : 
        optionMenu.classList.remove('active');
}

const openContextMenu = e => {
    // Block context menu of browser
    e.preventDefault();

    if(contextMenu.style.display === 'block' && e.target !== contextMenu)
        contextMenu.style.display = 'none';
    
    // Position of menu when appear
    else {
        // Display custom context menu
        contextMenu.style.display = 'block';
        
        // Get height and width of context menu
        const menuCoord = contextMenu.getBoundingClientRect();

        // cursor near viewport right and bottom
        if(
            e.y + menuCoord.height >= docEl.clientHeight &&
            e.x + menuCoord.width * 2 > docEl.clientWidth
        )
            setPosition(e.y - menuCoord.height, e.x - menuCoord.width, false);
        // cursor near viewport bottom
        else if(e.y + menuCoord.height >= docEl.clientHeight) 
            setPosition(e.y - menuCoord.height , e.x);
        
        // cursor near viewport right
        else if(e.x + menuCoord.width > docEl.clientWidth) 
            setPosition(e.y, e.x - menuCoord.width, false);
        else setPosition(e.y, e.x);        

    }
}

const closeContextMenu = () => contextMenu.style.display = 'none';

const preventTurnOffMenu = e => {
    e.preventDefault();
    
    // Prevent click event and context menu of document 
    e.stopImmediatePropagation();
}


document.addEventListener('contextmenu', openContextMenu);
document.addEventListener('click', closeContextMenu);

contextMenu.addEventListener('click', preventTurnOffMenu);
contextMenu.addEventListener('contextmenu', preventTurnOffMenu);


/**
 * stopPropagation will prevent any parent handlers from being executed.
 *  
 * stopImmediatePropagation will prevent any parent handlers 
   and also any other handlers from executing 
 */