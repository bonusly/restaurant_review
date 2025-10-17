class AddUniqueIndexToReviews < ActiveRecord::Migration[8.0]
  def change
    add_index :reviews, [:user_id, :restaurant_id], unique: true
  end
end
