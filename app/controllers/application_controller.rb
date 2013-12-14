class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :require_login

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private
 
  def require_login
    unless session[:login]
      flash[:notice] = "Must be logged in."
      redirect_to :root
    end
    session[:return_to] ||= request.referer
  end
end
