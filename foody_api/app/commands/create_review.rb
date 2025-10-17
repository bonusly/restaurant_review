class CreateReview
  def self.call(params)
    new(params).call
  end

  def initialize(params)
    @user = params[:user]
    @restaurant = params[:restaurant]
    @comment = params[:comment]
  end

  def call
    ActiveRecord::Base.transaction do
      create_review
      review
    end
  end

  private

  attr_reader :user, :restaurant, :comment, :review

  def create_review
    @review = Review.create!(
      user: user,
      restaurant: restaurant,
      comment: comment
    )
  end
end
