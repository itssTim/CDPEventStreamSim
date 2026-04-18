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
README.md — project purpose, architecture diagram (even a simple ASCII one), setup instructions, endpoint URL, link to schema, interview talking points section
Render deployment — live URL in README
Screenshot or screen recording — shows events firing and appearing in log