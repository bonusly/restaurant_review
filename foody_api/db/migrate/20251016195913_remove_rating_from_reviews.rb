class RemoveRatingFromReviews < ActiveRecord::Migration[8.0]
  def change
    remove_column :reviews, :rating, :integer if column_exists?(:reviews, :rating)
    remove_index :reviews, name: "index_reviews_on_rating", if_exists: true
  end
end
