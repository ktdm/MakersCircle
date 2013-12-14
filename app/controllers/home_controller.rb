class HomeController < ApplicationController
  skip_before_action :require_login, :index

  def index
  end

  def login
    if @user = User.where(login_params).first
      session[:login] = @user.id
      session[:user_handle] = @user.handle
    else
      flash[:notice] = "Not found."
    end
    redirect_to posts_path
  end

  def logout
    session[:login] = nil
    session[:user_handle] = nil
    redirect_to :root
  end

  def ping
    render :nothing => true
  end

  private
    def login_params
      params.require(:user).permit(:email, :password)
    end

end
