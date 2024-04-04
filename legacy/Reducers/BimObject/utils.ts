import { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import {
  ValueContainerFilter,
  FilterProperty,
  FilterAlias,
  SearchRequestStaticFilters,
  SearchRequestStaticFilter,
  FilterKind,
  SearchResponse,
  SearchObjectsOptions,
  ProcessResponseMode,
  SearchResponseDocument,
} from './types';
import { GroupType } from '../groups/constants';

const createValueFilterEntry = (
  value: ImmutableArray<string>,
  property: FilterProperty,
  alias: FilterAlias
): ValueContainerFilter => ({
  Property: property,
  Alias: alias,
  Values: [].concat(value), // allows to create array from either item or array
});

export const setValueFilter = (
  filters: ValueContainerFilter[],
  values: ImmutableArray<string>,
  property: FilterProperty,
  alias: FilterAlias
) => {
  // remove the entry entirely
  if (values.length < 1) {
    return filters.filter((filter) => filter.Property !== property);
  }
  const specificFilter = filters.find((filter) => filter.Property === property);
  // entry doesnt exist
  if (!specificFilter) {
    return [...filters, createValueFilterEntry(values, property, alias)];
  }
  // replace existing entry
  const updatedSpecificFilter = { ...specificFilter, Values: values };
  return filters.map((filter) => {
    if (filter.Property === updatedSpecificFilter.Property) {
      return updatedSpecificFilter;
    }
    return filter;
  });
};

export const addPropertyFilter = (filters: ValueContainerFilter[], propertyId: string) => {
  const entry: ValueContainerFilter = {
    Property: FilterProperty.Property,
    Alias: FilterAlias.Property,
    PropertyId: propertyId,
    Values: [],
  };
  // entry already exists
  if (
    filters.some(
      (existingFilter) =>
        existingFilter.Property === FilterProperty.Property &&
        existingFilter.PropertyId === entry.PropertyId
    )
  ) {
    return filters;
  }
  return [...filters, entry];
};

export const removePropertyFilter = (filters: ValueContainerFilter[], propertyId: string) =>
  filters.filter(
    (filter) => !(filter.Property === FilterProperty.Property && filter.PropertyId === propertyId)
  );

export const setPropertyFilter = (
  filters: ValueContainerFilter[],
  propertyId: string,
  values: ImmutableArray<string>
) =>
  filters.map((filter) => {
    if (filter.Property === FilterProperty.Property && filter.PropertyId === propertyId) {
      return { ...filter, Values: values };
    }
    return filter;
  });

export const setStaticFilter = (
  filters: ImmutableObject<SearchRequestStaticFilters>,
  propertyId: string
) => {
  const index = `${FilterProperty.Property}-${propertyId}`;
  const propertyFilter: SearchRequestStaticFilter = {
    Property: FilterProperty.Property,
    PropertyId: propertyId,
    Kind: FilterKind.Value,
  };
  return filters.setIn([index], propertyFilter);
};

export const updateObjects = (
  existingObjects: SearchResponseDocument[],
  responseObjects: SearchResponseDocument[],
  processResponseMode: ProcessResponseMode,
  options: SearchObjectsOptions
): SearchResponseDocument[] => {
  if (!options.withResults) {
    return existingObjects;
  }

  if (processResponseMode === ProcessResponseMode.Concat) {
    return existingObjects.concat(responseObjects);
  }

  return responseObjects;
};

export const updateResponse = (
  existingResponse: SearchResponse,
  incomingResponse: SearchResponse,
  options: SearchObjectsOptions
): SearchResponse => {
  if (options.withFilters) {
    return incomingResponse;
  }
  return {
    ...incomingResponse,
    StaticFilters: existingResponse.StaticFilters,
  };
};

export const isFavorite = (bimObject) => bimObject?.GroupsList?.some((g) => g?.IsFavorite) ?? false;
