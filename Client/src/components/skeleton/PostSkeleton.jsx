const PostSkeleton = () => {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4 border border-base-200 mb-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded-md"></div>
          <div className="skeleton h-3 w-20 rounded-md"></div>
        </div>
      </div>

      {/* Text content */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded-md"></div>
        <div className="skeleton h-4 w-3/4 rounded-md"></div>
        <div className="skeleton h-4 w-2/4 rounded-md"></div>
      </div>

      {/* Image/Media */}
      <div className="skeleton w-full h-64 rounded-xl"></div>

      {/* Footer Actions */}
      <div className="flex space-x-4 pt-2">
        <div className="skeleton w-6 h-6 rounded-md"></div>
        <div className="skeleton w-6 h-6 rounded-md"></div>
        <div className="skeleton w-6 h-6 rounded-md"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
