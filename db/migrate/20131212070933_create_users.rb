class CreateUsers < ActiveRecord::Migration
  def change

    create_table :users do |t|
      t.string :handle
      t.string :role
      t.string :email
      t.string :password

      t.timestamps
    end

    create_table :posts do |t|
      t.text :item
      t.string :kind
      t.references :user, index: true

      t.timestamps
    end

    create_table :comments do |t|
      t.text :body
      t.references :user, index: true
      t.references :post, index: true
      t.references :comment, index: true

      t.timestamps
    end

    create_table :events do |t|
      t.text :details
      t.datetime :time
      t.text :users

      t.timestamps
    end

  end
end
