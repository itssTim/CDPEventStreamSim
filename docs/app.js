'use strict';
//Creates element that directs to either localhost Port 3000 or the render server
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://cdpeventstreamsim.onrender.com';

let anonymousId = crypto.randomUUID();
let userId = null;
let count = 0;

let event_btns = document.querySelector('.btn-panel');
let clear_btn = document.querySelector('.clear-btn');
let log_body = document.querySelector('.log-body');
let log_count = document.querySelector('.event-count');
let server_btn = document.querySelector('.server-btn');

const events = {
    sign_up : {email: 'user@example.com', plan: 'starter'},
    view_product: {productId: 'prod_001', productName: 'Merino Wool Shirt', category: 'Apparel', price: 20},
    add_to_cart: {productId: 'prod_001', productName: 'Merino Wool Shirt', category: 'Apparel', price: 20, quantity: 2},
    click_cta: {ctaLabel: 'Shop Deals', destinationUrl: '/collections/sale'}
};

let colorJson = function (obj, indent=0) {
    const pad = '  '.repeat(indent);
    const inner = '  '.repeat(indent + 1);
    const entries = Object.entries(obj).map(([k, v]) => {
        let val;
        if (v === null) val = `<span class="log-null">null</span>`;
        else if (typeof v === 'string') val = `<span class="log-str">"${v}"</span>`;
        else if (typeof v === 'number') val = `<span class="log-num">${v}</span>`;
        else if (typeof v === 'object') val = colorJson(v, indent + 1);
        else val = String(v);
        return `${inner}<span class="log-key">"${k}"</span>: ${val}`; 
});
    return `{\n${entries.join(',\n')}\n${pad}}`;
};

let eventFire = async function(type) {
    try {
    if (type === 'sign_up') {userId = 'usr_' + crypto.randomUUID()};

    const eventLoad = {
        event: type,
        'anonymousId': anonymousId,
        'userId': userId,
        timestamp: new Date().toISOString(),
        context: {
            page: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        },
        properties: {}
    };

    eventLoad.properties = events[type];
    count++;
    // Pauses execution inside the evenFire function until we communicate with API_BASE and receive a response. It then checks if the response is ok and if not ok it then throws an error and catches and logs the error in the console
    const response = await fetch(`${API_BASE}/track`, {
       //specifies method of fetch
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventLoad)
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    document.querySelector('.log-empty').classList.add('hidden');
    
    let log = document.createElement('pre');
    log.className = 'log-entry';
    log.innerHTML = colorJson(eventLoad);
    log_body.prepend(log);
    log_count.innerHTML= `${count} events`;

    const data = await response.json();
    console.log(data);

}   catch(err) {
    console.error(err);
    throw err;
}
};

let clearLog = function () {
    log_body.innerHTML = '<div class="log-empty log-body">— no events captured yet —</div>';
    count = 0;
    log_count.innerHTML = '0 events';
};

event_btns.addEventListener('click', function(e) 
{
    if (e.target.matches('.evt-btn')) {
        const eventType = e.target.dataset.type;
        eventFire(eventType);
        analytics.track(eventType, events[eventType]);
    }
});

clear_btn.addEventListener('click', clearLog);


let getServerData = async function() {
    try{
    let serverResponse = await fetch(`${API_BASE}/events`)
    let data = await serverResponse.json();
    if (!serverResponse.ok) throw new Error(`Error: ${serverResponse.status}`);
    console.log(data);
    } catch(err) {
        console.error(err);
        throw err;
    };

};

server_btn.addEventListener('click', getServerData);