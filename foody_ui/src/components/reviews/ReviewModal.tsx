import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateReview } from "../../queries/restaurants";
import { useAuth } from "../../hooks/useAuth";
import { Routes } from "../../utils/constants";
import { Link } from "react-router";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
} from "../common/Modal";

interface ReviewFormData {
	comment: string;
}

interface ReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	restaurantId: number;
	restaurantName: string;
}

export function ReviewModal({
	isOpen,
	onClose,
	restaurantId,
	restaurantName,
}: ReviewModalProps) {
	const { user } = useAuth();
	const createReview = useCreateReview();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ReviewFormData>({
		defaultValues: {
			comment: "",
		},
	});

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	const onSubmit = useCallback(
		async (data: ReviewFormData) => {
			try {
				await createReview.mutateAsync({
					restaurantId,
					reviewData: {
						comment: data.comment,
					},
				});
				onClose();
			} catch (error) {
				console.error("Failed to create review:", error);
			}
		},
		[createReview, restaurantId, onClose],
	);

	// Show login prompt for unauthenticated users
	if (!user) {
		return (
			<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Sign In Required</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<p className="text-gray-600 mb-4">
							You need to be signed in to write a review for {restaurantName}.
						</p>
					</ModalBody>
					<ModalFooter>
						<button onClick={onClose} className="btn-secondary">
							Cancel
						</button>
						<Link to={Routes.Login} className="btn-primary" onClick={onClose}>
							Sign In
						</Link>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Write a Review</ModalHeader>
				<ModalCloseButton disabled={isSubmitting} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="mb-6">
							<h3 className="font-medium text-gray-900 mb-1">
								{restaurantName}
							</h3>
							<p className="text-sm text-gray-600">
								Share your experience with other diners
							</p>
						</div>

						<div className="space-y-4">
							{/* Comment */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Comment *
								</label>
								<textarea
									{...register("comment", {
										required: "Comment is required",
										minLength: {
											value: 10,
											message: "Comment must be at least 10 characters",
										},
										maxLength: {
											value: 1000,
											message: "Comment must be less than 1000 characters",
										},
									})}
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Share your thoughts about the food, service, atmosphere, or anything else that stood out..."
								/>
								{errors.comment && (
									<p className="text-sm text-red-600 mt-1">
										{errors.comment.message}
									</p>
								)}
							</div>
						</div>
					</ModalBody>

					<ModalFooter>
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="btn-secondary disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="btn-primary disabled:opacity-50"
						>
							{isSubmitting ? "Submitting..." : "Submit Review"}
						</button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
