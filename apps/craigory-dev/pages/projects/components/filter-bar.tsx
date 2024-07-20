import { FilterSearch } from './filter-search';
import { RepoData } from '../types';
import { useState } from 'react';
import { FilterCheckbox } from './filter-checkbox';

import styles from './filter-bar.module.scss';
import { FilterDropdown } from './filter-dropdown';

export type FilterFn = (p: RepoData) => boolean;

export function FilterBar({
  onSetFilter,
  repos,
}: {
  onSetFilter: (filter: FilterFn) => void;
  repos: RepoData[];
}) {
  const [filters] = useState(new Map<string, FilterFn>());

  return (
    <table className={styles.filterTable}>
      <tbody>
        <FilterSearch
          onSearch={(v: string) => {
            if (v) {
              filters.set('search', (p) =>
                p.repo.toLowerCase().includes(v.toLowerCase())
              );
            } else {
              filters.delete('search');
            }
            onSetFilter(aggregateFilters(filters));
          }}
        ></FilterSearch>
        <FilterDropdown
          label="Language"
          options={[
            ...new Set(repos.flatMap((r) => Object.keys(r.languages ?? {}))),
          ]}
          onValueChange={(v) => {
            if (v) {
              filters.set('language', (p) => v.every((l) => p.languages?.[l]));
            } else {
              filters.delete('language');
            }
            onSetFilter(aggregateFilters(filters));
          }}
          multiple={true}
        ></FilterDropdown>
        <FilterCheckbox
          label="Live site?"
          allowIndeterminate={true}
          defaultValue={null}
          onValueChange={(v) => {
            if (v) {
              filters.set('live', (p) => !!p.deployment);
            } else if (v === false) {
              filters.set('live', (p) => !p.deployment);
            } else {
              filters.delete('live');
            }
            onSetFilter(aggregateFilters(filters));
          }}
        ></FilterCheckbox>
        <FilterCheckbox
          label="Published Packages?"
          allowIndeterminate={true}
          defaultValue={null}
          onValueChange={(v) => {
            if (v) {
              filters.set(
                'published',
                (p) => Object.keys(p.publishedPackages ?? {}).length > 0
              );
            } else if (v === false) {
              filters.set(
                'published',
                (p) => Object.keys(p.publishedPackages ?? {}).length === 0
              );
            } else {
              filters.delete('published');
            }
            onSetFilter(aggregateFilters(filters));
          }}
        ></FilterCheckbox>
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
