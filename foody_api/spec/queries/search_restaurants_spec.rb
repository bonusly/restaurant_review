require 'rails_helper'

RSpec.describe SearchRestaurants, type: :query do
  # Integration example showing typical usage patterns
  describe 'integration examples' do
    let!(:pizza_place) { create(:restaurant, :italian, :budget, name: "Tony's Pizza") }
    let!(:fine_dining) { create(:restaurant, :french, :upscale, name: "Le Bistro") }
    let!(:taco_truck) { create(:restaurant, :mexican, :budget, name: "El Taco") }

    it 'demonstrates common search patterns' do
      # Search for budget Italian restaurants
      result = SearchRestaurants.call(
        filters: { cuisine_type: :italian, max_price: 1 }
      )
      expect(result).to eq([pizza_place])

      # Search for restaurants with "taco" in name
      result = SearchRestaurants.call(
        filters: { name: 'taco' }
      )
      expect(result).to eq([taco_truck])

      # Get all restaurants (sorted by name by default)
      result = SearchRestaurants.call
      expect(result.map(&:name)).to eq(["El Taco", "Le Bistro", "Tony's Pizza"])
    end
  end
  describe '.call' do
    let!(:italian_budget) { create(:restaurant, :italian, :budget, name: "Tony's Pizza") }
    let!(:italian_upscale) { create(:restaurant, :italian, :upscale, name: "Bella Vista") }
    let!(:mexican_moderate) { create(:restaurant, :mexican, :moderate, name: "Casa Mexico") }
    let!(:thai_budget) { create(:restaurant, :thai, :budget, name: "Thai Garden") }
    let!(:american_upscale) { create(:restaurant, :american, :upscale, name: "Main Street Grill") }

    context 'without parameters' do
      it 'returns all restaurants with default sorting' do
        result = SearchRestaurants.call
        expect(result).to match_array([italian_budget, italian_upscale, mexican_moderate, thai_budget, american_upscale])
      end

      it 'sorts by name asc by default' do
        result = SearchRestaurants.call
        expect(result.map(&:name)).to eq(["Bella Vista", "Casa Mexico", "Main Street Grill", "Thai Garden", "Tony's Pizza"])
      end
    end

    context 'with empty parameters' do
      it 'returns all restaurants' do
        result = SearchRestaurants.call({})
        expect(result.count).to eq(5)
      end

      it 'handles nil params' do
        result = SearchRestaurants.call(nil)
        expect(result.count).to eq(5)
      end
    end

    context 'filtering' do
      describe 'by name' do
        it 'filters restaurants by partial name match' do
          result = SearchRestaurants.call(filters: { name: 'pizza' })
          expect(result).to include(italian_budget)
          expect(result).not_to include(italian_upscale, mexican_moderate, thai_budget, american_upscale)
        end

        it 'filters restaurants with case insensitive search' do
          result = SearchRestaurants.call(filters: { name: 'BELLA' })
          expect(result).to include(italian_upscale)
          expect(result.count).to eq(1)
        end

        it 'returns empty array when no matches found' do
          result = SearchRestaurants.call(filters: { name: 'nonexistent' })
          expect(result).to be_empty
        end

        it 'ignores empty name filter' do
          result = SearchRestaurants.call(filters: { name: '' })
          expect(result.count).to eq(5)
        end
      end

      describe 'by cuisine_type' do
        it 'filters restaurants by cuisine type symbol' do
          result = SearchRestaurants.call(filters: { cuisine_type: :italian })
          expect(result).to include(italian_budget, italian_upscale)
          expect(result).not_to include(mexican_moderate, thai_budget, american_upscale)
        end

        it 'filters restaurants by cuisine type string' do
          result = SearchRestaurants.call(filters: { cuisine_type: 'mexican' })
          expect(result).to include(mexican_moderate)
          expect(result.count).to eq(1)
        end

        it 'ignores empty cuisine_type filter' do
          result = SearchRestaurants.call(filters: { cuisine_type: '' })
          expect(result.count).to eq(5)
        end
      end

      describe 'by max_price' do
        it 'filters restaurants by max price (budget only)' do
          result = SearchRestaurants.call(filters: { max_price: 1 })
          expect(result).to include(italian_budget, thai_budget)
          expect(result).not_to include(italian_upscale, mexican_moderate, american_upscale)
        end

        it 'filters restaurants by max price (moderate and below)' do
          result = SearchRestaurants.call(filters: { max_price: 2 })
          expect(result).to include(italian_budget, mexican_moderate, thai_budget)
          expect(result).not_to include(italian_upscale, american_upscale)
        end

        it 'includes all restaurants when max price is upscale' do
          result = SearchRestaurants.call(filters: { max_price: 3 })
          expect(result.count).to eq(5)
        end

        it 'ignores empty max_price filter' do
          result = SearchRestaurants.call(filters: { max_price: '' })
          expect(result.count).to eq(5)
        end
      end


      describe 'multiple filters' do
        it 'combines name and cuisine_type filters' do
          result = SearchRestaurants.call(filters: { name: 'bella', cuisine_type: :italian })
          expect(result).to include(italian_upscale)
          expect(result.count).to eq(1)
        end

        it 'combines cuisine_type and max_price filters' do
          result = SearchRestaurants.call(filters: { cuisine_type: :italian, max_price: 1 })
          expect(result).to include(italian_budget)
          expect(result).not_to include(italian_upscale)
        end


        it 'combines all filters' do
          result = SearchRestaurants.call(filters: {
            name: 'thai',
            cuisine_type: :thai,
            max_price: 1
          })
          expect(result).to include(thai_budget)
          expect(result.count).to eq(1)
        end
      end
    end


    context 'instance methods' do
      it 'can be instantiated and called' do
        query = SearchRestaurants.new(filters: { cuisine_type: :italian })
        result = query.call
        expect(result).to include(italian_budget, italian_upscale)
        expect(result.count).to eq(2)
      end

      it 'handles nil params in initialize' do
        query = SearchRestaurants.new(nil)
        result = query.call
        expect(result.count).to eq(5)
      end
    end
  end
end
