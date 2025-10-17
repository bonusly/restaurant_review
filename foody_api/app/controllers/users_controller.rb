class UsersController < ApplicationController
  allow_unauthenticated_access only: %i[ create ]

  # GET /me
  def me
    render json: UserBlueprint.render_as_hash(Current.user), status: :ok
  end

  # POST /users
  def create
    user = User.new(user_params)

    if user.save
      start_new_session_for(user)
      render json: UserBlueprint.render_as_hash(user), status: :created
    else
      render json: {
        message: "Registration failed",
        errors: user.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  private

  def user_params
    params.permit(:email_address, :password, :password_confirmation)
  end
end
