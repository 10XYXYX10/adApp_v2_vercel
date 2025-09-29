// src/components/header/HeaderSkeleton.tsx

const HeaderSkeleton = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
              <div className="flex flex-col space-y-1">
                <div className="w-20 lg:w-24 h-4 lg:h-5 bg-gray-200 rounded animate-pulse" />
                <div className="hidden lg:block w-16 h-2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Desktop Navigation Skeleton */}
            <div className="hidden lg:flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/60">
              <div className="w-20 h-9 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-16 h-9 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-18 h-9 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-20 h-9 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-16 h-9 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Desktop User Menu Skeleton */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              
              {/* User Menu */}
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                <div className="flex flex-col space-y-1">
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-12 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Mobile Menu Button Skeleton */}
            <div className="lg:hidden">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default HeaderSkeleton;