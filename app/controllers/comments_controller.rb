class CommentsController < ApplicationController

  def show
    @thread = Comment.find(params[:id]).comment_threads.first
    @comments = @thread.comments.order(id: :asc)
#    if comment.post_id.nil? and comment.comment_id.nil?
#      comment.comments = Comment.find_all_by_commen
#    else
#      render :404
#    end
  end

  def create
    comment = Comment.new(comment_params)
    comment.save
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
    redirect_to ( comment_thread_params[:id] ? :back : comment_path(comment.id))
  end

  def new # TODO: move most of these to a comment_threads_controller
    @comment = Comment.new
  end

  private
    def comment_params
      params.require(:comment).permit(:body, :comment_id)
    end
    def comment_thread_params
      params.require(:comment_thread).permit(:title, :id)
    end

end
