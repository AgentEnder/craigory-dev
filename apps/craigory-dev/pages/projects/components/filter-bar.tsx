import { FilterSearch } from './filter-search';
import { RepoData } from '../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterCheckbox } from './filter-checkbox';

import { FilterDropdown } from './filter-dropdown';
import { IoClose } from 'react-icons/io5';

import styles from './filter-bar.module.scss';

export type FilterFn = (p: RepoData) => boolean;

type FilterComponentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: Filter;
  onSetFilter: (id: string, filter: FilterFn) => void;
  context: {
    repos: RepoData[];
    allLanguages: string[];
  };
};

type FilterComponent = (props: FilterComponentProps) => JSX.Element;

type Filter = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
  component: FilterComponent;
};

export function SearchFilter({
  onSetFilter,
  filter: { initialValue, id },
}: FilterComponentProps) {
  const [state, setState] = useState<string | null>(initialValue);

  useEffect(() => {
    if (state) {
      onSetFilter(id, (p) =>
        p.repo.toLowerCase().includes(state.toLowerCase())
      );
    } else {
      onSetFilter(id, () => true);
    }
  }, [state, onSetFilter, id]);

  return (
    <FilterSearch
      onSearch={(v) => {
        setState(v);
      }}
    ></FilterSearch>
  );
}

export function LanguageFilter({
  onSetFilter,
  context,
  filter,
}: FilterComponentProps) {
  return (
    <FilterDropdown
      label="Language"
      onValueChange={(v) => {
        onSetFilter(filter.id, (p) => v.every((l) => p.languages?.[l]));
      }}
      options={context.allLanguages}
      multiple={true}
    ></FilterDropdown>
  );
}

function LiveSiteFilter({
  onSetFilter,
  filter: { id, initialValue },
}: FilterComponentProps) {
  const [state, setState] = useState<boolean | null>(initialValue);

  useEffect(() => {
    if (state) {
      onSetFilter(id, (p) => !!p.deployment);
    } else {
      onSetFilter(id, (p) => !p.deployment);
    }
  }, [state, onSetFilter, id]);

  return (
    <FilterCheckbox
      label="Live site?"
      defaultValue={true}
      onValueChange={(v) => {
        setState(v);
      }}
    ></FilterCheckbox>
  );
}

export function PublishedPackagesFilter({
  onSetFilter,
  filter: { id, initialValue },
}: FilterComponentProps) {
  const [state, setState] = useState<boolean | null>(initialValue);

  useEffect(() => {
    if (state) {
      onSetFilter(id, (p) => Object.keys(p.publishedPackages ?? {}).length > 0);
    } else {
      onSetFilter(
        id,
        (p) => Object.keys(p.publishedPackages ?? {}).length === 0
      );
    }
  }, [state, onSetFilter, id]);

  return (
    <FilterCheckbox
      label="Published Packages?"
      defaultValue={true}
      onValueChange={(v) => {
        setState(v);
      }}
    ></FilterCheckbox>
  );
}

const ALL_FILTERS: Filter[] = [
  { id: 'search', component: SearchFilter },
  { id: 'language', component: LanguageFilter },
  { id: 'live-site', component: LiveSiteFilter, initialValue: true },
  {
    id: 'published-packages',
    component: PublishedPackagesFilter,
    initialValue: true,
  },
];

const DEFAULT_FILTERS = [ALL_FILTERS[0]];

export function FilterBar({
  onSetFilter,
  onSetSort,
  repos,
}: {
  onSetFilter: (filter: FilterFn) => void;
  onSetSort: (
    fn: (projects: RepoData[]) => (a: RepoData, b: RepoData) => number
  ) => void;
  repos: RepoData[];
}) {
  const languages = useMemo(
    () => [...new Set(repos.flatMap((r) => Object.keys(r.languages ?? {})))],
    [repos]
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
    setFilters((f) => {
      f.delete(id);
      return new Map(f);
    });
  }

  function addFilter(filter: Filter) {
    setFilters((f) => {
      f.set(filter.id, filter);
      return new Map(f);
    });
  }

  return (
    <table className={styles['filter-table']}>
      <tbody>
        {Array.from(filters.values()).map((filter) => (
          <tr key={filter.id}>
            <td>
              <button
                title="Remove filter"
                onClick={() => {
                  filterById.delete(filter.id);
                  removeFilter(filter.id);
                  onSetFilter(aggregateFilters(filterById));
                }}
              >
                <IoClose></IoClose>
              </button>
            </td>
            <filter.component
              onSetFilter={setFilterFn}
              context={{ repos, allLanguages: languages }}
              filter={filter}
            ></filter.component>
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
                    {filter.id}
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
  return (p: RepoData) => {
    for (const filter of filters.values()) {
      if (!filter(p)) {
        return false;
      }
    }
    return true;
  };
}
