
/* ================ VARIABLE ================ */

const container = document.querySelector('.pixel__container'),
      colorList = document.querySelectorAll('.pixel__gallery .color'),
      root = document.documentElement,
      eraser = document.querySelector('.tool--erase'),
      images = document.querySelectorAll('img'),
      gallery = document.querySelector('.pixel__gallery');

let currentColor;



const popularColors = [
    "#F20505", "#05F2DB", "#F2CB05", "#F28705",
    "#4630D9", "#D90467", "#000000", "#B8BF84",
    "#BF04A0", "#BFBFBF", "#F2F2F2", "#02735E"
];


/* ================ HANDLE EVENT ================ */

const createGrid = () => {
    const width = Number.parseInt(window.getComputedStyle(container).width) / 10;
    const height = Number.parseInt(window.getComputedStyle(container).height) / 10;
    
    let first = 'white', second = 'grey';
    console.log(height * width);
    for(let i = 0; i < height; i++) {
        // each even or odd line will change the order in which it appears white or gray
        [first, second] = [second, first];
        for(let j = 0; j < width; j++) {
            container.insertAdjacentHTML('beforeend', 
                `
                    <div class="pixel__box pixel__box--${j % 2 ? first : second}"></div>
                `
            );
        }
    
    }

}

const init = () => {
    currentColor = '#000';

    // Create colors table 
    [...colorList].forEach((c, i) => c.style.backgroundColor = popularColors[i]);
    
    // Create grid area for painting
    createGrid();
    
}

// const activatedMouseover = 

const paint = e => {
    e.preventDefault();

    const box = e.target;
    if(!box.classList.contains('pixel__box'))    return;
    
    box.classList.add('active');
}

const pickColor = e => {
    if(!e.target.classList.contains('color')) return;

    currentColor = window.getComputedStyle(e.target).backgroundColor;
    document.documentElement.style.setProperty('--color-current', currentColor);
    // console.log(currentColor);
}

// use mousemove event instead of mouseover because mouse will change the first element while mouseover will change the second element.
const activatedMousemove = () => container.addEventListener('mousemove', paint);
const unActivatedMousemove = () => container.removeEventListener('mousemove', paint);

window.addEventListener('load', init);

container.addEventListener('mousedown', activatedMousemove);
container.addEventListener('mouseup', unActivatedMousemove);
container.addEventListener('mouseleave', unActivatedMousemove);
container.addEventListener('click', paint);
container.addEventListener('contextmenu', e => e.preventDefault());


gallery.addEventListener('click', pickColor);