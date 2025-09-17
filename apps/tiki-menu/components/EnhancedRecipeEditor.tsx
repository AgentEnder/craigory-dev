import { useState, useEffect } from 'react';
import { type Recipe, type RecipeIngredient } from '../src/services/recipeService';
import { useAdminStore, useIngredients, useCategories, useRecipeCategories } from '../src/stores/adminStore';
import { Modal } from './Modal';
import { UnifiedIngredientOrCategoryAutocomplete, type IngredientOrCategoryOption } from './UnifiedIngredientOrCategoryAutocomplete';

interface EnhancedRecipeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  recipe?: Recipe | null; // For editing existing recipe
}

export function EnhancedRecipeEditor({ isOpen, onClose, onSave, recipe }: EnhancedRecipeEditorProps) {
  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    name: '',
    description: '',
    category: 'Classic Tiki',
    ingredients: [],
    instructions: [],
    active: true,
    order: 0,
  });

  // Get data from Zustand store
  const availableIngredients = useIngredients();
  const categories = useCategories();
  const recipeCategories = useRecipeCategories();
  const { createRecipe, updateRecipe, getCategoryPath } = useAdminStore();
  const [loading, setLoading] = useState(false);

  // New ingredient form state
  const [selectedOption, setSelectedOption] = useState<IngredientOrCategoryOption | null>(null);
  const [newIngredientData, setNewIngredientData] = useState<Partial<RecipeIngredient>>({
    amount: 0,
    unit: 'oz',
    customName: '',
    notes: '',
  });

  // Get active recipe category names for the dropdown
  const recipeCategoryOptions = recipeCategories.filter(cat => cat.active).map(cat => cat.name);
  const strengthOptions = ['light', 'medium', 'strong'];
  const glassTypes = ['Rocks Glass', 'Tiki Mug', 'Hurricane Glass', 'Coupe', 'Highball', 'Collins Glass'];
  const unitOptions = ['oz', 'ml', 'dash', 'splash', 'barspoon', 'drop', 'pinch'];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (recipe) {
        setFormData({
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          servingSize: recipe.servingSize,
          garnish: recipe.garnish,
          glassType: recipe.glassType,
          strength: recipe.strength,
          isSpecial: recipe.isSpecial,
          isBitter: recipe.isBitter,
          active: recipe.active,
          order: recipe.order || 0,
          notes: recipe.notes,
        });
      } else {
        // Reset form for new recipe - use first active category as default
        const defaultCategory = recipeCategories.find(cat => cat.active)?.name || '';
        setFormData({
          name: '',
          description: '',
          category: defaultCategory,
          ingredients: [],
          instructions: [],
          active: true,
          order: 0,
        });
      }
    }
  }, [isOpen, recipe, recipeCategories]);

  const resetIngredientForm = () => {
    setNewIngredientData({
      amount: 0,
      unit: 'oz',
      customName: '',
      notes: '',
    });
    setSelectedOption(null);
  };

  const handleAddNewIngredient = () => {
    if (!newIngredientData.amount || newIngredientData.amount <= 0 || !selectedOption) return;

    let newIngredient: RecipeIngredient;

    if (selectedOption.type === 'custom') {
      newIngredient = {
        customName: selectedOption.name,
        amount: newIngredientData.amount!,
        unit: newIngredientData.unit || 'oz',
        optional: newIngredientData.optional || false,
        notes: newIngredientData.notes,
      };
    } else if (selectedOption.type === 'ingredient' && selectedOption.ingredient) {
      newIngredient = {
        ingredientId: selectedOption.ingredient.id,
        amount: newIngredientData.amount!,
        unit: newIngredientData.unit || 'oz',
        optional: newIngredientData.optional || false,
        notes: newIngredientData.notes,
      };
    } else if (selectedOption.type === 'category' && selectedOption.category) {
      newIngredient = {
        categoryId: selectedOption.category.id,
        amount: newIngredientData.amount!,
        unit: newIngredientData.unit || 'oz',
        optional: newIngredientData.optional || false,
        notes: newIngredientData.notes,
      };
    } else {
      return;
    }

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));

    resetIngredientForm();
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };


  const getIngredientDisplayName = (ingredient: RecipeIngredient): string => {
    if (ingredient.customName) {
      return ingredient.customName;
    }

    if (ingredient.ingredientId) {
      const libraryIngredient = availableIngredients.find(ing => ing.id === ingredient.ingredientId);
      return libraryIngredient?.displayName || libraryIngredient?.name || 'Unknown ingredient';
    }

    if (ingredient.categoryId) {
      return `Any ${getCategoryPath(ingredient.categoryId)}`;
    }

    return 'Unknown ingredient';
  };

  const handleSave = async () => {
    if (!formData.name.trim() || formData.ingredients.length === 0) {
      alert('Please fill in the recipe name and add at least one ingredient.');
      return;
    }

    setLoading(true);
    try {
      if (recipe) {
        await updateRecipe(recipe.id, formData);
      } else {
        await createRecipe(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst),
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const addGarnish = () => {
    setFormData(prev => ({
      ...prev,
      garnish: [...(prev.garnish || []), ''],
    }));
  };

  const updateGarnish = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      garnish: (prev.garnish || []).map((g, i) => i === index ? value : g),
    }));
  };

  const removeGarnish = (index: number) => {
    setFormData(prev => ({
      ...prev,
      garnish: (prev.garnish || []).filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe ? 'Edit Recipe' : 'Create New Recipe'} size="xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Recipe Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
              placeholder="e.g., Mai Tai"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            >
              {recipeCategoryOptions.map(categoryName => (
                <option key={categoryName} value={categoryName}>{categoryName}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-tiki-text mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            rows={2}
            placeholder="Brief description of the drink"
          />
        </div>

        {/* Recipe Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Serving Size
            </label>
            <input
              type="number"
              min="1"
              value={formData.servingSize || 1}
              onChange={(e) => setFormData(prev => ({ ...prev, servingSize: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Strength
            </label>
            <select
              value={formData.strength || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value as 'light' | 'medium' | 'strong' | null }))}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            >
              <option value="">Not specified</option>
              {strengthOptions.map(strength => (
                <option key={strength} value={strength}>{strength}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Glass Type
            </label>
            <select
              value={formData.glassType || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, glassType: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            >
              <option value="">Not specified</option>
              {glassTypes.map(glass => (
                <option key={glass} value={glass}>{glass}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipe Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isSpecial || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isSpecial: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-tiki-text">Special Recipe</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isBitter || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isBitter: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-tiki-text">Contains Bitters</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-tiki-text">Active</span>
          </label>
        </div>

        {/* Ingredients Section */}
        <div>
          <h3 className="text-lg font-semibold text-tiki-text mb-3">Ingredients</h3>

          {/* Unified Ingredient Selection */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-tiki-text mb-1">
                  Search Ingredients, Categories, or Add Custom
                </label>
                <UnifiedIngredientOrCategoryAutocomplete
                  availableIngredients={availableIngredients}
                  categories={categories}
                  onSelect={setSelectedOption}
                  placeholder="Search ingredients, categories, or type custom..."
                  className="text-sm"
                  value={selectedOption ? selectedOption.displayName : ''}
                  onClear={() => setSelectedOption(null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tiki-text mb-1">Amount</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={newIngredientData.amount || ''}
                  onChange={(e) => setNewIngredientData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tiki-text mb-1">Unit</label>
                <select
                  value={newIngredientData.unit || 'oz'}
                  onChange={(e) => setNewIngredientData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                >
                  {unitOptions.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-tiki-text mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={newIngredientData.notes || ''}
                  onChange={(e) => setNewIngredientData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., preferably aged, to taste"
                />
              </div>

              <div className="md:col-span-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newIngredientData.optional || false}
                    onChange={(e) => setNewIngredientData(prev => ({ ...prev, optional: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-tiki-text">Optional ingredient</span>
                </label>
              </div>

              <div className="md:col-span-4">
                <button
                  type="button"
                  onClick={handleAddNewIngredient}
                  disabled={!selectedOption || !newIngredientData.amount || newIngredientData.amount <= 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  Add Ingredient
                </button>
              </div>
            </div>
          </div>

          {/* Current Ingredients List */}
          {formData.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-tiki-text">Recipe Ingredients:</h4>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="bg-white border border-gray-300 rounded-md p-3 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-tiki-text">
                      {ingredient.amount} {ingredient.unit} {getIngredientDisplayName(ingredient)}
                      {ingredient.optional && <span className="text-gray-500 text-sm"> (optional)</span>}
                    </div>
                    {ingredient.notes && (
                      <div className="text-sm text-gray-600 mt-1">{ingredient.notes}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-600 hover:text-red-800 text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div>
          <h3 className="text-lg font-semibold text-tiki-text mb-3">Instructions</h3>
          <div className="space-y-2">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-sm text-gray-500 mt-2 min-w-[2rem]">{index + 1}.</span>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  placeholder="Add instruction step"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-600 hover:text-red-800 text-sm px-2 py-2"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              + Add Instruction
            </button>
          </div>
        </div>

        {/* Garnish Section */}
        <div>
          <h3 className="text-lg font-semibold text-tiki-text mb-3">Garnish (optional)</h3>
          <div className="space-y-2">
            {(formData.garnish || []).map((garnish, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={garnish}
                  onChange={(e) => updateGarnish(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., Lime wheel, Mint sprig"
                />
                <button
                  type="button"
                  onClick={() => removeGarnish(index)}
                  className="text-red-600 hover:text-red-800 text-sm px-2 py-2"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGarnish}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              + Add Garnish
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-tiki-text mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text"
            rows={2}
            placeholder="Any additional notes about the recipe"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={loading || !formData.name.trim() || formData.ingredients.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}