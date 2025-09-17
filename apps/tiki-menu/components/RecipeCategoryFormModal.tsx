import { useState, useEffect } from 'react';
import { useAdminStore } from '../src/stores/adminStore';
import type { RecipeCategory } from '../src/services/recipeCategoryService';
import { Modal } from './Modal';

interface RecipeCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  category: RecipeCategory | null;
}

export function RecipeCategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
}: RecipeCategoryFormModalProps) {
  const { createRecipeCategory, updateRecipeCategory } = useAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    active: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        order: category.order,
        active: category.active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        order: 0,
        active: true,
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    try {
      if (category) {
        // Update existing category
        await updateRecipeCategory(category.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          order: formData.order,
          active: formData.active,
        });
      } else {
        // Create new category
        await createRecipeCategory(
          formData.name.trim(),
          formData.description.trim() || undefined,
          formData.order
        );
      }
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={category ? 'Edit Category' : 'Create New Category'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tiki-accent"
              placeholder="e.g., Classic Tiki"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tiki-accent"
              placeholder="Optional description of this category"
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tiki-accent"
              min="0"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first in the list
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mr-2"
              disabled={isSaving}
            />
            <label htmlFor="active" className="text-sm text-tiki-text">
              Active (visible in recipe forms)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="px-4 py-2 bg-tiki-accent text-white rounded-md hover:bg-tiki-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
    </Modal>
  );
}