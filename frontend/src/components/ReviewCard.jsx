import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const ReviewCard = ({ review, currentUser, onDelete }) => {
  const isOwner = currentUser && review.author && (currentUser._id === review.author._id || currentUser._id === review.author);
  const authorName = review.author?.username || 'Anonymous';
  const initial = authorName.charAt(0).toUpperCase();

  return (
    <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
            {initial}
          </div>
          <div>
            <h4 className="font-semibold text-secondary">{authorName}</h4>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < review.rating ? 'fill-gray-800 text-gray-800' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <button 
            onClick={() => onDelete(review._id)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
