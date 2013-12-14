class Event < ActiveRecord::Base
  serialize :users
  has_many :comment_threads, as: :commentable
  accepts_nested_attributes_for :comment_threads

  default_scope { where "time > ?", DateTime.now.beginning_of_day }
end
