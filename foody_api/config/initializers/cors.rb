# CORS configuration for API access from frontend
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow requests from the React frontend (running on port 5173)
    origins "http://localhost:5173"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true  # Allow cookies to be sent with requests
  end
end
