class Api::TestController < ApplicationController
  before_action :ensure_json_request

  def ping
    message = params[:message]

    if message == "ping"
      render json: { response: "pong" }
    else
      render json: { error: "Expected 'ping', received '#{message}'" }, status: 400
    end
  end

  private

  def ensure_json_request
    return if request.format.json?
    render json: { error: "Content-Type must be application/json" }, status: 406
  end

  def request_authentication
    render json: { error: "Authentication required" }, status: 401
  end
end
