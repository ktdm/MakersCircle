class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  belongs_to :replies_to, class_name: "Comment"
  has_many :replies,  class_name: "Comment", foreign_key: :comment_id #change to :reply_id
end
