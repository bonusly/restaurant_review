# Foody UI - React Frontend

A modern React + TypeScript + Vite application for the Foody restaurant review platform.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form validation
- **Tailwind CSS** - Styling

## Development Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

### Getting Started

#### Option 1: Docker Development (Recommended)

1. Start all services:
```bash
docker-compose up -d
```

2. The UI will be available at `http://localhost:5173`

#### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make sure the API is running (via Docker or locally)

## 🚨 Important: Adding New Dependencies

When adding new npm packages in a Docker environment, follow these steps to avoid architecture conflicts:

### Installing New Packages

1. **Add the package to package.json** or install locally first:
```bash
npm install package-name
```

2. **Reinstall dependencies in Docker container**:
```bash
docker-compose run -T --rm foody_ui sh -c "rm -rf node_modules package-lock.json && npm install"
```

3. **Restart the container**:
```bash
docker-compose restart foody_ui
```

### Why This Is Necessary

Docker containers may use different CPU architectures than your host machine. When you install packages locally and then run in Docker, some native binaries (like those used by Vite, Rollup, etc.) may be incompatible.

The solution ensures dependencies are installed with the correct architecture inside the container.

### Common Error Signs

If you see errors like:
- `Cannot find module @rollup/rollup-linux-arm64-musl`
- `Failed to resolve import "package-name"`
- Architecture-related binary errors

Run the dependency reinstall command above.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Generic components (Modal, Portal, etc.)
│   └── reviews/        # Review-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components (routes)
├── queries/            # TanStack Query hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and constants
```

## Key Features

- **Authentication Flow** - Login/register with session persistence
- **Restaurant Browsing** - Search, filter, and sort restaurants
- **Review System** - Write and read reviews with modal interface
- **Responsive Design** - Mobile-first Tailwind CSS
- **Type Safety** - Full TypeScript coverage
- **Query Management** - Efficient data fetching and caching

## API Integration

The frontend communicates with the Rails API running on `http://localhost:3000`. CORS is configured to allow requests from the Vite dev server.

Key API endpoints:
- `POST /session` - Login
- `GET /me` - Get current user
- `GET /restaurants` - List restaurants with filters
- `GET /restaurants/:id` - Get restaurant details
- `POST /restaurants/:id/reviews` - Create review

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Container Won't Start

1. Check if ports are available:
```bash
lsof -i :5173
```

2. Rebuild containers:
```bash
docker-compose down
docker-compose build --no-cache foody_ui
docker-compose up -d
```

### Module Resolution Errors

This usually indicates a dependency architecture mismatch. Follow the dependency installation steps above.

### Hot Reload Not Working

Make sure file watching is enabled in Docker:
```yaml
# In docker-compose.yml
volumes:
  - ./foody_ui:/app
```
