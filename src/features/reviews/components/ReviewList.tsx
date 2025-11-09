import React from 'react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{review.userName}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <span className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      ))}
    </div>
  );
};
