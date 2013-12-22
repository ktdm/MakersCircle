class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :require_login
  before_action :allow_creation, only: [:new, :create]

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def allow_create thread
    case thread
      when :posts then Post.where(user_id: session[:login]).count < 10
      when :comments then true
      when :events then true
    end
  end

  private
    def require_login
      unless session[:login]
        flash[:notice] = "Must be logged in."
        redirect_to :root
      end
      session[:return_to] ||= request.referer
    end

    def allow_creation
      redirect_to ( session.delete(:return_to) || root_path ) unless allow_create controller_name.to_sym
    end
end
