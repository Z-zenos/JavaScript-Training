'use strict';

/* ================ VARIABLE ================ */

const pixel = document.querySelector('.pixel'),
      canvas = document.getElementById('canvas'),
      colorList = document.querySelectorAll('.pixel__gallery .color'),
      root = document.documentElement,
      eraser = document.querySelector('.tool--erase'),
      images = document.querySelectorAll('img'),
      gallery = document.querySelector('.pixel__gallery'),
      btnNew = document.querySelector('.new'),
      btnPen = document.querySelector('.tool--paint'),
      btnImport = document.querySelector('.import'),
      btnExport = document.querySelector('.export'),
      btnAddColor = document.querySelector('.tool--more-color'),
      btnText = document.querySelector('.tool--text'),
      btnBrush = document.querySelector('.tool--brush'),
      inputFile = document.getElementById('upload'),
      inputColor = document.querySelector('input[type="color"]'),
      inputText = document.querySelector('input[type="text"]');

let currentColor,       // curent color used to draw
    ctx,                // context of canvas 
    coordX, coordY,     // the origin of the coordinates axis of the canvas relative to the pixel box
    mode,               // mode: paint, erase, text...
    isHover,            // control hover in canvas
    img,                // import Image
    coordText,          // the origin of the coordinates axis of the text entered
    colOdd;             // check y coordinate is odd ?

const _color_black_ = '#000000',
      _color_white_ = '#ffffff',
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
    // ctx.createImageData(0, 0, width, height);

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
    inputText.value = "";
    img = new Image();
    isHover = true;
    currentColor = _color_black_;
    changeMode.call(['paint', cursors.pen]);

    // Create colors table 
    [...colorList].forEach((c, i) => c.style.backgroundColor = popularColors[i]);
    
    // Create grid area for painting
    createGrid();

    
    coordX = canvas.getBoundingClientRect().x - pixel.getBoundingClientRect().x;
    coordY = canvas.getBoundingClientRect().y - pixel.getBoundingClientRect().y;

    canvas.addEventListener('mousemove', hover);
}

// Function for drawing color in canvas
const drawPixel = (x, y, color1 = _color_white_, color2 = _color_grey_) => {
    ctx.fillStyle = (x + y) / 10 % 2 === 0 ? color1 : color2; 
    ctx.fillRect(x, y, 10, 10);
}

const drawText = function (e) {
    // If text position reach canvas edge then enter new line
    if(coordText.x >= 590) {
        colOdd = coordText.x === 590 ? true : false;
        coordText.x = 0;
        coordText.y += 30;
    }

    if(e.key === "Backspace") {
        if(coordText.x <= 0) {
            coordText.x = colOdd ? 590 : 600;
            coordText.y -= 30;
        }
        drawPixel(coordText.x - 20, coordText.y);
        drawPixel(coordText.x - 10, coordText.y);
        drawPixel(coordText.x - 20, coordText.y + 10);
        drawPixel(coordText.x - 10, coordText.y + 10);
        drawPixel(coordText.x - 20, coordText.y + 20);
        drawPixel(coordText.x - 10, coordText.y + 20);
        coordText.x -= 20;
    }
    // Not fire for key such as shift, ctrl, alt, tab...
    else if(e.keyCode >= 32) {
        ctx.fillStyle = currentColor;
        // If 20 is not added into y coord, the text will appear in the box immediately above (because the coordinate system is reversed from normal).
        ctx.fillText(inputText.value, coordText.x, coordText.y + 20);
        // Each letter will place 6 cells
        coordText.x += 20;
    }
    inputText.value = "";
}

