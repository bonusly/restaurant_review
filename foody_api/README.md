# Foody API - Rails Backend

A Ruby on Rails API server for the Foody restaurant review platform, providing authentication, restaurant management, and review functionality.

## Tech Stack

- **Ruby 3.4.5** - Programming language
- **Rails 8.0** - Web framework (API mode)
- **PostgreSQL** - Database
- **Blueprinter** - JSON serialization
- **OliveBranch** - Automatic case conversion (snake_case ↔ camelCase)

## Local Development Setup

### Prerequisites

- Ruby 3.4.5
- PostgreSQL
- Bundler

### Getting Started

1. Install dependencies:
```bash
bundle install
```

2. Set up the database:
```bash
rails db:create db:migrate db:seed
```

3. Start the Rails server:
```bash
rails server
```

The API will be available at `http://localhost:3000`

## Adding New Gems

```bash
# Add a new gem
bundle add gem-name

# Or edit Gemfile manually and run:
bundle install
```

## Database Management

### Migrations

```bash
# Create a new migration
rails generate migration MigrationName

# Run migrations
rails db:migrate

# Rollback last migration
rails db:rollback
```

### Seeds

```bash
# Run seeds
rails db:seed

# Reset database (drop, create, migrate, seed)
rails db:reset
```

### Console

```bash
# Rails console
rails console

# Database console
rails db
```

## API Endpoints

### Authentication

- `POST /session` - Login (returns user + sets session cookie)
- `DELETE /session` - Logout
- `POST /users` - Register (returns user + sets session cookie)
- `GET /me` - Get current user (requires authentication)

### Restaurants

- `GET /restaurants` - List restaurants with filtering and sorting
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/:id/reviews` - Get restaurant reviews

### Reviews

- `POST /restaurants/:id/reviews` - Create a review (requires authentication)

## Request/Response Format

### Case Conversion

The API automatically converts between JSON formats:
- **Incoming requests**: camelCase → snake_case
- **Outgoing responses**: snake_case → camelCase

Send requests with camelCase:
```json
{
  "emailAddress": "user@example.com",
  "maxPrice": 3
}
```

Receive responses in camelCase:
```json
{
  "id": 1,
  "emailAddress": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Headers

All requests should include:
```
Content-Type: application/json
Key-Inflection: camel
```

The HTTP client in the frontend automatically sets these headers.

## Authentication

The API uses **session-based authentication** with HTTP-only cookies:

- Sessions are stored in the database
- Cookies are secure in production, non-secure in development
- CORS is configured to allow credentials from the frontend

### Session Management

Sessions include:
- User ID reference
- User agent tracking
- IP address logging
- Automatic cleanup on logout

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Human-readable error message",
  "errors": ["Detailed validation errors"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `401` - Unauthorized (not logged in)
- `404` - Not found
- `422` - Unprocessable entity (validation errors)

## Environment Configuration

### Development (.env)

```env
DATABASE_URL=postgresql://foody_user:password123@localhost:5432/foody_development
RAILS_ENV=development
```

### Docker Environment

Environment variables are configured in `docker-compose.yml` for the PostgreSQL connection.

## Testing

```bash
# Run all tests
rspec

# Run specific test
rspec spec/requests/restaurants_spec.rb

# Run with coverage
rspec --format documentation
```

## Project Structure

```
app/
├── controllers/
│   ├── application_controller.rb    # Base controller with error handling
│   ├── sessions_controller.rb       # Authentication endpoints
│   ├── users_controller.rb         # User management
│   └── restaurants_controller.rb    # Restaurant and review endpoints
├── models/
│   ├── user.rb                     # User model with authentication
│   ├── restaurant.rb               # Restaurant model with reviews
│   ├── review.rb                   # Review model
│   ├── session.rb                  # Session tracking
│   └── current.rb                  # Current user context
├── blueprints/
│   ├── user_blueprint.rb           # User JSON serialization
│   ├── restaurant_blueprint.rb     # Restaurant JSON serialization
│   └── review_blueprint.rb         # Review JSON serialization
└── controllers/concerns/
    └── authentication.rb           # Authentication logic
```

## Deployment

### Production Environment

- Set `RAILS_ENV=production`
- Configure secure database URL
- Set up SSL certificates
- Enable `force_ssl` in production
- Configure CORS for production domain

## Troubleshooting

### Database Connection Issues

1. Check PostgreSQL is running:
```bash
brew services list | grep postgresql
# or
sudo service postgresql status
```

2. Reset database:
```bash
rails db:reset
```

### Gem Installation Issues

If you encounter issues with native gems, ensure you have the required system dependencies installed.

### CORS Issues

Ensure the frontend URL is added to the CORS configuration in `config/initializers/cors.rb`.