class EventsController < ApplicationController

  def index
    @events = Event.take(10)
  end

  def create
    @event = Event.new event_params
    @event.users = [session[:login]]
    @event.save
    @event.comment_threads << CommentThread.new(comment_thread_params)
    redirect_to @event
  end

  def show
    @event = begin
      Event.unscoped.includes(:comment_threads).find params[:id]
    rescue
      Event.new(id: params[:id])
    end
    @comments = @event.comment_threads.first.comments.includes(:user).order(id: :asc)
  end

  def update
    @event = Event.unscoped.find params[:id]
    @event.update! event_params rescue 0
    @event.comment_threads.first.update! comment_thread_params rescue 0
    if ["Add self", "Remove self"].include? params[:commit]
      @event.users << session[:login] if params[:commit] == "Add self"
      @event.users.delete(session[:login]) if params[:commit] == "Remove self"
      @event.save
    end
    redirect_to :back
  end

  def destroy
    event = Event.find params[:id]
    event.destroy
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
