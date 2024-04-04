import Fuse from 'fuse.js';
import { Set } from '../../properties-sets/types';
import { Subset } from '../../Sets/Subsets/types';
import { Filter } from './types';

/**
 * Search for a text into a list
 * @param subsets List of subsets
 * @param filter the text to search for
 * @param fieldNames list of fields to search in
 */
export const searchSubsets = (
  subsets: Subset[],
  filter: string,
  fieldNames: string[] = ['Name']
): Subset[] => {
  if (!filter || filter.trim() === '') {
    return subsets;
  }
  const options = {
    includeScore: true,
    keys: fieldNames,
  };
  const fuse = new Fuse(subsets, options);
  const results = fuse.search(filter);
  return results.map((result) => result.item);
};

export const getFilteredSubsets = (subsets: Subset[], { text, setId }: Filter): Subset[] => {
  const textFilteredSubsets = searchSubsets(subsets, text, ['Name', 'Set:Name']);

  if (setId === null) {
    return textFilteredSubsets;
  }

  return textFilteredSubsets.filter((subset) => subset.Set.Id === setId);
};

export const getSets = (subsets: Subset[]): Set[] =>
  subsets.reduce(
    (sets: Set[], subset) =>
      sets.find((set) => set.Id === subset.Set.Id) ? sets : [...sets, subset.Set],
    []
  );
