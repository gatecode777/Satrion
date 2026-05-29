# Satrion Developer & Performance Guidelines

To ensure the Satrion platform remains blazing-fast, secure, and maintainable, all future developers and agent systems must adhere strictly to these architectural standards.

---

## 1. Image & Asset Storage (No Base64 in Database)
- **Standard**: **NEVER** save Base64-encoded image strings directly inside MongoDB text fields.
- **Why**: Storing Base64-encoded images blocks database queries, spikes your memory footprint, bloats JSON payloads, and slows down client-side rendering.
- **Rules**:
  - Always upload assets using the `/api/upload` endpoint.
  - The endpoint writes binary file buffers directly to disk in `public/uploads/` and returns a clean, lightweight string path (e.g. `/uploads/1715938592-img.png`).
  - Keep your MongoDB document size under **1KB** to ensure extremely fast queries.

---

## 2. Parallel Database Operations (`Promise.all`)
- **Standard**: **NEVER** run multiple sequential `await` database queries when loading pages or components.
- **Why**: Sequential await queries create a "wait-chain" where each query must wait for the previous round-trip to finish. If 5 queries take 200ms each, sequential fetches will delay page rendering by 1.0 second.
- **Rules**:
  - Group queries, count operations, and aggregations together using `Promise.all`:
    ```javascript
    const [products, totalCount, categories] = await Promise.all([
      Product.find(dbQuery).lean(),
      Product.countDocuments(dbQuery),
      Category.find({}).lean()
    ]);
    ```
  - This cuts your page round-trip database delay by up to **80%**!

---

## 3. Database Schema Indexing
- **Standard**: Any MongoDB collection field queried with filters or sorting must be indexed in the corresponding model schema.
- **Why**: Missing indexes force MongoDB to execute extremely slow Full Collection Scans (`COLLSCAN`), degrading CPU performance as your collection grows.
- **Rules**:
  - Always verify that fields such as `category`, `homepageSection`, or query tags are indexed:
    ```javascript
    ProductSchema.index({ category: 1 });
    ProductSchema.index({ homepageSection: 1 });
    ```

---

## 4. Secure Hydration & Auth Persistence
- **Standard**: Coordinate client-side state checks with a explicit check flag during hydration to prevent race conditions.
- **Why**: On mount, Next.js client hydration runs effects before state updates apply. If `token` starts as `null`, secondary effects will overwrite `localStorage` or trigger immediate redirects to `/login` before the token is read.
- **Rules**:
  - Utilize the `isTokenChecked` state pattern in `ShopContext.jsx`.
  - Block all secondary storage operations or state transitions (such as setting `loading = false`) until `isTokenChecked` is true.
  - Wrap state updates inside hydration hooks in a `setTimeout(..., 0)` block to prevent synchronous render cascades and remain ESLint-compliant.
