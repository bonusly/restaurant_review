FactoryBot.define do
  factory :user do
    email_address { "test@example.com" }
    password { "password" }
    password_confirmation { "password" }

    trait :with_different_email do
      sequence(:email_address) { |n| "user#{n}@example.com" }
    end

    trait :invalid do
      email_address { "invalid-email" }
    end
  end
end
