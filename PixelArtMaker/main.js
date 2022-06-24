
/* ================ VARIABLE ================ */

const pixel = document.querySelector('.pixel'),
      canvas = document.getElementById('canvas'),
      colorList = document.querySelectorAll('.pixel__gallery .color'),
      root = document.documentElement,
      eraser = document.querySelector('.tool--erase'),
      images = document.querySelectorAll('img'),
      gallery = document.querySelector('.pixel__gallery'),
      btnNew = document.querySelector('.new'),
      btnPen = document.querySelector('.tool--paint');

let currentColor,
    ctx,
    coordX, coordY,
    mode;

const _color_black_ = '#000',
      _color_white_ = '#fff',
      _color_grey_ = '#e0e0e0',
      _color_hover_ = '#bfbfbf';

const popularColors = [
    "#F20505", "#05F2DB", "#F2CB05", "#F28705",
    "#4630D9", "#D90467", "#000000", "#B8BF84",
    "#BF04A0", "#BFBFBF", "#F2F2F2", "#02735E"
];


const cursors = {
    pen: "auto",
    erase: "url('./cursor/Eraser-icon.png'), auto"
}


/* ================ HANDLE EVENT ================ */

const createGrid = () => {
    // Unit is rem 
    const width = 60;   // 60 rem = 600px
    const height = 50;
    
    // Rendering context and draw functions
    ctx = canvas.getContext('2d');

    // Default color of grid canvas
    let first = _color_white_, second = _color_grey_;

    for(let i = 0; i < height; i++) {
        // Swap color 
        [first, second] = [second, first];
        for(let j = 0; j < width; j++) {
            ctx.fillStyle = j % 2 ? first : second;
            ctx.fillRect(j * 10, i * 10, 10, 10);
        }
    }
}

// this = [mode, urlCursor]
const changeMode = function() {
    mode = this[0];
    canvas.style.cursor = this[1];
}

const init = () => {
    currentColor = _color_black_;
    changeMode.call(['paint', cursors.pen]);

    // Create colors table 
    [...colorList].forEach((c, i) => c.style.backgroundColor = popularColors[i]);
    
    // Create grid area for painting
    createGrid();

    coordX = canvas.getBoundingClientRect().x - pixel.getBoundingClientRect().x;
    coordY = canvas.getBoundingClientRect().y - pixel.getBoundingClientRect().y;
}

// Function for drawing color in canvas
const drawPixel = (x, y, color1, color2) => {
    ctx.fillStyle = (x + y) / 10 % 2 === 0 ? color1 : color2; 
    ctx.fillRect(x, y, 10, 10);
}

const tools = e => {
    e.preventDefault();
    
    // Round coord of box that is clicked
    const x = Math.trunc((e.layerX - coordX) / 10) * 10,
          y = Math.trunc((e.layerY - coordY) / 10) * 10;

    // Draw
    if(mode === 'paint') {
        
        drawPixel(x, y, currentColor, currentColor);
    }

    // Erase
    if(mode === 'erase') { 
        // The cells in the even position will be white (the position where the sum of the x and y coordinates is an even number is called an even cell).
        // Erase 4 cell
        drawPixel(x, y, _color_white_, _color_grey_);
        drawPixel(x + 10, y, _color_white_, _color_grey_);
        drawPixel(x, y + 10, _color_white_, _color_grey_);
        drawPixel(x + 10, y + 10, _color_white_, _color_grey_);
    }
}


const pickColor = e => {
    currentColor = window.getComputedStyle(e.target).backgroundColor;
}

const hover = e => {
    e.preventDefault();
    
    // Round coord of box that is clicked
    const x = Math.trunc((e.layerX - coordX) / 10) * 10,
          y = Math.trunc((e.layerY - coordY) / 10) * 10;
    
    // Hover color 
    ctx.fillStyle = _color_hover_;
    ctx.fillRect(x, y, 10, 10);

    setTimeout(drawPixel.bind(null, x, y, _color_white_, _color_grey_), 100);
}




// use mousemove event instead of mouseover because mouse will change the first element while mouseover will change the second element.
const activatedMousemove = () => {
    canvas.removeEventListener('mousemove', hover);
    canvas.addEventListener('mousemove', tools);
}
const unActivatedMousemove = () => {
    canvas.addEventListener('mousemove', hover);
    canvas.removeEventListener('mousemove', tools);
}



// -------------- TOOLS ACTION ------------------

eraser.addEventListener('click', changeMode.bind(['erase', cursors.erase]));
btnPen.addEventListener('click', changeMode.bind(['paint', cursors.pen]));

// -----------------------------------------------




// -------------- INIT ACTION ------------------

window.addEventListener('load', init);
btnNew.addEventListener('click', init);

// -----------------------------------------------





// -------------- CANVAS ACTION ------------------

canvas.addEventListener('mousedown', activatedMousemove);
canvas.addEventListener('mouseup', unActivatedMousemove);
canvas.addEventListener('mouseout', unActivatedMousemove);
canvas.addEventListener('click', tools);
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('mousemove', hover);

// -----------------------------------------------

gallery.addEventListener('click', pickColor);




