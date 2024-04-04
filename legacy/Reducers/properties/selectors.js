/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createSelector } from 'reselect';
import Fuse from "fuse.js";

const selectDomain = (store) => store.domains;

export const selectDomains = createSelector(selectDomain, (state) => state.domains);
export const selectFilter = createSelector(selectDomain, (state) => state.filter);
export const selectApiState = createSelector(selectDomain, (state) => state.apiState);
export const selectNormalizedFilter = createSelector(selectFilter, (filter) =>
  normalizeFilter(filter)
);
export const selectFilteredDomains = createSelector(
  selectNormalizedFilter,
  selectDomains,
  (filter, domains) => filterDomains(filter, domains)
);

const filterDomains = (filter, domains) =>
  domains.reduce((filteredDomains, domain) => {
    const filteredDomain = getFilteredDomain(filter, domain);
    if (filteredDomain === null) {
      return filteredDomains;
    }

    return [...filteredDomains, filteredDomain];
  }, []);

const normalizeFilter = (filter) => ({
  ...filter,
  text: normalizeFilterText(filter),
});
const normalizeFilterText = ({ text }) =>
  text
    .toLowerCase()
    .replace(/-/, ' ')
    .replace(/_/, ' ')
    .split(/\s/)
    .filter((word) => word.length > 2);

const getHasText = (filter) => filter.text.length > 0 && filter.text[0].length > 0;
const getHasDataTypes = (filter) => filter.dataTypes.length > 0;
const matchDataType = ({ dataTypes }, { DataTypeId }) => dataTypes.includes(DataTypeId);
const matchText = ({ text }, { Name, Description }) =>
  text.filter(
    (word) => Name.toLowerCase().includes(word) || Description.toLowerCase().includes(word)
  ).length > 0;

const searchFlex = (filter, property) => {
  const hasText = getHasText(filter);
  const hasDataTypes = getHasDataTypes(filter);
  if (!hasText && !hasDataTypes) {
    return true;
  }

  if (hasText && !hasDataTypes) {
    return matchText(filter, property);
  }

  if (!hasText && hasDataTypes) {
    return matchDataType(filter, property);
  }

  return matchText(filter, property) && matchDataType(filter, property);
};

const getFilteredDomain = (filter, domain) => {
  const options = {
    includeScore: true,
    keys: ['Name', 'Properties.Name', 'Properties.DataType'],
    shouldSort: true,
  };
  const fuse = new Fuse(domain.Properties, options);

  const filteredProperties = fuse.search(filter).map((result) => result.item);
  if (filteredProperties.length < 1) {
    return null;
  }

  return { ...domain, Properties: filteredProperties };
};
