import { cn } from "@/lib/utils"

type StarRatingProps = {
    rating: number
    displayValue?: number
}

export const StarRating = ({ rating, displayValue }: StarRatingProps) => {
    return (
        <div className="mb-3 md:mb-4 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
                const isFilled = index + 1 <= Math.round(rating)
                return (
                    <span
                        key={`star-${index}`}
                        className={cn(isFilled ? "text-primary" : "text-muted-foreground/40")}
                    >
                        ★
                    </span>
                )
            })}
            {displayValue !== undefined && (
                <span className="text-sm text-muted-foreground">
                    {displayValue.toFixed(1)}
                </span>
            )}
        </div>
    )
}