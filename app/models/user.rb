class User < ActiveRecord::Base
  has_many :posts
  has_many :comments

  serialize :prefs
  after_initialize :default_prefs
  before_save :serialize_to_hash

  private
    def default_prefs
      self.prefs ||= {
        email: :hidden
      }
    end

    def serialize_to_hash
      self.prefs = self.prefs.to_hash
    end
end
