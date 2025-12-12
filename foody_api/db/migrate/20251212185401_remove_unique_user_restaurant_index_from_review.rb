class RemoveUniqueUserRestaurantIndexFromReview < ActiveRecord::Migration[8.0]
  def change
    remove_index :reviews, name: "index_reviews_on_user_id_and_restaurant_id", if_exists: true
  end
end
