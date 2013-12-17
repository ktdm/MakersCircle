class CommentsController < ApplicationController

  def index
    @comments = Comment.joins(:comment_threads).take(10)
  end

  def show
    @original_comment = begin
      Comment.includes(:comment_threads, :user).find(params[:id])
    rescue
      Comment.new(id: params[:id])
    end
    if @original_comment.comment_threads.empty?
      thread = CommentThread.find @original_comment.comment_thread_id
      redirect_to self.send(:"#{thread.commentable_type.downcase}_path", thread.commentable_id)
    else
      @comments = @original_comment.comment_threads.first.comments.includes(:user).order(id: :asc)
    end
  end

  def create
    comment = Comment.create! comment_params
    thread = comment_thread_params[:id] ?
      CommentThread.find(comment_thread_params[:id]) :
      CommentThread.create!({ commentable_type: "Comment", commentable_id: comment.id }.merge comment_thread_params)
    comment.comment_thread_id = thread.id
    comment.comment_id = begin
      Comment.order(id: :desc).where(comment_thread_id: thread.id).pluck(:id) #move to after_save (racy?)
    rescue
      nil
    end
    comment.user_id = session[:login]
    comment.save
    redirect_to ( comment_thread_params[:id] ? :back : comment_path(comment.id) )
  end

  def new # TODO: move most of these to a comment_threads_controller
    @comment = Comment.new
  end

  def update
    @comment = Comment.find params[:id]
    @comment.update! comment_params
    @comment.comment_threads.first.update! comment_thread_params rescue 0
    redirect_to :back
  end

  def destroy
    comment = Comment.find params[:id]
    comment.destroy
    redirect_to comment_path(params[:id])
  end

  private
    def comment_params
      params.require(:comment).permit(:body, :comment_id)
    end
    def comment_thread_params
      params.require(:comment_thread).permit(:title, :id)
    end

end
