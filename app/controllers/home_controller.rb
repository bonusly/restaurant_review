class HomeController < ApplicationController
  allow_unauthenticated_access

  def index
    @message = "ping"
  end
end
