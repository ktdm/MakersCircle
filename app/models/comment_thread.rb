class CommentThread < ActiveRecord::Base
  belongs_to :commentable, polymorphic: true
  has_many :comments
  # accepts_nested_attributes_for :comments
end
