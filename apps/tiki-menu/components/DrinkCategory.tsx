
interface DrinkCategoryProps {
  name: string;
  isOpen: boolean;
  onClick: () => void;
}

export function DrinkCategory({ name, isOpen, onClick }: DrinkCategoryProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full flex items-center justify-between p-6 category-header rounded-lg hover:bg-tiki-wood/40 transition-all relative"
    >
      <h2 className="drink-category text-xl md:text-2xl text-readable">
        {name}
      </h2>
      <span className={`text-readable text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );
}