class EventsController < ApplicationController

  def new
    @event = Event.new
  end

  def create
    @event = Event.new event_params
    @event.users = [session[:login]]
    @event.save
    @event.comment_threads << CommentThread.new(comment_thread_params)
    redirect_to @event
  end

  def show
    @event = Event.find params[:id]
    @comments = @event.comment_threads.first.comments.order(id: :asc)
  end

  def update
    @event = Event.find params[:id]
    case params[:commit]
      when "Add self" then @event.users << session[:login]
      when "Remove self" then @event.users.delete(session[:login])
    end
    @event.save
    redirect_to event_path(params[:id])
  end

  private
    def event_params
      params.require(:event).permit(:time, :details)
    end

    def comment_thread_params
      params.require(:comment_thread).permit(:title, :id)
    end

end
