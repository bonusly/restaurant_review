require 'rails_helper'

RSpec.describe CreateReview, type: :command do
  let(:user) { create(:user) }
  let(:restaurant) { create(:restaurant) }
  let(:valid_params) do
    {
      user: user,
      restaurant: restaurant,
      comment: "Great food and excellent service!"
    }
  end

  describe '.call' do
    context 'with valid parameters' do
      it 'creates a new review' do
        expect {
          CreateReview.call(valid_params)
        }.to change { Review.count }.by(1)
      end

      it 'returns the created review' do
        result = CreateReview.call(valid_params)
        expect(result).to be_a(Review)
        expect(result.user).to eq(user)
        expect(result.restaurant).to eq(restaurant)
        expect(result.comment).to eq("Great food and excellent service!")
      end

      it 'persists the review to the database' do
        result = CreateReview.call(valid_params)
        persisted_review = Review.find(result.id)

        expect(persisted_review.user).to eq(user)
        expect(persisted_review.restaurant).to eq(restaurant)
        expect(persisted_review.comment).to eq("Great food and excellent service!")
      end
    end


    context 'validation errors' do
      it 'raises error with missing comment' do
        invalid_params = valid_params.merge(comment: nil)

        expect {
          CreateReview.call(invalid_params)
        }.to raise_error(ActiveRecord::RecordInvalid, /Comment can't be blank/)
      end

      it 'raises error with missing user' do
        invalid_params = valid_params.merge(user: nil)

        expect {
          CreateReview.call(invalid_params)
        }.to raise_error(ActiveRecord::RecordInvalid, /User must exist/)
      end

      it 'raises error with missing restaurant' do
        invalid_params = valid_params.merge(restaurant: nil)

        expect {
          CreateReview.call(invalid_params)
        }.to raise_error(ActiveRecord::RecordInvalid, /Restaurant must exist/)
      end
    end

    context 'edge cases' do
      it 'handles minimum length comment' do
        result = CreateReview.call(valid_params.merge(comment: "Good food!"))

        expect(result.comment).to eq("Good food!")
      end

      it 'handles maximum length comment' do
        long_comment = "a" * 1000
        result = CreateReview.call(valid_params.merge(comment: long_comment))

        expect(result.comment).to eq(long_comment)
      end
    end

    context 'instance method usage' do
      it 'can be instantiated and called' do
        command = CreateReview.new(valid_params)
        result = command.call

        expect(result).to be_a(Review)
        expect(result).to be_persisted
      end
    end
  end
end
