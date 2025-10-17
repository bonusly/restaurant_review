require 'rails_helper'

RSpec.describe Review, type: :model do
  # Test data setup
  let(:user) { create(:user) }
  let(:restaurant) { create(:restaurant) }
  let(:valid_attributes) do
    {
      comment: "Great food and excellent service. Would definitely recommend!",
      user: user,
      restaurant: restaurant
    }
  end

  let(:review) { build(:review, valid_attributes) }

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:restaurant) }
  end

  describe "validations" do
    subject { review }

    it { is_expected.to be_valid }


    describe "comment" do
      it { is_expected.to validate_presence_of(:comment) }
      it { is_expected.to validate_length_of(:comment).is_at_least(10) }
      it { is_expected.to validate_length_of(:comment).is_at_most(1000) }

      it "is invalid without comment" do
        review.comment = nil
        expect(review).not_to be_valid
        expect(review.errors[:comment]).to include("can't be blank")
      end

      it "is invalid with empty comment" do
        review.comment = ""
        expect(review).not_to be_valid
        expect(review.errors[:comment]).to include("can't be blank")
      end

      it "is invalid with comment too short" do
        review.comment = "Too short"
        expect(review).not_to be_valid
        expect(review.errors[:comment]).to include("is too short (minimum is 10 characters)")
      end

      it "is valid with comment at minimum length" do
        review.comment = "Good food!"
        expect(review).to be_valid
      end

      it "is invalid with comment too long" do
        review.comment = "a" * 1001
        expect(review).not_to be_valid
        expect(review.errors[:comment]).to include("is too long (maximum is 1000 characters)")
      end

      it "is valid with comment at maximum length" do
        review.comment = "a" * 1000
        expect(review).to be_valid
      end
    end

    describe "user and restaurant uniqueness" do
      it "allows different users to review the same restaurant" do
        existing_review = create(:review, restaurant: restaurant)
        new_review = build(:review, restaurant: restaurant, user: create(:user))
        expect(new_review).to be_valid
      end

      it "allows same user to review different restaurants" do
        existing_review = create(:review, user: user)
        new_review = build(:review, user: user, restaurant: create(:restaurant))
        expect(new_review).to be_valid
      end

      it "prevents same user from reviewing same restaurant twice" do
        create(:review, user: user, restaurant: restaurant)
        duplicate_review = build(:review, user: user, restaurant: restaurant)
        expect(duplicate_review).not_to be_valid
        expect(duplicate_review.errors[:user_id]).to include("can only review a restaurant once")
      end
    end

    describe "associations validation" do
      it "is invalid without user" do
        review.user = nil
        expect(review).not_to be_valid
        expect(review.errors[:user]).to include("must exist")
      end

      it "is invalid without restaurant" do
        review.restaurant = nil
        expect(review).not_to be_valid
        expect(review.errors[:restaurant]).to include("must exist")
      end
    end
  end

  describe "scopes" do
    let(:restaurant1) { create(:restaurant) }
    let(:restaurant2) { create(:restaurant) }
    let(:user1) { create(:user) }
    let(:user2) { create(:user) }

    let!(:review_oldest) { create(:review, restaurant: restaurant1, user: user1, created_at: 3.days.ago) }
    let!(:review_older) { create(:review, restaurant: restaurant1, user: user2, created_at: 2.days.ago) }
    let!(:review_newer) { create(:review, restaurant: restaurant2, user: user1, created_at: 1.day.ago) }
    let!(:review_newest) { create(:review, restaurant: restaurant2, user: user2, created_at: Time.current) }

    describe ".recent" do
      it "orders reviews by created_at descending" do
        results = Review.recent
        expect(results).to eq([review_newest, review_newer, review_older, review_oldest])
      end
    end

    describe ".oldest" do
      it "orders reviews by created_at ascending" do
        results = Review.oldest
        expect(results).to eq([review_oldest, review_older, review_newer, review_newest])
      end
    end
  end

  describe "database constraints" do
    it "creates review with valid attributes" do
      expect { create(:review, valid_attributes) }.not_to raise_error
    end

    it "enforces unique constraint on user_id and restaurant_id" do
      create(:review, user: user, restaurant: restaurant)
      expect {
        create(:review, user: user, restaurant: restaurant)
      }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it "allows creating reviews with same user for different restaurants" do
      restaurant2 = create(:restaurant)
      create(:review, user: user, restaurant: restaurant)
      expect {
        create(:review, user: user, restaurant: restaurant2)
      }.not_to raise_error
    end

    it "allows creating reviews with different users for same restaurant" do
      user2 = create(:user, email_address: "user2@example.com")
      create(:review, user: user, restaurant: restaurant)
      expect {
        create(:review, user: user2, restaurant: restaurant)
      }.not_to raise_error
    end
  end

  describe "timestamps" do
    let(:review) { create(:review, valid_attributes) }

    it "sets created_at when review is created" do
      expect(review.created_at).to be_present
      expect(review.created_at).to be_within(1.second).of(Time.current)
    end

    it "sets updated_at when review is created" do
      expect(review.updated_at).to be_present
      expect(review.updated_at).to be_within(1.second).of(Time.current)
    end

    it "updates updated_at when review is modified" do
      original_updated_at = review.updated_at
      sleep(0.1) # Ensure time difference
      review.update!(comment: "Updated comment with more than ten characters")
      expect(review.updated_at).to be > original_updated_at
    end
  end

  describe "association integration" do
    it "can access restaurant through review" do
      review = create(:review)
      expect(review.restaurant).to be_present
      expect(review.restaurant.name).to be_present
    end

    it "can access user through review" do
      review = create(:review)
      expect(review.user).to be_present
      expect(review.user.email_address).to be_present
    end

    it "can access reviews through restaurant" do
      restaurant = create(:restaurant)
      review1 = create(:review, restaurant: restaurant)
      review2 = create(:review, restaurant: restaurant)

      expect(restaurant.reviews).to include(review1, review2)
      expect(restaurant.reviews.count).to eq(2)
    end

    it "destroys reviews when restaurant is destroyed" do
      restaurant = create(:restaurant)
      review1 = create(:review, restaurant: restaurant)
      review2 = create(:review, restaurant: restaurant)

      expect { restaurant.destroy }.to change { Review.count }.by(-2)
    end
  end
end
