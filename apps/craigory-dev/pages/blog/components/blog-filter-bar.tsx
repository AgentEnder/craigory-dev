import { BlogPost, BlogTag } from '@new-personal-monorepo/blog-posts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './blog-filter-bar.module.scss';

export type FilterFn = (p: BlogPost) => boolean;

type FilterComponentProps = {
  filter: Filter;
  onSetFilter: (id: string, filter: FilterFn) => void;
  context: {
    posts: BlogPost[];
    allTags: BlogTag[];
  };
};

type FilterComponent = (props: FilterComponentProps) => JSX.Element;

type Filter = {
  id: string;
  initialValue?: any;
  component: FilterComponent;
  label: string;
};

function SearchFilter({
  onSetFilter,
  filter: { initialValue, id },
}: FilterComponentProps) {
  const [state, setState] = useState<string>(initialValue ?? '');

  useEffect(() => {
    if (state) {
      onSetFilter(id, (p) =>
        p.title.toLowerCase().includes(state.toLowerCase()) ||
        p.description.toLowerCase().includes(state.toLowerCase())
      );
    } else {
      onSetFilter(id, () => true);
    }
  }, [state, onSetFilter, id]);

  return (
    <td>
      <input
        type="text"
        placeholder="Search posts..."
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{ width: '100%' }}
      />
    </td>
  );
}

function TagFilter({
  onSetFilter,
  context,
  filter,
}: FilterComponentProps) {
  const [selectedTags, setSelectedTags] = useState<BlogTag[]>([]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      onSetFilter(filter.id, (p) => 
        selectedTags.some(tag => p.tags.includes(tag))
      );
    } else {
      onSetFilter(filter.id, () => true);
    }
  }, [selectedTags, onSetFilter, filter.id]);

  return (
    <td>
      <select
        multiple
        value={selectedTags}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map(
            option => option.value as BlogTag
          );
          setSelectedTags(selected);
        }}
        style={{ width: '100%', minHeight: '60px' }}
      >
        {context.allTags.map(tag => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </td>
  );
}

function CategoryFilter({
  onSetFilter,
  filter: { id },
}: FilterComponentProps) {
  const [category, setCategory] = useState<'all' | 'technical' | 'non-technical'>('all');

  useEffect(() => {
    if (category === 'technical') {
      onSetFilter(id, (p) => p.tags.includes('technical'));
    } else if (category === 'non-technical') {
      onSetFilter(id, (p) => p.tags.includes('non-technical'));
    } else {
      onSetFilter(id, () => true);
    }
  }, [category, onSetFilter, id]);

  return (
    <td>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as 'all' | 'technical' | 'non-technical')}
        style={{ width: '100%' }}
      >
        <option value="all">All Posts</option>
        <option value="technical">Technical</option>
        <option value="non-technical">Non-Technical</option>
      </select>
    </td>
  );
}

const ALL_FILTERS: Filter[] = [
  { id: 'search', component: SearchFilter, label: 'Search' },
  { id: 'category', component: CategoryFilter, label: 'Category' },
  { id: 'tags', component: TagFilter, label: 'Tags' },
];

const DEFAULT_FILTERS = [ALL_FILTERS[1]]; // Start with category filter

export function BlogFilterBar({
  onSetFilter,
  posts,
}: {
  onSetFilter: (filter: FilterFn) => void;
  posts: BlogPost[];
}) {
  const allTags = useMemo(
    () => {
      const tagSet = new Set<BlogTag>();
      posts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
      });
      return Array.from(tagSet).sort();
    },
    [posts]
  );

  const [filterById] = useState(new Map<string, FilterFn>());
  const [filters, setFilters] = useState(
    new Map<string, Filter>(DEFAULT_FILTERS.map((f) => [f.id, f]))
  );
  const [availableFilters, setAvailableFilters] = useState<Filter[]>([]);

  const setFilterFn = useCallback(
    (id: string, filterFn: FilterFn) => {
      filterById.set(id, filterFn);
      onSetFilter(aggregateFilters(filterById));
    },
    [filterById, onSetFilter]
  );

  useEffect(() => {
    setAvailableFilters(ALL_FILTERS.filter((f) => !filters.has(f.id)));
    onSetFilter(aggregateFilters(filterById));
  }, [filters, onSetFilter, filterById]);

  function removeFilter(id: string) {
    filterById.delete(id);
    setFilters((f) => {
      const newFilters = new Map(f);
      newFilters.delete(id);
      return newFilters;
    });
  }

  function addFilter(filter: Filter) {
    setFilters((f) => {
      const newFilters = new Map(f);
      newFilters.set(filter.id, filter);
      return newFilters;
    });
  }

  return (
    <table className={styles['filter-table']}>
      <tbody>
        {Array.from(filters.values()).map((filter) => (
          <tr key={filter.id}>
            <td style={{ width: '120px' }}>
              <strong>{filter.label}:</strong>
            </td>
            <filter.component
              onSetFilter={setFilterFn}
              context={{ posts, allTags }}
              filter={filter}
            />
            <td style={{ width: '40px' }}>
              <button
                title="Remove filter"
                onClick={() => {
                  removeFilter(filter.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#666',
                }}
              >
                <IoClose />
              </button>
            </td>
          </tr>
        ))}
        {availableFilters.length > 0 ? (
          <tr>
            <td colSpan={3}>
              <select
                style={{ width: '100%' }}
                value=""
                onChange={(e) => {
                  const selectedFilterId = e.target.value;
                  const selectedFilter = availableFilters.find(
                    (filter) => filter.id === selectedFilterId
                  );
                  if (selectedFilter) {
                    addFilter(selectedFilter);
                  }
                }}
              >
                <option value="" disabled>
                  Add Filter
                </option>
                {availableFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

function aggregateFilters(filters: Map<string, FilterFn>) {
  return (p: BlogPost) => {
    for (const filter of filters.values()) {
      if (!filter(p)) {
        return false;
      }
    }
    return true;
  };
}