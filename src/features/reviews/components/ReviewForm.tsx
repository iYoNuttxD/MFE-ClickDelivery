import React, { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setComment('');
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Deixe sua avaliação</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nota</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl ${value <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Comentário</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Compartilhe sua experiência..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600"
      >
        Enviar Avaliação
      </button>
    </form>
  );
};
