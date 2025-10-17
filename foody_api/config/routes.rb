Rails.application.routes.draw do
  # Authentication routes
  resource :session
  resources :passwords, param: :token
  resources :users, only: [ :create ]
  get "me", to: "users#me"

  # Restaurant routes
  resources :restaurants, only: [:index, :show] do
    member do
      get 'reviews', to: 'restaurants#reviews'           # GET /restaurants/:id/reviews
      post 'reviews', to: 'restaurants#create_review'    # POST /restaurants/:id/reviews
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
