Endpoint strategy
    Node/Express on Render

User ID strategy
    anonymousId on page load via crypto.randomUUID(). "Sign Up" event sets a userId in state. All subsequent events include both.

Event object structure
    event — string, the event name
    anonymousId — string, UUID
    userId — string or null
    timestamp — ISO 8601 string from new Date().toISOString()
    context — object containing page URL, user agent, screen resolution
    properties — object, event-specific payload

The live log panel
    UI component, but the architecture decision is: what does it render, and when. Each time fetch() is called, you push the event object into a local array and re-render the log. Render as formatted JSON using JSON.stringify(obj, null, 2) inside a <pre> block. Newest event at top.

Deliverables checklist (define these now, build against them)

index.html — demo page with 4 buttons and live log panel
app.js — event construction functions, fetch dispatch, log rendering
server.js — minimal Express endpoint, logs received payload, returns 200



EVENT_SCHEMA.md — full schema for all 4 events, Markdown tables
     {
        event: 'sign_up',
        anonymousId: "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
        userId: "usr_a1b2c3d4-...",
        timestamp: new Date().toISOString(),
        context: {
            page: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: ${window.screen.width x window.screen.height}
        }
        properties: {
            email: 'user@example.com',
            plan: 'starter
        }
    }
    {
        event: 'view_product',
        anonymousId: "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
        userId: null,
        timestamp: "2025-05-19T14:32:00.000Z",
        context: {
            page: "https://demo.example.com/products",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
            screenResolution: '1440x900'
        }
        properties: {
            productId: 'prod_001',
            productName: 'Shirt',
            category: 'Clothes',
            price: 20
        }
    }
    {
        event: 'add_to_cart',
        anonymousId: "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
        userId: null,
        timestamp: "2025-05-19T14:32:00.000Z",
        context: {
            page: "https://demo.example.com/products",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
            screenResolution: '1440x900'
        }
        properties: {
            productId: 'prod_001',
            productName: 'Shirt',
            category: 'Clothes',
            price: 20,
            quantity: 2
        }
    }
    {
        event: 'click_CTA',
        anonymousId: "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
        userId: null,
        timestamp: "2025-05-19T14:32:00.000Z",
        context: {
            page: "https://demo.example.com/products",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
            screenResolution: '1440x900'
        }
        properties: {
            ctaLabel: 'Shop Deals',
            destinationURL: '/collections/sale'
        }
    }

README.md — project purpose, architecture diagram (even a simple ASCII one), setup instructions, endpoint URL, link to schema, interview talking points section
Render deployment — live URL in README
Screenshot or screen recording — shows events firing and appearing in log