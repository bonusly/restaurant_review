Rails.application.config.session_store :cookie_store,
  key: '_foody_api_session',
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax
