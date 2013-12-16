class PostsController < ApplicationController
  before_action only: [:new, :create] do |ctr|
    redirect_to ( session.delete(:return_to) || root_path ) unless allow :post
  end

  def index
    @posts = Post.where.not id: nil # TODO: offset paginate
    @allow = [:post, :event].inject ({}) {|memo, obj| memo.merge obj.to_sym => allow(obj) }
    @threads = CommentThread.where(commentable_type: "Comment").joins(:comments).uniq
    @events = Event.order(time: :asc).where.not id: nil
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
    @post = begin
      Post.includes(:comment_threads).find params[:id]
    rescue
      Post.new(id: params[:id])
    end
    @comments = @post.comment_threads.first.comments.includes(:user).order(id: :asc)
  end

  def update
    @post = Post.find params[:id]
    @post.update! post_params rescue 0
    @post.comment_threads.first.update! comment_thread_params rescue 0
    redirect_to :back
  end

  def destroy
    post = Post.find params[:id]
    post.destroy
    redirect_to post_path(params[:id])
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
