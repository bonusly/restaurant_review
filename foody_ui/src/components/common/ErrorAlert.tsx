import type { ApiError } from "../../types/http";
import { getErrorDisplayMessage, hasValidationErrors } from "../../types/http";

interface ErrorAlertProps {
  error: ApiError | null;
  fallbackMessage?: string;
  className?: string;
}

export const ErrorAlert = ({
  error,
  fallbackMessage = "An error occurred",
  className = ""
}: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="text-red-800">
          <p className="text-sm font-medium">
            {getErrorDisplayMessage(error, fallbackMessage)}
          </p>
          {hasValidationErrors(error) && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {error.errors.map((errorMessage, index) => (
                <li key={index}>{errorMessage}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
