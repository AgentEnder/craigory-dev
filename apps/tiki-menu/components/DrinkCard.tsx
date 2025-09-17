import type { Drink } from '../pages/+Page';

interface DrinkCardProps {
  drink: Drink;
}

export function DrinkCard({ drink }: DrinkCardProps) {
  const strengthDots = {
    light: '•',
    medium: '••',
    strong: '•••',
  };

  return (
    <div className="tiki-card p-6">
      <div className="relative z-10">
        <div className="mb-3">
          <h3 className="drink-name text-xl mb-1">
            {drink.name}
            {drink.strength && (
              <span className="ml-2 text-tiki-accent text-sm" title={`Strength: ${drink.strength}`}>
                {strengthDots[drink.strength]}
              </span>
            )}
            {drink.isBitter && (
              <span className="ml-2 text-orange-600 text-sm" title="Contains bitters - may be an acquired taste">
                ⚠
              </span>
            )}
          </h3>
          {drink.isSpecial && (
            <span className="text-xs tiki-accent uppercase tracking-wide">
              House Special
            </span>
          )}
        </div>

        <p className="text-tiki-carved/80 mb-4 italic text-sm leading-relaxed">
          {drink.description}
        </p>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {drink.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-tiki-wood/20 rounded text-xs text-tiki-carved border border-tiki-bamboo/30"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}