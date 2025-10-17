require 'rails_helper'

RSpec.describe Restaurant, type: :model do
  # Test data setup
  let(:valid_attributes) do
    {
      name: "Mario's Italian Kitchen",
      cuisine_type: :italian,
      price_range: :moderate,
      address: "123 Main St, New York, NY 10001",
      description: "Authentic Italian cuisine in the heart of NYC",
      phone: "(555) 123-4567",
      image_url: "https://example.com/restaurant.jpg"
    }
  end

  let(:restaurant) { build(:restaurant, valid_attributes) }

  describe "associations" do
    it { is_expected.to have_many(:reviews).dependent(:destroy) }
  end

  describe "enums" do
    describe "cuisine_type" do
      it "defines all expected cuisine types" do
        expected_cuisines = %w[
          italian mexican chinese japanese thai indian french american
          mediterranean korean vietnamese greek spanish lebanese brazilian
        ]
        expect(Restaurant.cuisine_types.keys).to match_array(expected_cuisines)
      end

      it "allows setting cuisine type by symbol" do
        restaurant.cuisine_type = :japanese
        expect(restaurant.cuisine_type).to eq("japanese")
      end

      it "allows setting cuisine type by string" do
        restaurant.cuisine_type = "thai"
        expect(restaurant.cuisine_type).to eq("thai")
      end
    end

    describe "price_range" do
      it "defines budget, moderate, and upscale price ranges" do
        expect(Restaurant.price_ranges).to eq({
          "budget" => 1,
          "moderate" => 2,
          "upscale" => 3
        })
      end

      it "allows setting price range by symbol" do
        restaurant.price_range = :upscale
        expect(restaurant.price_range).to eq("upscale")
      end
    end
  end

  describe "validations" do
    subject { restaurant }

    it { is_expected.to be_valid }

    describe "name" do
      it { is_expected.to validate_presence_of(:name) }
      it { is_expected.to validate_length_of(:name).is_at_most(100) }
      it { is_expected.to validate_length_of(:name).is_at_least(1) }

      it "is invalid with empty name" do
        restaurant.name = ""
        expect(restaurant).not_to be_valid
        expect(restaurant.errors[:name]).to include("can't be blank")
      end

      it "is invalid with name too long" do
        restaurant.name = "a" * 101
        expect(restaurant).not_to be_valid
        expect(restaurant.errors[:name]).to include("is too long (maximum is 100 characters)")
      end
    end

    describe "cuisine_type" do
      it { is_expected.to validate_presence_of(:cuisine_type) }

      it "is invalid without cuisine type" do
        restaurant.cuisine_type = nil
        expect(restaurant).not_to be_valid
        expect(restaurant.errors[:cuisine_type]).to include("can't be blank")
      end
    end

    describe "price_range" do
      it { is_expected.to validate_presence_of(:price_range) }

      it "is invalid without price range" do
        restaurant.price_range = nil
        expect(restaurant).not_to be_valid
        expect(restaurant.errors[:price_range]).to include("can't be blank")
      end
    end


    describe "optional fields" do
      it "is valid without address" do
        restaurant.address = nil
        expect(restaurant).to be_valid
      end

      it "is valid without description" do
        restaurant.description = nil
        expect(restaurant).to be_valid
      end

      it "is valid without phone" do
        restaurant.phone = nil
        expect(restaurant).to be_valid
      end

      it "is valid without image_url" do
        restaurant.image_url = nil
        expect(restaurant).to be_valid
      end

      describe "field length limits" do
        it { is_expected.to validate_length_of(:address).is_at_most(255) }
        it { is_expected.to validate_length_of(:description).is_at_most(1000) }
        it { is_expected.to validate_length_of(:phone).is_at_most(20) }
        it { is_expected.to validate_length_of(:image_url).is_at_most(500) }
      end

      describe "image_url format" do
        it "is valid with http URL" do
          restaurant.image_url = "http://example.com/image.jpg"
          expect(restaurant).to be_valid
        end

        it "is valid with https URL" do
          restaurant.image_url = "https://example.com/image.jpg"
          expect(restaurant).to be_valid
        end

        it "is invalid with invalid URL format" do
          restaurant.image_url = "not-a-url"
          expect(restaurant).not_to be_valid
          expect(restaurant.errors[:image_url]).to include("must be a valid URL")
        end

        it "is invalid with ftp URL" do
          restaurant.image_url = "ftp://example.com/image.jpg"
          expect(restaurant).not_to be_valid
          expect(restaurant.errors[:image_url]).to include("must be a valid URL")
        end
      end
    end
  end

  describe "scopes" do
    let!(:italian_budget) { create(:restaurant, name: "Tony's Pizza", cuisine_type: :italian, price_range: :budget) }
    let!(:italian_upscale) { create(:restaurant, name: "Bella Vista", cuisine_type: :italian, price_range: :upscale) }
    let!(:mexican_moderate) { create(:restaurant, name: "Casa Mexico", cuisine_type: :mexican, price_range: :moderate) }
    let!(:thai_budget) { create(:restaurant, name: "Thai Garden", cuisine_type: :thai, price_range: :budget) }

    describe ".by_name" do
      it "returns restaurants matching partial name (case insensitive)" do
        results = Restaurant.by_name("pizza")
        expect(results).to include(italian_budget)
        expect(results).not_to include(italian_upscale, mexican_moderate, thai_budget)
      end

      it "returns restaurants matching partial name with mixed case" do
        results = Restaurant.by_name("BELLA")
        expect(results).to include(italian_upscale)
        expect(results).not_to include(italian_budget, mexican_moderate, thai_budget)
      end

      it "returns all restaurants when name is blank" do
        results = Restaurant.by_name("")
        expect(results.count).to eq(4)
      end

      it "returns all restaurants when name is nil" do
        results = Restaurant.by_name(nil)
        expect(results.count).to eq(4)
      end
    end

    describe ".by_cuisine" do
      it "returns restaurants with matching cuisine type" do
        results = Restaurant.by_cuisine(:italian)
        expect(results).to include(italian_budget, italian_upscale)
        expect(results).not_to include(mexican_moderate, thai_budget)
      end

      it "accepts string cuisine type" do
        results = Restaurant.by_cuisine("mexican")
        expect(results).to include(mexican_moderate)
        expect(results).not_to include(italian_budget, italian_upscale, thai_budget)
      end

      it "returns all restaurants when cuisine is blank" do
        results = Restaurant.by_cuisine("")
        expect(results.count).to eq(4)
      end
    end

    describe ".by_max_price" do
      it "returns restaurants at or below specified price range" do
        results = Restaurant.by_max_price(2) # moderate or below
        expect(results).to include(italian_budget, mexican_moderate, thai_budget)
        expect(results).not_to include(italian_upscale)
      end

      it "returns budget restaurants only when max price is 1" do
        results = Restaurant.by_max_price(1)
        expect(results).to include(italian_budget, thai_budget)
        expect(results).not_to include(italian_upscale, mexican_moderate)
      end

      it "returns all restaurants when max_price is blank" do
        results = Restaurant.by_max_price("")
        expect(results.count).to eq(4)
      end
    end

  end



  describe "database constraints" do
    it "creates restaurant with valid attributes" do
      expect { create(:restaurant, valid_attributes) }.not_to raise_error
    end
  end
end
