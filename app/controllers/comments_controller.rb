class CommentsController < ApplicationController

  def show
    comment = Comment.find(params[:id])
    if comment.comment_threads.empty?
      thread = CommentThread.find comment.comment_thread_id
      redirect_to self.send(:"#{thread.commentable_type.downcase}_path", thread.commentable_id)
    else
      @comments = comment.comment_threads.first.comments.order(id: :asc)
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

  private
    def comment_params
      params.require(:comment).permit(:body, :comment_id)
    end
    def comment_thread_params
      params.require(:comment_thread).permit(:title, :id)
    end

end
