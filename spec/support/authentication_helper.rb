module AuthenticationHelper
  def sign_in_user(user)
    post session_path, params: {
      email_address: user.email_address,
      password: "password" # Use the known factory password
    }
  end

  def sign_out_user
    delete session_path
  end

  def create_and_sign_in_user(user_attributes = {})
    user = create(:user, user_attributes)
    sign_in_user(user)
    user
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelper, type: :request
end
