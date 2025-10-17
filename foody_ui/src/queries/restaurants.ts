import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type Restaurant,
	type Review,
	type RestaurantSearchParams,
} from "../types/http";
import httpClient from "../lib/http-client";
import { type LoaderFunctionArgs } from "react-router";
import { queryClient } from "../lib/query-client";

// Query Keys
export const restaurantKeys = {
	all: ["restaurants"] as const,
	lists: () => [...restaurantKeys.all, "list"] as const,
	list: (params: RestaurantSearchParams) =>
		[...restaurantKeys.lists(), params] as const,
	details: () => [...restaurantKeys.all, "detail"] as const,
	detail: (id: number) => [...restaurantKeys.details(), id] as const,
	reviews: () => [...restaurantKeys.all, "reviews"] as const,
	restaurantReviews: (id: number) => [...restaurantKeys.reviews(), id] as const,
};

// Loader function for restaurant detail page
export async function restaurantDetailLoader({ params }: LoaderFunctionArgs) {
	const restaurantId = params.id;

	if (!restaurantId) {
		throw new Response("Restaurant ID is required", { status: 400 });
	}

	const id = parseInt(restaurantId, 10);

	if (isNaN(id)) {
		throw new Response("Invalid restaurant ID", { status: 400 });
	}

	try {
		// Preload both restaurant and reviews data
		await Promise.all([
			queryClient.fetchQuery({
				queryKey: restaurantKeys.detail(id),
				queryFn: async () => {
					const response = await httpClient.get<Restaurant>(
						`/restaurants/${id}`,
					);
					return response.data;
				},
				staleTime: 10 * 60 * 1000, // 10 minutes
			}),
			queryClient.fetchQuery({
				queryKey: restaurantKeys.restaurantReviews(id),
				queryFn: async () => {
					const response = await httpClient.get<Review[]>(
						`/restaurants/${id}/reviews`,
					);
					return response.data;
				},
				staleTime: 2 * 60 * 1000, // 2 minutes
			}),
		]);

		// Return the ID so the component can use it
		return { restaurantId: id };
	} catch (error) {
		// Handle 404 for restaurant not found
		if (
			error &&
			typeof error === "object" &&
			"status" in error &&
			error.status === 404
		) {
			throw new Response("Restaurant not found", { status: 404 });
		}

		// Re-throw other errors
		throw error;
	}
}

// Helper function to format search params for API
function formatSearchParams(params: RestaurantSearchParams): URLSearchParams {
	const searchParams = new URLSearchParams();

	if (params.filters) {
		const { name, cuisineType, maxPrice } = params.filters;
		if (name) searchParams.set("filters[name]", name);
		if (cuisineType) searchParams.set("filters[cuisine_type]", cuisineType);
		if (maxPrice) searchParams.set("filters[max_price]", maxPrice.toString());
	}

	if (params.sort) {
		const { by, direction } = params.sort;
		if (by) searchParams.set("sort[by]", by);
		if (direction) searchParams.set("sort[direction]", direction);
	}

	return searchParams;
}

// Custom Hooks
export function useRestaurants(params: RestaurantSearchParams = {}) {
	return useQuery({
		queryKey: restaurantKeys.list(params),
		queryFn: async () => {
			const searchParams = formatSearchParams(params);
			const endpoint = `/restaurants?${searchParams.toString()}`;

			const response = await httpClient.get<Restaurant[]>(endpoint);
			return response.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useRestaurant(id: number) {
	return useQuery({
		queryKey: restaurantKeys.detail(id),
		queryFn: async () => {
			const response = await httpClient.get<Restaurant>(`/restaurants/${id}`);
			return response.data;
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
}

export function useRestaurantReviews(id: number) {
	return useQuery({
		queryKey: restaurantKeys.restaurantReviews(id),
		queryFn: async () => {
			const response = await httpClient.get<Review[]>(
				`/restaurants/${id}/reviews`,
			);
			return response.data;
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			restaurantId,
			reviewData,
		}: {
			restaurantId: number;
			reviewData: { comment: string };
		}) => {
			const response = await httpClient.post<Review>(
				`/restaurants/${restaurantId}/reviews`,
				reviewData,
			);
			return response.data;
		},
		onSuccess: (_newReview, { restaurantId }) => {
			// Invalidate and refetch restaurant reviews
			queryClient.invalidateQueries({
				queryKey: restaurantKeys.restaurantReviews(restaurantId),
			});

			// Invalidate restaurant details to update the review
			queryClient.invalidateQueries({
				queryKey: restaurantKeys.detail(restaurantId),
			});

			// Invalidate restaurant lists to update the list view
			queryClient.invalidateQueries({
				queryKey: restaurantKeys.lists(),
			});
		},
	});
}
