import { Modal } from './Modal';
import { UnifiedIngredientOrCategoryAutocomplete, type IngredientOrCategoryOption } from './UnifiedIngredientOrCategoryAutocomplete';

interface EditingIngredient {
  id?: string;
  name: string;
  brand: string;
  displayName?: string;
  description?: string;
  abv?: number;
  available?: boolean;
  inStock?: boolean;
  categoryId: string;
}

interface IngredientFormModalProps {
  ingredient: EditingIngredient;
  categories: import('../src/services/ingredientLibraryService').Category[];
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof EditingIngredient, value: any) => void;
}

export function IngredientFormModal({
  ingredient,
  categories,
  onSave,
  onCancel,
  onChange,
}: IngredientFormModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={ingredient.id ? 'Edit Ingredient' : 'Add New Ingredient'}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Name *
            </label>
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="e.g., Estate 12yr"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Brand
            </label>
            <input
              type="text"
              value={ingredient.brand || ''}
              onChange={(e) => onChange('brand', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="e.g., Appleton (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={ingredient.displayName || ''}
              onChange={(e) => onChange('displayName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="e.g., Aged Rum (Appleton Estate 12yr)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              ABV %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={ingredient.abv || ''}
              onChange={(e) => onChange('abv', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="40.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Category
            </label>
            <UnifiedIngredientOrCategoryAutocomplete
              categories={categories}
              onSelect={(option: IngredientOrCategoryOption) => {
                if (option.type === 'category' && option.id) {
                  onChange('categoryId', option.id);
                }
              }}
              placeholder="Select a category..."
              className="text-sm"
              value={ingredient.categoryId ?
                categories.find(cat => cat.id === ingredient.categoryId)?.name || '' :
                ''
              }
              onClear={() => onChange('categoryId', '')}
              showIngredients={false}
              showCategories={true}
              showCustom={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Description
            </label>
            <input
              type="text"
              value={ingredient.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="Optional description"
            />
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ingredient.available ?? true}
              onChange={(e) => onChange('available', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-tiki-text">Available on Menu</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ingredient.inStock ?? true}
              onChange={(e) => onChange('inStock', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-tiki-text">In Stock</span>
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={onSave}
            disabled={!ingredient.name.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {ingredient.id ? 'Update' : 'Add'} Ingredient
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}