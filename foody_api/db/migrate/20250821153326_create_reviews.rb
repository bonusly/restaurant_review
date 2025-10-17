class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.integer :rating, null: false
      t.text :comment, null: false
      t.references :user, null: false, foreign_key: true
      t.references :restaurant, null: false, foreign_key: true

      t.timestamps
    end

    add_index :reviews, :rating
    add_index :reviews, [:restaurant_id, :created_at]
    add_index :reviews, [:user_id, :created_at]
    add_index :reviews, [:restaurant_id, :user_id]
  end
end
