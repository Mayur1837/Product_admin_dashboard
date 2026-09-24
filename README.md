# Product Admin Dashboard

A product management dashboard built with **Next.js, React, JavaScript/JSX, Tailwind CSS, Axios, and DummyJSON API**.

## Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

### Login

```text
Username: emilys
Password: emilyspass
```

## Completed Features

* Login/logout with protected product pages
* Axios shared setup with authentication token and error handling
* Product list with responsive desktop table and mobile cards
* Pagination with 10, 20, and 50 items per page
* Search with debounce and page reset
* Category filtering
* Sort by price, rating, and title
* Product details with images, description, and reviews
* Add, edit, and delete products
* Form validation and delete confirmation
* Loading, empty, error, and Retry states
* URL-based page, search, filter, and sort state
* Protection against stale search results
* Protection against multiple rapid Login/Save/Delete requests
* Invalid URL values handled safely

## API Notes

DummyJSON cannot search and filter by category in the same request. When both are selected, the app searches first and then filters the results by category on the client.

DummyJSON CRUD operations are simulated and are not permanently saved. Successful add/edit/delete changes are stored locally in `localStorage` so they remain visible in the app.

## Libraries

* Next.js
* React
* JavaScript / JSX
* Tailwind CSS
* Axios

