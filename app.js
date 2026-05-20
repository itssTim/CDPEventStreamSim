'use strict';

let anonymousId = crypto.randomUUID();
let userId = null;
let count = 0;

let event_btns = document.querySelector('.btn-panel');
let clear_btn = document.querySelector('.clear-btn');
let log_body = document.querySelector('.log-body');
let log_count = document.querySelector('.event-count');

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

let eventFire = function(type) {
    if (type === 'sign_up') {userId = 'usr' + crypto.randomUUID()};

    const eventLoad = {
        event: type,
        'anonymousId': anonymousId,
        'userId': userId,
        timestamp: new Date().toISOString(),
        context: {
            page: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: `'${window.screen.width}x${window.screen.height}'`
        },
        properties: {}
    };
    eventLoad.properties = events[type];
    count++;

    document.querySelector('.log-empty').classList.add('hidden');

    let log = document.createElement('pre');
    log.className = 'log-entry';
    log.innerHTML = colorJson(eventLoad);
    log_body.prepend(log);
    log_count.innerHTML= `${count} events`;

};

let clearLog = function () {
    const body = document.getElementById('logBody');
    body.innerHTML = '<div class="log-empty" id="emptyState">— no events captured yet —</div>';
    count = 0;
    log_count.innerHTML = '0 events';
};

event_btns.addEventListener('click', function(e) 
{
    if (e.target.matches('.evt-btn')) {
        eventFire(e.target.dataset.type);
    }
});

clear_btn.addEventListener('click', clearLog);