const tools = e => {
    e.preventDefault();

    // Fire hover event
    isHover = true;
    canvas.addEventListener('mousemove', hover);
    
    // Round coord of box that is clicked
    let x = Math.trunc((e.layerX - coordX) / 10) * 10,
        y = Math.trunc((e.layerY - coordY) / 10) * 10;

    switch (mode) {
        case 'paint':
            drawPixel(x, y, currentColor, currentColor);
            break;
    
        case 'erase': 
            // The cells in the even position will be white (the position where the sum of the x and y coordinates is an even number is called an even cell).
            // Erase 4 cell
            drawPixel(x, y);
            drawPixel(x + 10, y);
            drawPixel(x, y + 10);
            drawPixel(x + 10, y + 10);
            break;

        case 'text':
            inputText.focus();
    
            // Get coord of text
            coordText = {
                x: x,
                y: y
            }
            
            // Stop hover event
            isHover = false;
            canvas.removeEventListener('mousemove', hover);
            // Set font-family and font-size of text
            ctx.font = `19px old1982`;
            break;

        case 'brush':
            break;
        default:
            break;
    }
}

// Convert rgb(red, green, blue) to hexa color
const rgbToHex = (r, g, b) => '#' + [r, g, b]
                                        .map(x => x.toString(16)
                                        .padStart(2, '0'))
                                        .join('')
                                        .toUpperCase();

const pickColor = e => {
    currentColor = window.getComputedStyle(e.target).backgroundColor;
    // After getting value from getComputedStyle then currentColor = rgb(r, g, b) 
    // Thus, it should be converted to hexa 
    currentColor = rgbToHex(...currentColor.match(/\d+/g).map(Number));
}

const hover = e => {
    e.preventDefault();
    
    // Round coord of box that is clicked
    const x = Math.trunc((e.layerX - coordX) / 10) * 10,
          y = Math.trunc((e.layerY - coordY) / 10) * 10;
    
    // Get rgb color of current cell, if color of this cell not is default color(white, grey) then skip and not hover
    const [r, g, b] = ctx.getImageData(x, y, 10, 10).data;
    if(rgbToHex(r, g, b) === currentColor.toUpperCase()) return;


    // Hover color 
    ctx.fillStyle = _color_hover_;
    ctx.fillRect(x, y, 10, 10);

    setTimeout(drawPixel.bind(null, x, y), 100);
}

const pixelatedImg = function() {
    // Free memory
    window.URL.revokeObjectURL(img.src);
    const size = 0.2,
          w = canvas.width * size,
          h = canvas.height * size;

    // drawImage(image, dx, dy, dWidth, dHeight)
    // draw image with width = 120, height = 100 at postion 0, 0
    ctx.drawImage(img, 0, 0, w, h);
    
    // Image's size smaller canvas's size. When draw image onto canvas, image will be enlarged and the default resizing algorithm will blur the pixels. Set imageSmoothingEnabled property to false to retain the pixels' sharpness. 
    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

const importImage = () => {
    // Get image file 
    inputFile.click();
    
    // If not choose image then return
    if(!inputFile.value)    return;
    
    inputFile.addEventListener('change', () => {
        img = new Image();
        // make url from file that is chosen
        img.src = URL.createObjectURL(inputFile.files[0]);
        img.addEventListener('load', pixelatedImg);
        
        // Stop hover event
        isHover = false;
        canvas.removeEventListener('mousemove', hover);
    });
}

// Export image as .png
const exportImage = () => {
    let image = canvas.toDataURL("image/png", 1);
    let link = document.createElement('a');
    link.download = "pixel-zcd.png";
    link.href = image;
    link.click();
}

// Pick more color
const addColor = (e) => {
    inputColor.click();
    inputColor.addEventListener('change', () => currentColor = inputColor.value);
}



// use mousemove event instead of mouseover because mouse will change the first element while mouseover will change the second element.
const activatedMousemove = () => {
    canvas.removeEventListener('mousemove', hover);
    canvas.addEventListener('mousemove', tools);
}
const unActivatedMousemove = () => {
    isHover && canvas.addEventListener('mousemove', hover);
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

// -----------------------------------------------

gallery.addEventListener('click', pickColor);

btnExport.addEventListener('click', exportImage);
btnImport.addEventListener('click', importImage);

btnAddColor.addEventListener('click', addColor);

inputText.addEventListener('keyup', drawText);
btnText.addEventListener('click', changeMode.bind(['text', cursors.pen]));

btnBrush.addEventListener('click', changeMode.bind(['brush', cursors.pen]));