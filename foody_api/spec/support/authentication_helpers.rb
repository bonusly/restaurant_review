module AuthenticationHelpers
  def sign_in_as(user)
    session = user.sessions.create!(
      ip_address: "127.0.0.1",
      user_agent: "Rails Testing"
    )

    # Stub the authentication methods to simulate being logged in
    allow_any_instance_of(ApplicationController).to receive(:resume_session).and_return(session)
    allow(Current).to receive(:session).and_return(session)
    allow(Current).to receive(:user).and_return(user)

    session
  end

  def sign_out
    allow_any_instance_of(ApplicationController).to receive(:resume_session).and_return(nil)
    allow(Current).to receive(:session).and_return(nil)
    allow(Current).to receive(:user).and_return(nil)
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :request
end
