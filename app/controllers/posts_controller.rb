class PostsController < ApplicationController
  before_action only: [:new, :create] do |ctr|
    redirect_to ( session.delete(:return_to) || :root ) unless allow_create
  end

  def index
    @posts = Post.all
    @allow_create = allow_create
    @threads = CommentThread.where(commentable_type: "Comment")
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
    @thread = @post.comment_threads.first
    @comments = @thread.comments.order(id: :asc)
  end

  private
    def post_params
      params.require(:post).permit(:item, :kind)
    end

    def comment_thread_params
      params.require(:comment_thread).permit(:title)
    end

    def allow_create
      Post.where(user_id: session[:login]).count < 10
    end

end
