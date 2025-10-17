import { useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useRestaurants } from "../queries/restaurants";
import {
	type Restaurant,
	type RestaurantSearchParams,
	type RestaurantSort,
} from "../types/http";
import { generateRoutes } from "../utils/constants";
import { ReviewModal } from "../components/reviews/ReviewModal";
import { useDisclosure } from "../hooks/useDisclosure";

const CUISINE_TYPES = [
	{ value: "", label: "All Cuisines" },
	{ value: "italian", label: "Italian" },
	{ value: "mexican", label: "Mexican" },
	{ value: "chinese", label: "Chinese" },
	{ value: "japanese", label: "Japanese" },
	{ value: "thai", label: "Thai" },
	{ value: "indian", label: "Indian" },
	{ value: "french", label: "French" },
	{ value: "american", label: "American" },
	{ value: "mediterranean", label: "Mediterranean" },
	{ value: "korean", label: "Korean" },
];

const PRICE_RANGES = [
	{ value: "", label: "Any Price" },
	{ value: "1", label: "$" },
	{ value: "2", label: "$$" },
	{ value: "3", label: "$$$" },
];

const SORT_OPTIONS = [
	{ value: "", label: "Name (A-Z)" },
	{ value: "name-asc", label: "Name (A-Z)" },
	{ value: "name-desc", label: "Name (Z-A)" },
];

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
	const modal = useDisclosure();

	const getPriceDisplay = (priceRange: "budget" | "moderate" | "upscale") => {
		switch (priceRange) {
			case "budget":
				return "$";
			case "moderate":
				return "$$";
			case "upscale":
				return "$$$";
			default:
				return "$";
		}
	};


	return (
		<div className="card hover:shadow-lg transition-shadow duration-200">
			{restaurant.imageUrl && (
				<img
					src={restaurant.imageUrl}
					alt={restaurant.name}
					className="w-full h-48 object-cover rounded-t-lg"
				/>
			)}
			<div className="p-6">
				<div className="flex justify-between items-start mb-2">
					<h3 className="text-xl font-semibold text-gray-900 truncate">
						{restaurant.name}
					</h3>
					<span className="text-lg font-medium text-gray-700 ml-2">
						{getPriceDisplay(restaurant.priceRange)}
					</span>
				</div>

				<div className="flex items-center justify-between mb-3">
					<span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
						{restaurant.cuisineType}
					</span>
				</div>

				{restaurant.description && (
					<p className="text-gray-600 text-sm mb-4 line-clamp-2">
						{restaurant.description}
					</p>
				)}

				{restaurant.address && (
					<p className="text-gray-500 text-xs mb-4">📍 {restaurant.address}</p>
				)}

				<div className="flex gap-2">
					<Link
						to={generateRoutes.restaurantDetail(restaurant.id)}
						className="btn-secondary flex-1 text-sm text-center"
					>
						View Details
					</Link>
					<button onClick={modal.onOpen} className="btn-primary flex-1 text-sm">
						Write Review
					</button>
				</div>

				<ReviewModal
					isOpen={modal.isOpen}
					onClose={modal.onClose}
					restaurantId={restaurant.id}
					restaurantName={restaurant.name}
				/>
			</div>
		</div>
	);
}

