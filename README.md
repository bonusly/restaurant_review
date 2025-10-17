# Foody - Interview Starting Point

This is a simple development environment for building a restaurant review application. It includes a Rails API backend, React frontend, and PostgreSQL database, all running in Docker containers.

The Docker containers are provided as a convenience so you do not need to install any dependencies. However, you can also run the applications directly on your machine if you prefer.

## Quick Start

1. **Start the application:**
   ```bash
   docker-compose up
   ```

2. **Access the applications:**
   - **Frontend (React):** http://localhost:5173
   - **Backend (Rails API):** http://localhost:3000
   - **Database (PostgreSQL):** localhost:5432

That's it! All services will start automatically and the database will be created. **Database migrations and seeding will run automatically** on the first startup, so you'll have sample data ready to use immediately.

## What's Included

- **Rails API** (`foody_api/`) - Ruby on Rails API server on port 3000
- **React Frontend** (`foody_ui/`) - React + TypeScript + Vite on port 5173
- **PostgreSQL Database** - Running on port 5432

## Database Access

**Credentials:**
- Database: `foody_development`
- Username: `foody_user`
- Password: `password123`
- Host: `localhost` (or `postgres` from within containers)

**Rails console:**
```bash
docker-compose exec foody_api rails console
```

**Database migrations:**
```bash
docker-compose exec foody_api rails db:migrate
```

**Seed database:**
```bash
docker-compose exec foody_api rails db:seed
```

> **Note:** Migrations and seeding happen automatically when the API container starts, so you typically don't need to run these commands manually.

**Direct database access:**
```bash
docker-compose exec postgres psql -U foody_user -d foody_development
```

**Default test user:**
- Email: `user@example.com`
- Password: `password`

This user is automatically created when you run `rails db:seed`.

## Development

All source code is mounted into the containers, so any changes you make will be immediately reflected:

- Rails API changes are picked up automatically
- React changes trigger hot reload in the browser

## Dependency Management

### Adding New Dependencies

When adding new dependencies in Docker, follow these steps to avoid architecture conflicts:

**For Frontend (npm packages):**
```bash
# 1. Add package to package.json or install locally
npm install package-name

# 2. Reinstall in Docker container to fix architecture conflicts
docker-compose run -T --rm foody_ui sh -c "rm -rf node_modules package-lock.json && npm install"

# 3. Restart the container
docker-compose restart foody_ui
```

**For Backend (Ruby gems):**
```bash
# Add gem using bundle add (recommended)
docker-compose exec foody_api bundle add gem-name

# Restart the container
docker-compose restart foody_api
```

**Alternative (manual Gemfile editing):**
```bash
# 1. Add gem to Gemfile manually
echo 'gem "gem-name"' >> foody_api/Gemfile

# 2. Rebuild container to install new gems  
docker-compose build --no-cache foody_api

# 3. Restart the container
docker-compose restart foody_api
```

### Why This Is Important

Docker containers may use different CPU architectures than your host machine. Installing packages locally then running in Docker can cause native binary conflicts, especially with build tools like Vite, Rollup, and native Ruby extensions.

For Ruby gems, `bundle add` is preferred because it properly updates both `Gemfile` and `Gemfile.lock` within the container while syncing changes to your host machine via volume mounting.

## Common Commands

```bash
# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart foody_api

# Run a one off command, such as resetting the database
docker-compose run --rm foody_api rails db:reset

# View logs
docker-compose logs foody_api
docker-compose logs foody_ui

# Rails console
docker-compose exec foody_api rails console

# Install dependencies (use methods above for new packages)
docker-compose exec foody_api bundle install
docker-compose exec foody_ui npm install
```

## Project Structure

```
foody/
├── foody_api/          # Rails API backend
├── foody_ui/           # React frontend
├── docker-compose.yml  # Docker orchestration
└── README.md          # This file
```

Start building your application by modifying the code in `foody_api/` and `foody_ui/`!
