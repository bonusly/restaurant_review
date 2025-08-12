# Rails + React + API Demo

A minimal Rails application demonstrating the integration between Rails, React, and API communication. This serves as a starting point for interview assignments or development projects.

## Features

- **User Authentication**: Complete signup/signin functionality using Devise
- **React Integration**: React components rendered server-side via react-rails
- **API Communication**: Simple ping/pong API to demonstrate frontend-backend communication
- **PostgreSQL Database**: Containerized database setup with Docker Compose
- **Tailwind CSS**: Modern utility-first CSS framework for responsive design

## Prerequisites

Before running this application, make sure you have the following installed:

- **Ruby** (version 3.4.5 or compatible)
- **Rails** (version 8.0.2 or compatible)
- **Docker** and **Docker Compose**
- **Bundler** gem

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd restaurant_review

# Install Ruby dependencies
bundle install
```

### 2. Start the Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Wait a moment for the database to initialize, then run migrations
rails db:create
rails db:migrate
```

### 3. Seed the Database and Start the Application

```bash
# Create default user and other seed data
rails db:seed

# Build Tailwind CSS
rails tailwindcss:build

# Start the Rails server
rails server

# Visit http://localhost:3000 in your browser
```

### Alternative: Use the development script (recommended)

```bash
# This starts both Rails and watches Tailwind for changes
bin/dev

# Visit http://localhost:3000 in your browser
```

## Default Login Credentials

For quick testing, a default user is created when you run `rails db:seed`:

- **Email**: `user@example.com`
- **Password**: `password`

You can also create your own account using the sign-up form.

## How It Works

This application demonstrates a complete Rails + React + API workflow:

1. **Authentication Flow**: Users must sign up/sign in to access the main application
2. **Rails to React**: The home controller passes a "ping" message as a prop to the React component
3. **React to API**: The React component makes a POST request to `/api/test/ping` with the message
4. **API Response**: The API controller responds with "pong" if it receives "ping"
5. **UI Update**: The React component displays the API response, confirming the full stack integration

## Application Structure

### Key Files

- `app/controllers/home_controller.rb` - Main page controller that renders the React component
- `app/controllers/api/test_controller.rb` - API controller handling ping/pong requests
- `app/views/home/index.html.erb` - View that renders the React component with props
- `app/assets/javascripts/components/RestaurantApp.js.jsx` - Main React component
- `config/routes.rb` - Application and API routing
- `docker-compose.yml` - PostgreSQL container configuration

### Authentication

- Powered by Devise gem
- Users must be authenticated to access the main application
- Authentication state is passed to React components as props

### API Endpoints

- `POST /api/test/ping` - Accepts a message parameter, returns "pong" if message is "ping"
- Requires user authentication
- Includes CSRF protection

## Database Management

### Starting the Database
```bash
docker-compose up -d
```

### Stopping the Database
```bash
docker-compose down
```

### Reset Database (removes all data)
```bash
docker-compose down -v
rails db:create db:migrate
```

### Database Configuration
The application connects to PostgreSQL running in Docker:
- **Host**: localhost
- **Port**: 5434
- **Username**: postgres
- **Password**: password
- **Database**: restaurant_review_development

## Development Notes

### React Integration
- Uses react-rails gem for server-side rendering
- Components are written in JSX and located in `app/assets/javascripts/components/`
- Props are passed from Rails controllers to React components
- Includes CSRF token handling for API requests

### Styling with Tailwind CSS
- Modern utility-first CSS framework included
- Responsive design out of the box
- Custom Tailwind configuration in `app/assets/tailwind/application.css`
- Automatic rebuilding in development with `bin/dev`
- Production builds with `rails tailwindcss:build`

### API Design
- RESTful API structure under `/api` namespace
- JSON responses with appropriate HTTP status codes
- Authentication required for all API endpoints
- Error handling for malformed requests

## Testing

This application includes comprehensive test suites for both backend and frontend code:

### Backend Testing (RSpec)

**Setup:**
- Uses RSpec for request specs and controller testing
- FactoryBot for test data generation
- Devise test helpers for authentication testing

**Running Backend Tests:**
```bash
# Run all RSpec tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/requests/api/test_controller_spec.rb

# Run with documentation format
bundle exec rspec --format documentation
```

**Test Coverage:**
- API endpoint testing (`POST /api/test/ping`)
- Authentication flow testing
- Request/response validation
- Error handling scenarios
- HTTP method restrictions
- Parameter validation

### Frontend Testing (Jest + Testing Library)

**Setup:**
- Jest as the test runner
- React Testing Library for component testing
- JSDOM environment for DOM simulation
- Mock functions for API calls and browser APIs

**Running Frontend Tests:**
```bash
# Run all Jest tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**Test Coverage:**
- Component rendering validation
- Props handling and defaults
- Authentication state display
- User interface interactions
- CSS class verification
- Error boundary testing

### Test Configuration Files

- **RSpec**: `spec/rails_helper.rb`, `spec/spec_helper.rb`
- **Jest**: `jest.config.js`, `spec/javascript/support/setup.js`
- **Factories**: `spec/factories/users.rb`

### Writing Tests

**Backend Example:**
```ruby
RSpec.describe "Api::TestController", type: :request do
  let(:user) { create(:user) }

  before do
    post user_session_path, params: {
      user: { email: user.email, password: user.password }
    }
  end

  it "returns pong for ping message" do
    post "/api/test/ping", params: { message: "ping" }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["response"]).to eq("pong")
  end
end
```

**Frontend Example:**
```javascript
import { render, screen } from "@testing-library/react";
import RestaurantReview from "../../../app/javascript/components/RestaurantReview";

test("renders component with user authentication", () => {
  const mockUser = { email: "test@example.com" };

  render(<RestaurantReview currentUser={mockUser} message="ping" />);

  expect(screen.getByText("Restaurant Review Platform")).toBeInTheDocument();
  expect(screen.getByText(/Welcome, test@example.com/)).toBeInTheDocument();
});
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Recreate the database
docker-compose down -v
docker-compose up -d
rails db:create db:migrate
```

### React/JavaScript Issues
```bash
# Restart the Rails server
rails server

# Check browser console for errors
# Ensure all gems are installed
bundle install
```

### Styling Issues
```bash
# Rebuild Tailwind CSS
rails tailwindcss:build

# For development with auto-rebuild
bin/dev
```

### Port Conflicts
If port 5434 is already in use, update `docker-compose.yml` and `config/database.yml` to use a different port.

## Docker Commands Reference

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs postgres

# Stop services
docker-compose down

# Remove all data and containers
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

## Running the Full Test Suite

To run all tests and ensure everything is working:

```bash
# Backend tests
bundle exec rspec

# Frontend tests
npm test

# Both with single command (create this script)
npm run test:all  # runs both RSpec and Jest
```

## License

This project is intended for educational and interview purposes.
