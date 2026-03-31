"use client";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: string;
}

export default function StarRating({
  rating,
  onChange,
  readonly = false,
  size = "text-2xl",
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${size} ${readonly ? "" : "star-rating"} transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-600"
          } ${readonly ? "cursor-default" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
