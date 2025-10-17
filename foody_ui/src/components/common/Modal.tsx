import {
  type ReactNode,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { Portal } from "./Portal";

// Modal Context
interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
}

// Modal Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  isCentered?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

interface ModalOverlayProps {
  children?: ReactNode;
  className?: string;
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

interface ModalCloseButtonProps {
  className?: string;
  disabled?: boolean;
}

// Size classes mapping
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
};

// Modal Hook for focus management and keyboard events
function useModal({
  isOpen,
  onClose,
  closeOnEsc = true,
}: Pick<ModalProps, "isOpen" | "onClose" | "closeOnEsc">) {
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      lastActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      return () => {
        // Restore body scroll
        document.body.style.overflow = "unset";

        // Return focus to the previously focused element
        if (lastActiveElement.current) {
          lastActiveElement.current.focus();
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEsc]);
}

// Main Modal Component
export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  isCentered = false,
  size = "md",
}: ModalProps) {
  useModal({ isOpen, onClose, closeOnEsc });

  if (!isOpen) return null;

  return (
    <Portal>
      <ModalContext.Provider value={{ isOpen, onClose }}>
        <div
          className={`fixed inset-0 z-50 flex ${
            isCentered ? "items-center" : "items-start pt-16"
          } justify-center p-4`}
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <div
            className={`w-full ${sizeClasses[size]} relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>
    </Portal>
  );
}

// Modal Overlay Component
export function ModalOverlay({ children, className = "" }: ModalOverlayProps) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Modal Content Component
export function ModalContent({ children, className = "" }: ModalContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the modal content when it mounts
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={`relative bg-white rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}

// Modal Header Component
export function ModalHeader({ children, className = "" }: ModalHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
    </div>
  );
}

// Modal Body Component
export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

// Modal Footer Component
export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 ${className}`}
    >
      {children}
    </div>
  );
}

// Modal Close Button Component
export function ModalCloseButton({
  className = "",
  disabled = false,
}: ModalCloseButtonProps) {
  const { onClose } = useModalContext();

  return (
    <button
      type="button"
      onClick={onClose}
      disabled={disabled}
      className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Close modal"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
