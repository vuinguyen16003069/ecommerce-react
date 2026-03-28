import { Star } from './Icons'

export const StarRating = ({ rating, setRating, interactive = false, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <div
        key={s}
        onClick={() => interactive && setRating(s)}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
      >
        <Star size={size} fill={s <= rating ? '#FBBF24' : 'none'} stroke={s <= rating ? '#FBBF24' : '#D1D5DB'} />
      </div>
    ))}
  </div>
)
