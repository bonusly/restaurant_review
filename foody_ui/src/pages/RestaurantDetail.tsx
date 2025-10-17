import { useParams, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useRestaurant, useRestaurantReviews } from "../queries/restaurants";
import { type Review } from "../types/http";
import { Routes } from "../utils/constants";
import { ReviewModal } from "../components/reviews/ReviewModal";
import { useDisclosure } from "../hooks/useDisclosure";

function ReviewButton({
	restaurantId,
	restaurantName,
}: {
	restaurantId: number;
	restaurantName: string;
}) {
	const modal = useDisclosure();

	return (
		<div className="bg-gray-50 rounded-lg p-6 text-center">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Write a Review
			</h3>
			<p className="text-gray-600 mb-4">
				Share your experience with other diners
			</p>
			<button onClick={modal.onOpen} className="btn-primary">
				Write Review
			</button>

			<ReviewModal
				isOpen={modal.isOpen}
				onClose={modal.onClose}
				restaurantId={restaurantId}
				restaurantName={restaurantName}
			/>
		</div>
	);
}

function ReviewCard({ review }: { review: Review }) {

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6">
			<div className="flex items-start justify-between mb-3">
				<div>
					<div className="flex items-center space-x-2 mb-1">
						<span className="text-sm text-gray-600">
							by {review.user.emailAddress}
						</span>
					</div>
					<p className="text-xs text-gray-500">
						{formatDate(review.createdAt)}
					</p>
				</div>
			</div>

			{review.comment && (
				<p className="text-gray-700 leading-relaxed">{review.comment}</p>
			)}
		</div>
	);
}

export function RestaurantDetail() {
	const params = useParams();
	const restaurantId = parseInt(params.id!, 10);

	// Data is preloaded by the router loader, so we can access it directly
	const { data: restaurant } = useRestaurant(restaurantId);
	const { data: reviews } = useRestaurantReviews(restaurantId);
	const { user } = useAuth();

	// Since data is preloaded, restaurant and reviews should always be available
	if (!restaurant || !reviews) {
		return null; // This should rarely happen since loader handles errors
	}

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
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center space-x-4">
							<Link to="/" className="text-xl font-semibold text-gray-900">
								🍽️ Foody
							</Link>
							<Link
								to="/"
								className="text-blue-600 hover:text-blue-800 text-sm"
							>
								← Back to Restaurants
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							{user ? (
								<span className="text-gray-700">
									Welcome, {user.emailAddress}
								</span>
							) : (
								<div className="space-x-2">
									<Link to={Routes.Login} className="btn-secondary">
										Sign In
									</Link>
									<Link to={Routes.Register} className="btn-primary">
										Sign Up
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Restaurant Header */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
					{restaurant.imageUrl && (
						<img
							src={restaurant.imageUrl}
							alt={restaurant.name}
							className="w-full h-64 object-cover"
						/>
					)}
					<div className="p-8">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">
									{restaurant.name}
								</h1>
								<div className="flex items-center space-x-4 mb-3">
									<span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
										{restaurant.cuisineType}
									</span>
									<span className="text-xl font-bold text-gray-700">
										{getPriceDisplay(restaurant.priceRange)}
									</span>
								</div>
							</div>
						</div>

						{restaurant.description && (
							<p className="text-gray-700 mb-6 text-lg leading-relaxed">
								{restaurant.description}
							</p>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
							{restaurant.address && (
								<div className="flex items-center">
									<span className="mr-2">📍</span>
									{restaurant.address}
								</div>
							)}
							{restaurant.phone && (
								<div className="flex items-center">
									<span className="mr-2">📞</span>
									{restaurant.phone}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Reviews Section */}
				<div className="space-y-8">
					{/* Review Button */}
					<ReviewButton
						restaurantId={restaurant.id}
						restaurantName={restaurant.name}
					/>

					{/* Reviews List */}
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Reviews ({reviews.length})
						</h2>

						{reviews.length > 0 ? (
							<div className="space-y-4">
								{reviews.map((review) => (
									<ReviewCard key={review.id} review={review} />
								))}
							</div>
						) : (
							<div className="text-center py-12 bg-white rounded-lg">
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
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.991 8.991 0 01-4.36-1.136l-3.64.364.364-3.64A8.973 8.973 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No reviews yet
								</h3>
								<p className="text-gray-600">
									Be the first to share your experience at {restaurant.name}!
								</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
