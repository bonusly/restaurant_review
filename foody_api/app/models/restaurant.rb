class Restaurant < ApplicationRecord
  # Enums
  enum :cuisine_type, {
    italian: 0,
    mexican: 1,
    chinese: 2,
    japanese: 3,
    thai: 4,
    indian: 5,
    french: 6,
    american: 7,
    mediterranean: 8,
    korean: 9,
    vietnamese: 10,
    greek: 11,
    spanish: 12,
    lebanese: 13,
    brazilian: 14
  }

  enum :price_range, {
    budget: 1,        # $
    moderate: 2,      # $$
    upscale: 3        # $$$
  }

  # Associations
  has_many :reviews, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 1, maximum: 100 }
  validates :cuisine_type, presence: true
  validates :price_range, presence: true, inclusion: { in: price_ranges.keys }
  validates :address, length: { maximum: 255 }, allow_blank: true
  validates :description, length: { maximum: 1000 }, allow_blank: true
  validates :phone, length: { maximum: 20 }, allow_blank: true
  validates :image_url, length: { maximum: 500 }, allow_blank: true
  validates :image_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                                  message: "must be a valid URL" },
            allow_blank: true

  # Scopes for searching and filtering
  scope :by_name, ->(name) { where("name ILIKE ?", "%#{name}%") if name.present? }
  scope :by_cuisine, ->(cuisine) { where(cuisine_type: cuisine) if cuisine.present? }
  scope :by_max_price, ->(max_price) { where("price_range <= ?", max_price) if max_price.present? }


end
