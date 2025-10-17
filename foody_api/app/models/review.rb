class Review < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :restaurant

  # Validations
  validates :comment, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :user_id, uniqueness: { scope: :restaurant_id, message: "can only review a restaurant once" }

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :oldest, -> { order(created_at: :asc) }
end
