
const container = document.querySelector('.pixel__container'),
      colorList = document.querySelectorAll('.pixel__gallery .color');

const popularColors = [
    "#F20505", "#05F2DB", "#F2CB05", "#F28705",
    "#4630D9", "#D90467", "#000000", "#B8BF84",
    "#BF04A0", "#BFBFBF", "#F2F2F2", "#02735E"
];

[...colorList].forEach((c, i) => c.style.backgroundColor = popularColors[i]);

const createGrid = () => {
    const width = Number.parseInt(window.getComputedStyle(container).width) / 10;
    const height = Number.parseInt(window.getComputedStyle(container).height) / 10;
    
    let first, second;
    console.log(height * width);
    for(let i = 0; i < height; i++) {
        if(i % 2) {
            first = "white";
            second = "grey";
        }
        else {
            first = "grey";
            second = "white";
        }

        for(let j = 0; j < width; j++) {
            container.insertAdjacentHTML('beforeend', 
                `
                    <div class="pixel__box pixel__box--${j % 2 ? first : second}"></div>
                `
            );
        }
    }
}

createGrid();