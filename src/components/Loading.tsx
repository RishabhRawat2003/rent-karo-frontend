// components/LoadingSpinner.tsx


export const LoadingSpinnerWithOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0  opacity-30 rounded-full"></div>
      </div>
    </div>
  );
};


export const LoadingSpinnerWithoutOverlay = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0  opacity-30 rounded-full"></div>
      </div>
    </div>
  );
}

