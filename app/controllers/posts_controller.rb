class PostsController < ApplicationController

  def index
    @posts = Post.all
    @posts.each do |post|
      post.user = User.find post.user_id
    end
    @existing = Post.find_by_user_id session[:login]
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new post_params
    @post.user_id = session[:login]
    @post.save
    redirect_to @post
  end

  def show
    @post = Post.find params[:id]
    @comments = Comment.order(id: :asc).find_all_by_post_id(params[:id])
    @comments.each do |comment|
      comment.user = User.find comment.user_id
    end
  end

  private
    def post_params
      params.require(:post).permit(:item, :kind)
    end

end
