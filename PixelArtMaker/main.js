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
      _color_white_ = '#FFFFFF',
      _color_grey_ = '#E0E0E0',
      _color_hover_ = '#BFBFBF';

const popularColors = [
    "#F20505", "#05F2DB", "#F2CB05", "#F28705",
    "#4630D9", "#D90467", "#000000", "#B8BF84",
    "#BF04A0", "#BFBFBF", "#F2F2F2", "#02735E"
];


const cursors = {
    pen: "url(./cursor/Pencil-icon.png), auto",
    erase: "url('./cursor/Eraser-icon.png'), auto",
    brush: "url(./cursor/paint-brush-tool-icon.png), auto",
}


/* ================ UTILITY FUNCTION ================ */

// Convert rgb(red, green, blue) to hexa color
const rgbToHex = (r, g, b) => '#' + [r, g, b]
                                        .map(x => x.toString(16)
                                        .padStart(2, '0'))
                                        .join('')
                                        .toUpperCase();

const hexToRgba = (hex, alpha = 1) => {
    let bigint = parseInt(hex.slice(1), 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;
        
    return `rgb(${r}, ${g}, ${b}, ${alpha})`;
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
            drawPixel(x, y - 20, hexToRgba(currentColor, 0.8), hexToRgba(currentColor, 0.8));
            drawPixel(x + 20, y, hexToRgba(currentColor, 0.88), hexToRgba(currentColor, 0.88));
            drawPixel(x, y + 20, hexToRgba(currentColor, 0.9), hexToRgba(currentColor, 0.9));
            drawPixel(x - 20, y, hexToRgba(currentColor, 0.7), hexToRgba(currentColor, 0.7));

            drawPixel(x - 10, y - 10, hexToRgba(currentColor, 0.5), hexToRgba(currentColor, 0.5));
            drawPixel(x, y - 10, hexToRgba(currentColor), hexToRgba(currentColor));
            drawPixel(x + 10, y - 10, hexToRgba(currentColor, 0.7), hexToRgba(currentColor, 0.7));
            
            drawPixel(x - 10, y, hexToRgba(currentColor, 0.6), hexToRgba(currentColor, 0.6));
            drawPixel(x, y, hexToRgba(currentColor), hexToRgba(currentColor));
            drawPixel(x + 10, y, hexToRgba(currentColor), hexToRgba(currentColor));

            drawPixel(x - 10, y + 10, hexToRgba(currentColor, 0.9), hexToRgba(currentColor, 0.9));
            drawPixel(x, y + 10, hexToRgba(currentColor), hexToRgba(currentColor));
            drawPixel(x + 10, y + 10, hexToRgba(currentColor, 0.6), hexToRgba(currentColor, 0.6));
            break;
        default:
            break;
    }
}



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
    const colorCurrentCell = rgbToHex(r, g, b);
    if(
        colorCurrentCell !== _color_white_ &&
        colorCurrentCell !== _color_grey_
    ) 
        return;
    if(mode === 'brush') {
        const [r1, g1, b1] = ctx.getImageData(x, y - 20, 10, 10).data;
        const colorCell1 = rgbToHex(r1, g1, b1);
        const [r2, g2, b2] = ctx.getImageData(x + 10, y - 10, 10, 10).data;
        const colorCell2 = rgbToHex(r2, g2, b2);
        const [r3, g3, b3] = ctx.getImageData(x + 20, y, 10, 10).data;
        const colorCell3 = rgbToHex(r3, g3, b3);
        const [r4, g4, b4] = ctx.getImageData(x + 10, y + 10, 10, 10).data;
        const colorCell4 = rgbToHex(r4, g4, b4);
        const [r5, g5, b5] = ctx.getImageData(x, y + 20, 10, 10).data;
        const colorCell5 = rgbToHex(r5, g5, b5);
        const [r6, g6, b6] = ctx.getImageData(x - 10, y - 10, 10, 10).data;
        const colorCell6 = rgbToHex(r6, g6, b6);
        const [r7, g7, b7] = ctx.getImageData(x - 20, y, 10, 10).data;
        const colorCell7 = rgbToHex(r7, g7, b7);
        const [r8, g8, b8] = ctx.getImageData(x - 10, y - 10, 10, 10).data;
        const colorCell8 = rgbToHex(r8, g8, b8);
        if(
            (colorCell1 !== _color_white_ && colorCell1 !== _color_grey_) ||
            (colorCell2 !== _color_white_ && colorCell2 !== _color_grey_) ||
            (colorCell3 !== _color_white_ && colorCell3 !== _color_grey_) ||
            (colorCell4 !== _color_white_ && colorCell4 !== _color_grey_) ||
            (colorCell5 !== _color_white_ && colorCell5 !== _color_grey_) ||
            (colorCell6 !== _color_white_ && colorCell6 !== _color_grey_) ||
            (colorCell7 !== _color_white_ && colorCell7 !== _color_grey_) ||
            (colorCell8 !== _color_white_ && colorCell8 !== _color_grey_)
        ) 
        return;
        /*
             o
            ooo
           ooooo
            ooo
             0 
        */
        ctx.fillStyle = '#9d9d9d';
        ctx.fillRect(x, y - 20, 10, 10);
        ctx.fillStyle = '#babcbd';
        ctx.fillRect(x + 20, y, 10, 10);
        ctx.fillStyle = '#9f9f9f';
        ctx.fillRect(x, y + 20, 10, 10);
        ctx.fillStyle = '#';
        ctx.fillRect(x - 20, y, 10, 10);

        ctx.fillStyle = '#b3b3b3';
        ctx.fillRect(x - 10, y - 10, 10, 10);
        ctx.fillStyle = '#efefef';
        ctx.fillRect(x, y - 10, 10, 10);
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(x + 10, y - 10, 10, 10);

        ctx.fillStyle = '#cdcdcd';
        ctx.fillRect(x - 10, y, 10, 10);
        ctx.fillStyle = '#888888';
        ctx.fillRect(x, y, 10, 10);
        ctx.fillStyle = '#d4d5d6';
        ctx.fillRect(x + 10, y, 10, 10);

        ctx.fillStyle = '#9c9c9c';
        ctx.fillRect(x - 10, y + 10, 10, 10);
        ctx.fillStyle = '#606060';
        ctx.fillRect(x, y + 10, 10, 10);
        ctx.fillStyle = '#bababa';
        ctx.fillRect(x + 10, y + 10, 10, 10);

        setTimeout(() => {
            drawPixel(x, y - 20);
            drawPixel(x + 20, y);
            drawPixel(x, y + 20);
            drawPixel(x - 20, y);
            drawPixel(x - 10, y - 10);
            drawPixel(x, y - 10);
            drawPixel(x + 10, y - 10);
            drawPixel(x - 10, y);
            drawPixel(x, y);
            drawPixel(x + 10, y);
            drawPixel(x - 10, y + 10);
            drawPixel(x, y + 10);
            drawPixel(x + 10, y + 10);
        }, 100);
    }
    else {
        // Hover color 
        ctx.fillStyle = _color_hover_;
        ctx.fillRect(x, y, 10, 10);
    
        setTimeout(drawPixel.bind(null, x, y), 100);
    }
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

btnBrush.addEventListener('click', changeMode.bind(['brush', cursors.brush]));

