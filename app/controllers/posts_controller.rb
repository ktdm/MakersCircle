class PostsController < ApplicationController
  before_action only: [:new, :create] do |ctr|
    redirect_to ( session.delete(:return_to) || root_path ) unless allow :post
  end

  def index
    @posts = Post.all
    @allow = [:post, :event].inject ({}) {|memo, obj| memo.merge obj.to_sym => allow(obj) }
    @threads = CommentThread.where(commentable_type: "Comment")
    @events = Event.order(time: :asc).all
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new post_params
    @post.user_id = session[:login]
    @post.save
    @post.comment_threads << CommentThread.new(comment_thread_params)
    redirect_to @post
  end

  def show
    @post = Post.find params[:id]
    @comments = @post.comment_threads.first.comments.order(id: :asc)
  end

  private
    def post_params
      params.require(:post).permit(:item, :kind)
    end

    def comment_thread_params
      params.require(:comment_thread).permit(:title)
    end

    def allow thread # if I need it
      if thread == :post
        Post.where(user_id: session[:login]).count < 10
      elsif thread == :event
        true
      end
    end

end
