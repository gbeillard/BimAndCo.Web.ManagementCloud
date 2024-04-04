import Fuse from 'fuse.js';
import { SubsetSource } from '../../Sets/Subsets/types';
import { NodeProperty } from './types';

export const getSourceSubset = (property: NodeProperty) =>
  property.Subsets.find((subset) => subset.Sources.includes(SubsetSource.Node));

/**
 * Search for a text into a list
 * @param properties List of properties
 * @param filter the text to search for
 * @param fieldNames list of fields to search in
 */
export const searchProperties = (
  properties: NodeProperty[],
  filter: string,
  fieldNames: string[] = ['Name']
): NodeProperty[] => {
  if (!filter || filter.trim() === '') {
    return properties;
  }

  const options: Fuse.IFuseOptions<NodeProperty> = {
    keys: fieldNames,
    includeScore: true,
  };

  const fuse = new Fuse(properties, options);
  const results = fuse.search(filter);

  return results.map((result) => result.item);
};
