class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comment_threads, as: :commentable
  accepts_nested_attributes_for :comment_threads
end
