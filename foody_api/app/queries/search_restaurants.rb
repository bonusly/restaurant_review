class SearchRestaurants
  def self.call(params = {})
    new(params).call
  end

  def initialize(params = {})
    @params = params || {}
    @filters = @params[:filters] || {}
  end

  def call
    restaurants = Restaurant.all
    restaurants = apply_filters(restaurants)
    restaurants.order(name: :asc)
  end

  private

  attr_reader :params, :filters

  def apply_filters(restaurants)
    restaurants = restaurants.by_name(filters[:name]) if filters[:name].present?
    restaurants = restaurants.by_cuisine(filters[:cuisine_type]) if filters[:cuisine_type].present?
    restaurants = restaurants.by_max_price(filters[:max_price]) if filters[:max_price].present?
    restaurants
  end
end
