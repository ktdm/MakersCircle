class PostsController < ApplicationController
  def index
    @posts = Post.take(10)
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

end
