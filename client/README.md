# Ecommerce Frontend

Next.js 14 frontend for the ecommerce platform.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js 14 App Router pages
│   ├── admin/       # Admin dashboard
│   ├── products/    # Product pages
│   ├── cart/        # Shopping cart
│   ├── checkout/    # Checkout flow
│   └── orders/      # Order management
├── components/      # Reusable React components
├── lib/            # Utilities and API client
├── store/          # Zustand state management
└── types/          # TypeScript type definitions
```

## Key Features

- Server-side rendering with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- Zustand for state management
- Axios for API calls
- React Hook Form for forms
- Hot Toast for notifications

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Customization

### Theme Colors
Edit `tailwind.config.ts` to customize colors and theme.

### API Client
The API client is in `src/lib/api.ts` with automatic token refresh.

### State Management
Global state stores are in `src/store/`:
- `authStore.ts`: Authentication state
- `cartStore.ts`: Shopping cart state
