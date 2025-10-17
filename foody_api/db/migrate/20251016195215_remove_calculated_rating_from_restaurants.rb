class RemoveCalculatedRatingFromRestaurants < ActiveRecord::Migration[8.0]
  def change
    remove_column :restaurants, :calculated_rating, :decimal, precision: 3, scale: 2, default: 0.0 if column_exists?(:restaurants, :calculated_rating)
    remove_index :restaurants, name: "index_restaurants_on_calculated_rating", if_exists: true
  end
end
