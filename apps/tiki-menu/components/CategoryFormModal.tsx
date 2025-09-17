import { Modal } from './Modal';

interface EditingCategory {
  name: string;
  description?: string;
  parentId: string | null;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EditingCategory;
  onSave: () => void;
  onChange: (field: string, value: any) => void;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSave,
  onChange,
}: CategoryFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category.parentId ? 'Add Subcategory' : 'Add New Category'}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="e.g., Spirits, Jamaican, Aged"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tiki-text mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={category.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-tiki-carved rounded-md text-tiki-text text-sm"
              placeholder="Brief description of this category"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={onSave}
            disabled={!category.name.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Create Category
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}