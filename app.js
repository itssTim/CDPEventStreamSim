'use strict';

let anonymousId = crypto.randomUUID();
let userId = null;
let count = 0;

let event_btns = document.querySelector('.btn-panel');

const events = {
    sign_up : {email: 'user@example.com', plan: 'starter'},
    view_product: {productId: 'prod_001', productName: 'Merino Wool Shirt', category: 'Apparel', price: 20},
    add_to_cart: {productId: 'prod_001', productName: 'Merino Wool Shirt', category: 'Apparel', price: 20, quantity: 2},
    click_cta: {ctaLabel: 'Shop Deals', destinationUrl: '/collections/sale'}
};

let eventFire = function(type) {
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
    }
    eventLoad.properties = events[type];
};

event_btns.addEventListener('click', function(e) 
{
    if (e.target.matches('.evt-btn')) {
        eventFire(e.target.dataset.type)
    }
});