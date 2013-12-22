class HomeController < ApplicationController
  skip_before_action :require_login, :index

  def index
    if session[:login]
      @posts = Post.where.not id: nil # TODO: offset paginate
      @comments = Comment.joins(:comment_threads)
      @events = Event.order(time: :asc).where.not id: nil
    end
  end

  def login
    if @user = User.where(login_params).first
      session[:login] = @user.id
      session[:user_handle] = @user.handle
    else
      flash[:notice] = "Not found."
    end
    redirect_to root_path
  end

  def logout
    session[:login] = nil
    session[:user_handle] = nil
    redirect_to :root
  end

  def ping
    render :nothing => true
  end

  def checkhandle
    maybeuser = User.where checkhandle_params
    case 
    when maybeuser.length == 0 then render text: "true"
    else render text: "\"That username is being used already.\""
    end
  end

  private
    def login_params
      params.require(:user).permit(:email, :password)
    end

    def checkhandle_params
      params.require(:user).permit(:handle)
    end

end
