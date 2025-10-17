FactoryBot.define do
  factory :review do
    comment { "Great food and excellent service. Would definitely recommend this place to others!" }
    association :user
    association :restaurant

    # Comment length traits
    trait :short_comment do
      comment { "Good food here." }
    end

    trait :long_comment do
      comment { "This restaurant exceeded all my expectations. From the moment we walked in, the atmosphere was perfect - cozy but elegant, with great lighting and music at just the right volume. Our server was incredibly knowledgeable about the menu and wine pairings, making excellent recommendations that perfectly complemented our meal. Every dish was prepared to perfection, with fresh ingredients and creative presentations. The flavors were outstanding and well-balanced. The timing between courses was ideal, giving us time to savor each dish without feeling rushed. Even the dessert was exceptional. I can't wait to come back and try more items from their menu. This is definitely going to be one of our regular spots!" }
    end

    # Specific restaurant traits
    trait :for_italian_restaurant do
      comment { "Authentic Italian cuisine with perfect pasta and great wine selection. Highly recommended!" }
    end

    trait :for_mexican_restaurant do
      comment { "Amazing Mexican food with fresh ingredients and bold flavors. The salsa was incredible!" }
    end

    trait :for_sushi_restaurant do
      comment { "Fresh sushi and great presentation. The chef clearly knows what they're doing." }
    end

    # User-specific traits
    trait :positive_reviewer do
      comment { "Outstanding restaurant! Everything was perfect from start to finish. Can't wait to return!" }
    end

    trait :critical_reviewer do
      comment { "Expected much better based on the reviews. Food was mediocre and service was slow." }
    end

    # Time-based traits
    trait :recent do
      created_at { 1.day.ago }
      updated_at { 1.day.ago }
    end

    trait :old do
      created_at { 6.months.ago }
      updated_at { 6.months.ago }
    end

    # Minimal valid review for testing validations
    trait :minimal do
      comment { "It was okay." }
    end
  end
end
