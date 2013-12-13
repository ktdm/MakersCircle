class AddCommentableToPostComment < ActiveRecord::Migration
  def change
    create_table :comment_threads do |t|
      t.string :title
      t.integer :comment_count
      t.references :commentable, polymorphic: true
    end
    change_table :comments do |t|
      t.remove :post_id
      t.references :comment_thread, index: true
    end
  end
end
