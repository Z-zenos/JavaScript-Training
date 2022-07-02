const network_status = document.querySelector('.network-status'),
      heading = document.querySelector('.heading'),
      text = document.querySelector('.text'),
      btn = document.querySelector('button');

let isConnecting = true,
    previousStatus = isConnecting;

const closeToast = () => network_status.classList.remove('move');

const displayToast = () => {
    network_status.classList.add('move');
    setTimeout(closeToast, 2500);
}

const offline = () => {
    network_status.classList.add('active');
    heading.innerHTML = `You're <span class="text-status">offline</span> now`;
    text.textContent = 'OOPs! Internet is disconnected.';
}

const online = () => {
    network_status.classList.remove('active');
    heading.innerHTML = `You're <span class="text-status">online</span> now`;
    text.textContent = 'Hurra!!! Internet is connected.';
}

const detectNetworkStatus = async () => {
    try {
        previousStatus = isConnecting;
        const testData = await fetch('https://jsonplaceholder.typicode.com/posts');
        if(!testData.ok) throw new Error('Where network 😱 💥');
        const statusCode = testData.status;
        if(statusCode === 200 || statusCode < 300) {
            online();
            isConnecting = true;
        }
    } catch (error) {
        isConnecting = false;
        console.error(`Error: ${error.message}`);
        offline();
    }
    finally {
        if(previousStatus !== isConnecting)
            setTimeout(displayToast, 500);
    }
}

// setInterval(detectNetworkStatus, 3000);

btn.addEventListener('click', closeToast);
// window.addEventListener('load', detectNetworkStatus);