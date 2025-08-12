FactoryBot.define do
  factory :user do
    email { "test@example.com" }
    password { "password" }
    password_confirmation { "password" }

    trait :with_different_email do
      sequence(:email) { |n| "user#{n}@example.com" }
    end

    trait :invalid do
      email { "invalid-email" }
    end
  end
end
