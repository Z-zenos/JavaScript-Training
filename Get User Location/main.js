
const btn = document.querySelector('button');
const text = document.querySelector('.box p');

// Get location 
const getLocation = async () => {
    try {
        // Get location
        const location = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
        
        // Get coordinates of location
        const {latitude: lat, longitude: long} = location.coords;

        // Get city and country name from latitude and longitude
        const data = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);
        
        if(!data.ok)   throw new Error('Location unknown');

        const position = await data.json();
        
        // Display position to screen 
        text.innerHTML = `${position.city}, ${position.country}`;

    } catch (error) {
        console.error(`Error: ${error.message}`);
        text.innerHTML = error.message;
    }
}


btn.addEventListener('click', getLocation);