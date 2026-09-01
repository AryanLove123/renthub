# RentHub

RentHub is a web-based apartment rental platform built with Angular. It lets landlords list properties and lets renters browse, favourite, and inquire about them through private conversations — all built as part of the Angular Assignment (Nagarro).

## Live Demo

- **Deployed App:** [ADD_DEPLOYED_URL_HERE]
- **GitHub Repository:** https://github.com/AryanLove123/renthub

## Demo Credentials

The app seeds a set of demo users into `localStorage` on first load. Use any of the following to log in:

| Role     | Email                          | Password      |
|----------|---------------------------------|---------------|
| Landlord | landlord@renthub.demo           | RentHub@123   |
| Landlord | priya.landlord@renthub.demo     | RentHub@123   |
| Renter   | renter@renthub.demo             | RentHub@123   |
| Renter   | sneha.renter@renthub.demo       | RentHub@123   |

You can also register a new account from the app itself.

## Features Implemented

- **Authentication** — Registration and login with passwords hashed (SHA-256) before being stored in `localStorage`; no plaintext passwords are ever persisted.
- **Auth Guards** — Protected routes are guarded so only authenticated users can access listing creation, inquiries, and other restricted pages.
- **Form Validation** — All forms (login, registration, create listing) use Angular Reactive Forms with validation and inline error messages.
- **Apartment Listings** — Landlords can create, view, and manage property listings with details, amenities, and photos.
- **Preview Before Submit (Bonus)** — When creating a new listing, users get a dedicated preview screen to review all entered details before final submission.
- **Search & Filter, Pagination** — Listings can be searched/filtered and are paginated for easy browsing.
- **Favourites** — Renters can mark listings as favourites to revisit later.
- **Inquiries & Private Chat** — Renters can send inquiries to landlords per property; each (property, renter) pair gets its own private conversation thread. Both landlords and renters can view their inquiry list and continue the conversation, with status (Pending / Responded / Closed) tracked per thread.
- **Data Seeding** — Demo users and properties are automatically seeded into `localStorage` on first app load, so the app is usable immediately without manual setup.
- **Reusable Architecture** — Feature-based folder structure with shared/reusable components, services, and pipes across the app.
- **Styling** — SCSS used throughout for component and page styling.

## Tech Stack

- Angular (standalone components)
- Angular Material
- Reactive Forms
- SCSS
- RxJS
- `localStorage` as the persistence layer (no backend)

## Running the Project Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- Angular CLI (latest version):
  ```bash
  npm install -g @angular/cli
  ```

### Setup

1. Clone the repository:
   ```bash
   git clone [ADD_GITHUB_REPO_URL_HERE]
   cd renthub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

5. Log in using any of the [demo credentials](#demo-credentials) above, or register a new account.

> **Note:** The app seeds demo data into your browser's `localStorage` on first load. If you want a completely fresh state, clear `localStorage` for `localhost:4200` and reload.

## Building for Production

```bash
ng build
```

Build artifacts will be output to the `dist/` directory.