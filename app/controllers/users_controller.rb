class UsersController < ApplicationController
  skip_before_action :require_login, only: [:new, :create], unless: Proc.new{ session[:login].nil? }

  def new
    if User.count > 10
      redirect_to :root
    else
      @user = User.new
    end
  end

  def create
    @user = User.new user_params
    @user.role = "basic" #change to default
    @user.save
    session[:login] = @user.id
    session[:user_handle] = @user.handle
    redirect_to @user
  end

  def show
    @user = User.find params[:id]
  end

  private
    def user_params
      params.require(:user).permit(:handle, :email, :password)
    end
end
