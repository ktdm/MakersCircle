class AddIntroAndPrefsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :intro, :text, default: ""
    add_column :users, :prefs, :text, default: { "email" => "hidden" }
  end
end
