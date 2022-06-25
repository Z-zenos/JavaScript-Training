
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
      inputFile = document.getElementById('upload');

let currentColor,
    ctx,
    coordX, coordY,
    mode, isHover, img;

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

    setTimeout(drawPixel.bind(null, x, y, _color_white_, _color_grey_), 100);
}

const pixelatedImg = function() {
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
    // Clip canvas with width = w = 120, height = h = 100 at position 0, 0 ( = drawn image), thereafter stretch image at position 0, 0 and with width = canvas.width = 600 and height = canvas.height = 500. Thus, image will fill canvas. 
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height); // ! Take the canvas containing the newly drawn image and draw that canvas on itself.

}

const importImage = () => {
    // Get image file 
    inputFile.click();
    
    // If not choose image then return
    if(!inputFile.value)    return;
    URL.revokeObjectURL(img.src);   // Free memory for previous img
    
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

