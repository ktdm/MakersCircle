class CommentsController < ApplicationController

  def create
    @comment = Comment.new(comment_params)
    @comment.comment_id = begin
      Comment.order(id: :desc).find_by_post_id(@comment.post_id).id #move to after_save
    rescue
      Comment.order(id: :desc).pluck(:id)
    end
    @comment.user_id = session[:login]
    @comment.save
    redirect_to :back
  end

  private
    def comment_params
      params.require(:comment).permit(:body, :post_id, :comment_id)
    end

end
