class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Authentication

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_validation_errors

  private

  def render_not_found(exception)
    render json: {
      message: "#{exception.model.constantize.model_name.human} not found",
      errors: []
    }, status: :not_found
  end

  def render_validation_errors(exception)
    render json: {
      message: "#{exception.record.class.model_name.human} could not be created",
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_content
  end
end
