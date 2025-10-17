# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create a default user for testing and development
User.find_or_create_by!(email_address: "user@example.com") do |user|
  user.password = "password"
end

puts "Default user created: user@example.com / password"

# Create additional users for reviews
review_users = []
10.times do |i|
  user = User.find_or_create_by!(email_address: "reviewer#{i + 1}@example.com") do |u|
    u.password = "password123"
  end
  review_users << user
end

puts "Created #{review_users.length} review users"

# Restaurant data
restaurant_data = [
  {
    name: "Mario's Italian Bistro",
    cuisine_type: "italian",
    price_range: 2,
    address: "123 Main Street, Downtown",
    description: "Authentic Italian cuisine with a modern twist. Family-owned restaurant serving traditional dishes made with imported ingredients.",
    phone: "(555) 123-4567"
  },
  {
    name: "Taco Libre",
    cuisine_type: "mexican",
    price_range: 1,
    address: "456 Oak Avenue, Midtown",
    description: "Fresh Mexican street food and traditional dishes. Known for our handmade tortillas and authentic salsas.",
    phone: "(555) 234-5678"
  },
  {
    name: "Golden Dragon",
    cuisine_type: "chinese",
    price_range: 2,
    address: "789 Pine Road, Chinatown",
    description: "Traditional Cantonese cuisine with dim sum service. Family recipes passed down through generations.",
    phone: "(555) 345-6789"
  },
  {
    name: "Sakura Sushi",
    cuisine_type: "japanese",
    price_range: 3,
    address: "321 Cherry Blossom Lane, Arts District",
    description: "Premium sushi and sashimi prepared by master chefs. Omakase experience available by reservation.",
    phone: "(555) 456-7890"
  },
  {
    name: "Thai Palace",
    cuisine_type: "thai",
    price_range: 2,
    address: "654 Spice Street, University Area",
    description: "Authentic Thai flavors with customizable spice levels. Popular for both lunch and dinner service.",
    phone: "(555) 567-8901"
  },
  {
    name: "Spice Route",
    cuisine_type: "indian",
    price_range: 2,
    address: "987 Curry Lane, Little India",
    description: "Traditional Indian cuisine featuring regional specialties. Extensive vegetarian and vegan options available.",
    phone: "(555) 678-9012"
  },
  {
    name: "Le Petit Café",
    cuisine_type: "french",
    price_range: 3,
    address: "147 Boulevard Street, Financial District",
    description: "Classic French bistro with seasonal menu. Extensive wine list featuring French and local selections.",
    phone: "(555) 789-0123"
  },
  {
    name: "The All-American Grill",
    cuisine_type: "american",
    price_range: 2,
    address: "258 Liberty Avenue, Old Town",
    description: "Classic American comfort food with a contemporary approach. Famous for our burgers and craft beer selection.",
    phone: "(555) 890-1234"
  },
  {
    name: "Olive & Feta",
    cuisine_type: "mediterranean",
    price_range: 2,
    address: "369 Seaside Drive, Harbor District",
    description: "Fresh Mediterranean dishes with emphasis on olive oil, herbs, and locally sourced seafood.",
    phone: "(555) 901-2345"
  },
  {
    name: "Seoul Kitchen",
    cuisine_type: "korean",
    price_range: 1,
    address: "741 Kimchi Road, Koreatown",
    description: "Authentic Korean BBQ and traditional dishes. Popular for group dining and late-night meals.",
    phone: "(555) 012-3456"
  }
]

# Review comments for variety
review_comments = [
  "Absolutely amazing food and service! Will definitely be back.",
  "Great atmosphere and delicious dishes. Highly recommended!",
  "The flavors were incredible and the presentation was beautiful.",
  "Service was a bit slow, but the food made up for it.",
  "Perfect spot for a date night. Romantic ambiance and excellent wine selection.",
  "Best restaurant in the city! Everything was cooked to perfection.",
  "Good food but a bit overpriced for the portion size.",
  "The staff was friendly and attentive. Food arrived quickly and was hot.",
  "Unique flavors and creative menu. A hidden gem worth discovering.",
  "Solid choice for lunch. Clean, comfortable, and tasty food.",
  "Outstanding appetizers and cocktails. Main courses were decent.",
  "Traditional recipes done right. Authentic taste and reasonable prices.",
  "Beautiful interior design and the food quality matches the ambiance.",
  "Fresh ingredients and expert preparation. You can taste the difference.",
  "Exceeded expectations! The chef really knows what they're doing.",
  "Cozy atmosphere perfect for family dining. Kids menu available too.",
  "Innovative dishes that blend traditional and modern cooking techniques.",
  "Great value for money. Large portions and reasonable prices.",
  "The desserts were incredible - save room for something sweet!",
  "Consistent quality every time I visit. A reliable favorite spot."
]

# Create restaurants with reviews
restaurant_data.each_with_index do |data, index|
  puts "Creating restaurant: #{data[:name]}"

  restaurant = Restaurant.find_or_create_by!(name: data[:name]) do |r|
    r.cuisine_type = data[:cuisine_type]
    r.price_range = data[:price_range]
    r.address = data[:address]
    r.description = data[:description]
    r.phone = data[:phone]
    # Using picsum.photos for mock restaurant images
    r.image_url = "https://picsum.photos/600/400?random=#{index + 1}"
  end

  # Create 10 reviews for each restaurant
  10.times do |review_index|
    user = review_users[review_index]
    comment = review_comments.sample

    # Skip if review already exists for this user/restaurant combination
    next if Review.exists?(user: user, restaurant: restaurant)

    Review.create!(
      user: user,
      restaurant: restaurant,
      comment: comment,
      created_at: rand(30.days).seconds.ago # Random dates within last 30 days
    )
  end
end

puts "\nSeeding complete!"
puts "Created #{Restaurant.count} restaurants"
puts "Created #{Review.count} total reviews"
puts "Created #{User.count} total users"
