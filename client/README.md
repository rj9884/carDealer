# Car Dealer Client (React + Vite)
Frontend for the Car Dealer application. Provides user authentication, car browsing, car detail pages, profile editing, and an admin panel for managing cars and users.
## Tech Stack
- React 19 + Vite
- React Router
- Axios
- Tailwind CSS (via `@tailwindcss/vite`)
- Heroicons
## Scripts
Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Lint:
```bash
npm run lint
```

## Environment

The client expects the backend available (proxy or matching origin) for API routes like `/api/users` and `/api/cars`.

## Data Model Notes

Car objects include images (Cloudinary URLs), make, model, year, pricing, specs, features, and contact info.

User objects include username, email, role (`admin` or `client`), profile picture (optional), and verification status.

## Seeding Removed

Automatic database seeding scripts (sample users/cars and migration helpers) were removed. Now:

- Cars are created exclusively through the Admin Panel (Add Car modal).
- Users are created via the registration form.
- Cloudinary is the single source for car images. Local image files are not stored permanently.
- Admins can query an operational summary at:
	- `GET /api/users/admin/status/summary` → `{ userCount, carCount, adminCount }`

If you need to purge old seeded data, drop the MongoDB collections manually. The app will not auto-repopulate.

## Styling Conventions

Reusable utility classes are defined in `src/index.css` (`btn-primary`, `btn-secondary`, `input-field`, `label`, `card`). Prefer these before adding new variants.

## Admin Panel

Features:
- View cars & users
- Create new cars with multiple image uploads (sent multipart, stored on Cloudinary)
- Delete cars/users (admins only)

## Error Handling

Global `ErrorBoundary` component is available; wrap new top-level routes/components if needed.

## Roadmap Ideas

- Car editing modal
- Dashboard charts (using status summary endpoint)
- Dark mode
- Pagination & filtering for large inventories

## License

Internal project (no explicit license file yet).
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
