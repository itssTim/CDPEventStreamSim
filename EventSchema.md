Event schema · MD
# EVENT_SCHEMA.md — CDP Event Stream Simulator
 
Defines all tracked events, their structure, and expected field values. Modelled on the [Segment Spec](https://segment.com/docs/connections/spec/). This document is the contract between the client implementation and the receiving endpoint — all event construction in `app.js` implements this schema.
 
---
 
## Common Fields
 
All events share the following envelope structure regardless of type.
 
| Field | Type | Required | Example | Description |
|---|---|---|---|---|
| `event` | string | yes | `"sign_up"` | Snake_case event name |
| `anonymousId` | string (UUID) | yes | `"b3d6f1a2-4c8e-7f90-d123-456789abcdef"` | Generated once on page load via `crypto.randomUUID()`, persisted for session |
| `userId` | string or null | no | `"usr_a1b2c3d4-..."` | Null until `sign_up` fires; populated for all subsequent events |
| `timestamp` | string (ISO 8601) | yes | `"2025-05-19T14:32:00.000Z"` | UTC timestamp at moment of event construction |
| `context.page` | string (URL) | yes | `"https://demo.example.com/products"` | `window.location.href` at time of event |
| `context.userAgent` | string | yes | `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."` | `navigator.userAgent` |
| `context.screenResolution` | string | yes | `"1440x900"` | `"{window.screen.width}x{window.screen.height}"` |
 
---
 
## Events
 
### `sign_up`
 
Fired when the user submits the Sign Up form. This is the identification event — it is the first event to carry a `userId`. All events fired after this point include both `anonymousId` and `userId`.
 
| Field | Type | Required | Example | Description |
|---|---|---|---|---|
| `properties.email` | string | yes | `"user@example.com"` | Email address submitted by user |
| `properties.plan` | string | yes | `"starter"` | Plan selected at sign-up |
 
**Example payload**
```json
{
  "event": "sign_up",
  "anonymousId": "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
  "userId": "usr_a1b2c3d4-...",
  "timestamp": "2025-05-19T14:32:00.000Z",
  "context": {
    "page": "https://demo.example.com/products",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "screenResolution": "1440x900"
  },
  "properties": {
    "email": "user@example.com",
    "plan": "starter"
  }
}
```
 
---
 
### `view_product`
 
Fired when the user clicks "View Product." Captures which product was viewed and its catalog metadata.
 
| Field | Type | Required | Example | Description |
|---|---|---|---|---|
| `properties.productId` | string | yes | `"prod_001"` | Unique product identifier |
| `properties.productName` | string | yes | `"Shirt"` | Display name of the product |
| `properties.category` | string | yes | `"Clothes"` | Product category |
| `properties.price` | number | yes | `20` | Unit price in USD |
 
**Example payload**
```json
{
  "event": "view_product",
  "anonymousId": "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
  "userId": null,
  "timestamp": "2025-05-19T14:32:00.000Z",
  "context": {
    "page": "https://demo.example.com/products",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "screenResolution": "1440x900"
  },
  "properties": {
    "productId": "prod_001",
    "productName": "Shirt",
    "category": "Clothes",
    "price": 20
  }
}
```
 
---
 
### `add_to_cart`
 
Fired when the user clicks "Add to Cart." Extends `view_product` properties with quantity.
 
| Field | Type | Required | Example | Description |
|---|---|---|---|---|
| `properties.productId` | string | yes | `"prod_001"` | Unique product identifier |
| `properties.productName` | string | yes | `"Shirt"` | Display name of the product |
| `properties.category` | string | yes | `"Clothes"` | Product category |
| `properties.price` | number | yes | `20` | Unit price in USD |
| `properties.quantity` | number | yes | `2` | Number of units added |
 
**Example payload**
```json
{
  "event": "add_to_cart",
  "anonymousId": "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
  "userId": null,
  "timestamp": "2025-05-19T14:32:00.000Z",
  "context": {
    "page": "https://demo.example.com/products",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "screenResolution": "1440x900"
  },
  "properties": {
    "productId": "prod_001",
    "productName": "Shirt",
    "category": "Clothes",
    "price": 20,
    "quantity": 2
  }
}
```
 
---
 
### `click_cta`
 
Fired when the user clicks a call-to-action element. Captures the label and destination for navigation intent analysis.
 
| Field | Type | Required | Example | Description |
|---|---|---|---|---|
| `properties.ctaLabel` | string | yes | `"Shop Deals"` | Visible text of the CTA element |
| `properties.destinationUrl` | string | yes | `"/collections/sale"` | href target of the CTA |
 
**Example payload**
```json
{
  "event": "click_cta",
  "anonymousId": "b3d6f1a2-4c8e-7f90-d123-456789abcdef",
  "userId": null,
  "timestamp": "2025-05-19T14:32:00.000Z",
  "context": {
    "page": "https://demo.example.com/products",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "screenResolution": "1440x900"
  },
  "properties": {
    "ctaLabel": "Shop Deals",
    "destinationUrl": "/collections/sale"
  }
}
```
 
---
 
## Notes
 
- **Anonymous vs. identified:** `userId` is `null` on all events until `sign_up` fires. Post-identification, all events carry both `anonymousId` and `userId`, mirroring Segment's identify/track flow.
- **Event naming:** All event names are snake_case. `click_CTA` has been normalised to `click_cta` for consistency.
- **`destinationURL` normalised to `destinationUrl`:** camelCase with lowercase `rl` suffix is consistent with Segment Spec conventions.
- **`price` type:** Stored as a number (not a string) to support downstream aggregation without casting.
