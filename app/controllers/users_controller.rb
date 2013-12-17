class UsersController < ApplicationController
  skip_before_action :require_login, only: [:new, :create], unless: Proc.new{ session[:login].nil? }
  skip_before_action :allow_creation

  def new
    if User.count > 10 # REMEMBER limited to 10 users still!
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

  def show # CommentThread.belongs_to :user ? => [Post, Comment, Event].map(&:remove_reference) :user , that will be a hell of a migration...
    @user = User.find params[:id]
    @posts = Post.joins(:user).where(user_id: params[:id])
    @prefs_meta = { # relocate...
      "email" => ["hidden", "shown"]
    }
  end

  def update
    @user = User.find params[:id]
    @user.update! user_params
    redirect_to :back
  end

  private
    def user_params
      params.require(:user).permit(:handle, :email, :password, :intro, {:prefs => [:email]})
    end
end
