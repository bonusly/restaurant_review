// HTTP Error Types and Type Guards

export interface ApiError {
	message: string;
	errors: string[];
}

export interface HttpError extends Error {
	status?: number;
	data?: unknown;
}

// Type guard to check if an error is an ApiError
export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		"errors" in error &&
		typeof (error as any).message === "string" &&
		Array.isArray((error as any).errors) &&
		(error as any).errors.every((err: unknown) => typeof err === "string")
	);
}

// Type guard to check if an error is an HttpError
export function isHttpError(error: unknown): error is HttpError {
	return (
		error instanceof Error &&
		"status" in error &&
		typeof (error as any).status === "number"
	);
}

// Helper function to extract ApiError from various error formats
export function extractApiError(error: unknown): ApiError | null {
	// Direct ApiError
	if (isApiError(error)) {
		return error;
	}

	// HttpError with data containing ApiError
	if (isHttpError(error) && isApiError(error.data)) {
		return error.data;
	}

	// Error with nested data property
	if (
		typeof error === "object" &&
		error !== null &&
		"data" in error &&
		isApiError((error as any).data)
	) {
		return (error as any).data;
	}

	// Error with response.data (common in HTTP clients)
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as any).response === "object" &&
		(error as any).response !== null &&
		"data" in (error as any).response &&
		isApiError((error as any).response.data)
	) {
		return (error as any).response.data;
	}

	return null;
}

// Helper function to create a fallback ApiError from any error
export function createApiError(
	error: unknown,
	fallbackMessage = "An unexpected error occurred",
): ApiError {
	const apiError = extractApiError(error);
	if (apiError) {
		return apiError;
	}

	// Fallback for non-ApiError errors
	if (error instanceof Error) {
		return {
			message: error.message || fallbackMessage,
			errors: [],
		};
	}

	if (typeof error === "string") {
		return {
			message: error,
			errors: [],
		};
	}

	return {
		message: fallbackMessage,
		errors: [],
	};
}

// Utility function to get display message from ApiError
export function getErrorDisplayMessage(
	error: ApiError | null,
	fallbackMessage: string,
): string {
	if (!error) return fallbackMessage;
	return error.message || fallbackMessage;
}

// Utility function to check if error has validation errors
export function hasValidationErrors(error: ApiError | null): boolean {
	return Boolean(error?.errors && error.errors.length > 0);
}

// Utility function to get all error messages for display
export function getAllErrorMessages(error: ApiError | null): string[] {
	if (!error) return [];

	const messages: string[] = [];

	if (error.message) {
		messages.push(error.message);
	}

	if (error.errors && error.errors.length > 0) {
		messages.push(...error.errors);
	}

	return messages;
}

// Restaurant and Review Types
export interface User {
	id: number;
	emailAddress: string;
	createdAt: string;
	updatedAt: string;
}

export interface Restaurant {
	id: number;
	name: string;
	cuisineType: string;
	priceRange: "budget" | "moderate" | "upscale";
	address?: string;
	description?: string;
	phone?: string;
	imageUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Review {
	id: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user: User;
	restaurant?: Restaurant;
}

// Filter and Sort Types
export interface RestaurantFilters {
	name?: string;
	cuisineType?: string;
	maxPrice?: 1 | 2 | 3;
}

export interface RestaurantSort {
	by?: "name" | "priceRange" | "createdAt";
	direction?: "asc" | "desc";
}

export interface RestaurantSearchParams {
	filters?: RestaurantFilters;
	sort?: RestaurantSort;
}
