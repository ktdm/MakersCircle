class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :comment_thread, counter_cache: :comment_count
  belongs_to :replies_to, class_name: "Comment"
  has_many :replies,  class_name: "Comment", foreign_key: :comment_id #change to :reply_id
  has_many :comment_threads, as: :commentable
  accepts_nested_attributes_for :comment_threads
end
