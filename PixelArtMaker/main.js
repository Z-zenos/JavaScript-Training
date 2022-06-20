const container = document.querySelector('.pixel__container');

const createGrid = () => {
    const width = Number.parseInt(window.getComputedStyle(container).width);
    const height = Number.parseInt(window.getComputedStyle(container).height);
    for(let i = 0; i < width * height; i++)
        container.insertAdjacentHTML('beforeend', 
        `
            <div class="pixel__box"></div>
        `
    );
}

createGrid();