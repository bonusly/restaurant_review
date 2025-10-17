class CreateRestaurants < ActiveRecord::Migration[8.0]
  def change
    create_table :restaurants do |t|
      t.string :name, null: false
      t.integer :cuisine_type, null: false
      t.integer :price_range, null: false
      t.string :address
      t.text :description
      t.string :phone
      t.string :image_url

      t.timestamps
    end

    add_index :restaurants, :name
    add_index :restaurants, :cuisine_type
    add_index :restaurants, :price_range
  end
end
