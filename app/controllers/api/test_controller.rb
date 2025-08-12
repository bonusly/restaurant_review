class Api::TestController < ApplicationController
  def ping
    message = params[:message]

    if message == "ping"
      render json: { response: "pong" }
    else
      render json: { error: "Expected 'ping', received '#{message}'" }, status: 400
    end
  end
end
