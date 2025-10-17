class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ create ]

  # POST /session
  def create
    permitted_params = params.permit(:email_address, :password)

    # Check if required parameters are present
    if permitted_params[:email_address].blank? || permitted_params[:password].blank?
      render json: {
        message: "Authentication failed",
        errors: [ "Invalid email address or password" ]
      }, status: :unauthorized
      return
    end

    user = User.authenticate_by(permitted_params)

    if user
      start_new_session_for(user)
      render json: UserBlueprint.render_as_hash(user), status: :ok
    else
      render json: {
        message: "Authentication failed",
        errors: [ "Invalid email address or password" ]
      }, status: :unauthorized
    end
  end

  # DELETE /session
  def destroy
    terminate_session
    head :no_content
  end
end