function FilterBar() {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateSearchParam = (key: string, value: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (value) {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}
		setSearchParams(newParams);
	};

	const handleSortChange = (value: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (value) {
			const [sortBy, sortDirection] = value.split("-");
			newParams.set("sort_by", sortBy);
			newParams.set("sort_direction", sortDirection);
		} else {
			newParams.delete("sort_by");
			newParams.delete("sort_direction");
		}
		setSearchParams(newParams);
	};

	const getCurrentSortValue = () => {
		const sortBy = searchParams.get("sort_by");
		const sortDirection = searchParams.get("sort_direction");
		if (sortBy && sortDirection) {
			return `${sortBy}-${sortDirection}`;
		}
		return "";
	};

	const clearFilters = () => {
		setSearchParams({});
	};

	const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{/* Search by name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Search
					</label>
					<input
						type="text"
						placeholder="Restaurant name..."
						value={searchParams.get("name") || ""}
						onChange={(e) => updateSearchParam("name", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Cuisine filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Cuisine
					</label>
					<select
						value={searchParams.get("cuisine_type") || ""}
						onChange={(e) => updateSearchParam("cuisine_type", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{CUISINE_TYPES.map((cuisine) => (
							<option key={cuisine.value} value={cuisine.value}>
								{cuisine.label}
							</option>
						))}
					</select>
				</div>

				{/* Price filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Max Price
					</label>
					<select
						value={searchParams.get("max_price") || ""}
						onChange={(e) => updateSearchParam("max_price", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{PRICE_RANGES.map((price) => (
							<option key={price.value} value={price.value}>
								{price.label}
							</option>
						))}
					</select>
				</div>

				{/* Sort */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Sort By
					</label>
					<select
						value={getCurrentSortValue()}
						onChange={(e) => handleSortChange(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{hasActiveFilters && (
				<div className="mt-4 pt-4 border-t border-gray-200">
					<button
						onClick={clearFilters}
						className="text-sm text-blue-600 hover:text-blue-800 font-medium"
					>
						Clear all filters
					</button>
				</div>
			)}
		</div>
	);
}

export const Restaurants = () => {
	const { user, logout, isLoggingOut } = useAuth();
	const [searchParams] = useSearchParams();

	// Parse search params into restaurant query params
	const restaurantParams: RestaurantSearchParams = useMemo(() => {
		const params: RestaurantSearchParams = {};

		// Parse filters
		const name = searchParams.get("name");
		const cuisine_type = searchParams.get("cuisine_type");
		const max_price = searchParams.get("max_price");

		if (name || cuisine_type || max_price) {
			params.filters = {};
			if (name) params.filters.name = name;
			if (cuisine_type) params.filters.cuisineType = cuisine_type;
			if (max_price)
				params.filters.maxPrice = parseInt(max_price, 10) as 1 | 2 | 3;
		}

		// Parse sort
		const sortBy = searchParams.get("sort_by");
		const sortDirection = searchParams.get("sort_direction");

		if (sortBy || sortDirection) {
			params.sort = {};
			if (sortBy) params.sort.by = sortBy as RestaurantSort["by"];
			if (sortDirection)
				params.sort.direction = sortDirection as RestaurantSort["direction"];
		}

		return params;
	}, [searchParams]);

	const {
		data: restaurants,
		isLoading,
		error,
	} = useRestaurants(restaurantParams);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">🍽️ Foody</h1>
						</div>
						<div className="flex items-center space-x-4">
							{user ? (
								<>
									<span className="text-gray-700">
										Welcome, {user.emailAddress}
									</span>
									<button
										onClick={handleLogout}
										disabled={isLoggingOut}
										className="btn-secondary"
									>
										{isLoggingOut ? "Signing out..." : "Sign Out"}
									</button>
								</>
							) : (
								<div className="space-x-2">
									<a href="/login" className="btn-secondary">
										Sign In
									</a>
									<a href="/register" className="btn-primary">
										Sign Up
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					{/* Header */}
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Discover Great Restaurants
						</h2>
						<p className="text-gray-600">
							Find your next favorite dining spot and share your experiences
						</p>
					</div>

					{/* Filters */}
					<FilterBar />

					{/* Results */}
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
							<span className="ml-2 text-gray-600">Loading restaurants...</span>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<div className="text-red-500 mb-4">
								<svg
									className="w-12 h-12 mx-auto"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Something went wrong
							</h3>
							<p className="text-gray-600">
								Unable to load restaurants. Please try again later.
							</p>
						</div>
					) : restaurants && restaurants.length > 0 ? (
						<>
							<div className="mb-4">
								<p className="text-gray-600">
									Found {restaurants.length} restaurant
									{restaurants.length !== 1 ? "s" : ""}
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{restaurants.map((restaurant) => (
									<RestaurantCard key={restaurant.id} restaurant={restaurant} />
								))}
							</div>
						</>
					) : (
						<div className="text-center py-12">
							<div className="text-gray-400 mb-4">
								<svg
									className="w-12 h-12 mx-auto"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No restaurants found
							</h3>
							<p className="text-gray-600">
								Try adjusting your filters to see more results.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};
