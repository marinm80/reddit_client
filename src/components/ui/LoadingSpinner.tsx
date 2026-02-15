/**
 * LoadingSpinner Component
 *
 * Full-screen loading spinner used as Suspense fallback for lazy-loaded routes.
 * Centers spinner vertically and horizontally with animation.
 */
export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-background"
      data-testid="loading-spinner"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );
}
