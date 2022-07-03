const network_status = document.querySelector('.network-status'),
      heading = document.querySelector('.heading'),
      text = document.querySelector('.text'),
      btn = document.querySelector('button');

let isConnecting = true,
    previousStatus = isConnecting;

const closeToast = () => network_status.classList.remove('move');

const displayToast = () => {
    network_status.classList.add('move');
    
    // Auto close toast
    setTimeout(closeToast, 2500);
}

const offline = () => {
    // Change from green color to grey color 
    network_status.classList.add('active');
    heading.innerHTML = `You're <span class="text-status">offline</span> now`;
    text.textContent = 'OOPs! Internet is disconnected.';
}

const online = () => {
    network_status.classList.remove('active');
    heading.innerHTML = `You're <span class="text-status">online</span> now`;
    text.textContent = 'Hurra!!! Internet is connected.';
}

/*
    * navigator.onLine will return true if the browser is connected to the Internet 
    * else it will return false. But you can't assume that a true value necessarily 
    * means that the browser can access the Internet. Suppose, you're connected to 
    * the WiFi which has no Internet access then navigator.onLine will return true 
    * value but you can't view any online pages.
*/

const detectNetworkStatus = async () => {
    try {
        previousStatus = isConnecting;
        const testData = await fetch('https://jsonplaceholder.typicode.com/posts');
        const statusCode = testData.status;
        if(statusCode === 200 || statusCode < 300) {
            online();
            isConnecting = true;
        }
    } catch (error) {
        isConnecting = false;
        console.error(`Error: Where network 😱 💥`);
        offline();
    }
    finally {
        /*
            previousStatus will keep the state of the network before fetching data. 
            After fetching data, if there is a change in state, that state will be 
            stored in the currentStatus variable. Comparing previousStatus 
            and currentStatus will know if the network status has changed or not.
        */
        if(previousStatus !== isConnecting)
            setTimeout(displayToast, 500);
    }
}

setInterval(detectNetworkStatus, 3000);

btn.addEventListener('click', closeToast);
window.addEventListener('load', detectNetworkStatus);