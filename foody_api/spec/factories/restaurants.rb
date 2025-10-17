FactoryBot.define do
  factory :restaurant do
    sequence(:name) { |n| "Restaurant #{n}" }
    cuisine_type { :italian }
    price_range { :moderate }
    sequence(:address) { |n| "#{100 + n} Main Street, City #{n}, ST 12345" }
    description { "A wonderful dining experience with great food and atmosphere." }
    sequence(:phone) { |n| "(555) #{100 + n}-#{1000 + n}" }
    sequence(:image_url) { |n| "https://example.com/restaurant#{n}.jpg" }

    # Traits for specific cuisines
    trait :italian do
      cuisine_type { :italian }
      name { "Mario's Italian Kitchen" }
      description { "Authentic Italian cuisine with homemade pasta and fresh ingredients." }
    end

    trait :mexican do
      cuisine_type { :mexican }
      name { "Casa Mexico" }
      description { "Traditional Mexican dishes with bold flavors and fresh ingredients." }
    end

    trait :chinese do
      cuisine_type { :chinese }
      name { "Golden Dragon" }
      description { "Classic Chinese cuisine with traditional recipes and fresh ingredients." }
    end

    trait :japanese do
      cuisine_type { :japanese }
      name { "Sakura Sushi" }
      description { "Fresh sushi and traditional Japanese dishes in a modern setting." }
    end

    trait :thai do
      cuisine_type { :thai }
      name { "Thai Garden" }
      description { "Authentic Thai cuisine with aromatic spices and fresh herbs." }
    end

    trait :indian do
      cuisine_type { :indian }
      name { "Taj Palace" }
      description { "Traditional Indian cuisine with rich curries and aromatic spices." }
    end

    trait :french do
      cuisine_type { :french }
      name { "Le Bistro" }
      description { "Classic French cuisine with elegant presentation and fine ingredients." }
    end

    trait :american do
      cuisine_type { :american }
      name { "Main Street Grill" }
      description { "Classic American comfort food with a modern twist." }
    end

    trait :mediterranean do
      cuisine_type { :mediterranean }
      name { "Olive Kitchen" }
      description { "Fresh Mediterranean cuisine with healthy ingredients and bold flavors." }
    end

    trait :korean do
      cuisine_type { :korean }
      name { "Seoul BBQ" }
      description { "Authentic Korean BBQ and traditional dishes in a casual setting." }
    end

    trait :vietnamese do
      cuisine_type { :vietnamese }
      name { "Pho House" }
      description { "Traditional Vietnamese pho and fresh spring rolls." }
    end

    trait :greek do
      cuisine_type { :greek }
      name { "Athens Taverna" }
      description { "Traditional Greek cuisine with fresh seafood and classic flavors." }
    end

    trait :spanish do
      cuisine_type { :spanish }
      name { "Barcelona Tapas" }
      description { "Authentic Spanish tapas and paella in a vibrant atmosphere." }
    end

    trait :lebanese do
      cuisine_type { :lebanese }
      name { "Cedar House" }
      description { "Traditional Lebanese cuisine with fresh ingredients and bold spices." }
    end

    trait :brazilian do
      cuisine_type { :brazilian }
      name { "Rio Steakhouse" }
      description { "Brazilian steakhouse with premium cuts and traditional sides." }
    end

    # Price range traits
    trait :budget do
      price_range { :budget }
      end

    trait :moderate do
      price_range { :moderate }
      end

    trait :upscale do
      price_range { :upscale }
      end

    # Rating traits
    trait :highly_rated do
      end

    trait :poorly_rated do
      end

    trait :unrated do
      end

    # Special combinations
    trait :popular_italian do
      italian
      highly_rated
      moderate
    end

    trait :cheap_eats do
      budget
      end

    trait :fine_dining do
      upscale
      highly_rated
    end

    # Minimal data for testing validations
    trait :minimal do
      name { "Test Restaurant" }
      cuisine_type { :american }
      price_range { :moderate }
        address { nil }
      description { nil }
      phone { nil }
      image_url { nil }
    end
  end
end
