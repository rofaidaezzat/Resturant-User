import React from "react";

interface MenuSkeletonProps {
  itemCount?: number;
}

const MenuSkeleton: React.FC<MenuSkeletonProps> = ({ itemCount = 6 }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Category Skeleton */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-full"
              style={{
                width: `${60 + Math.random() * 40}px`,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Menu Items Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image Skeleton */}
            <div className="aspect-video overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse">
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l-3.5-4.5 2.5-3L12 14l3-4 4 5.5V17H9z" />
                </svg>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              {/* Title and Price */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Title */}
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md mb-2 w-3/4" />
                  {/* Category Badge */}
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-full w-20" />
                </div>
                {/* Price */}
                <div className="h-8 bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 bg-[length:200%_100%] animate-pulse rounded-lg w-16 ml-4" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-full" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-5/6" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-3/4" />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-16" />
                <div className="flex items-center space-x-2">
                  {/* Minus Button */}
                  <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded border" />
                  {/* Quantity */}
                  <div className="h-6 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
                  {/* Plus Button */}
                  <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded border" />
                </div>
              </div>

              {/* Special Notes Input */}
              <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md border" />

              {/* Add to Order Button */}
              <div className="h-11 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-300 bg-[length:200%_100%] animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="flex justify-center items-center py-8 mt-6">
        <div className="flex items-center space-x-3">
          {/* Animated Loading Dots */}
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <span className="text-gray-600 font-medium">
            Loading delicious menu items...
          </span>
        </div>
      </div>

      {/* Floating Loading Indicator */}
      <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-full p-3 border border-orange-200">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default MenuSkeleton;
