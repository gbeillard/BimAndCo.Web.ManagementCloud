import { SortDirection } from '@bim-co/componentui-foundation';
import { createSelector } from 'reselect';
import { ImmutableArray } from 'seamless-immutable';
import { getClassificationName } from '../../React/Classifications/_shared/utils';
import { selectLanguageCode } from '../app/selectors';
import { baseState } from './reducer';
import { ClassificationsSort, IClassification, IClassificationNode, SortOrderBy } from './types';

const selectRoot = (store): typeof baseState => store.classifications;

export const selectClassifications: any = createSelector(
  selectRoot,
  selectLanguageCode,
  (state, languageCode): IClassification[] =>
    state.classifications?.map((classification) => ({
      ...classification,
      Name: getClassificationName(classification, languageCode),
    }))
);

export const selectClassification: any = createSelector(
  selectRoot,
  selectLanguageCode,
  (state, languageCode): IClassification => ({
    ...state.classification,
    Name: getClassificationName(state.classification, languageCode),
  })
);
export const selectFilter: any = createSelector(selectRoot, (state) => state.filter);
export const selectDisplayedNodesFilter: any = createSelector(
  selectRoot,
  (state) => state.nodesFilter.displayed
);
export const selectDebouncedNodesFilter: any = createSelector(
  selectRoot,
  (state) => state.nodesFilter.debounced
);
export const selectNodesDisplay: any = createSelector(selectRoot, (state) => state.nodesDisplay);
export const selectSelectedNode: any = createSelector(selectRoot, (state) => state.selectedNode);
export const selectSort: any = createSelector(selectRoot, (state) => state.sort);

export const selectMappedClassification: any = createSelector(
  selectClassification,
  selectSelectedNode,
  selectDebouncedNodesFilter,
  (classification, selectedNode: IClassificationNode, filter: string) =>
    getMappedClassification(classification, selectedNode, filter)
);

export const selectFilteredClassifications: any = createSelector(
  selectFilter,
  selectClassifications,
  (filter, classifications) => filterClassifications(filter, classifications)
);

export const selectVisibleClassifications: any = createSelector(
  selectFilteredClassifications,
  selectSort,
  (classifications: IClassification[], sort: ClassificationsSort) =>
    sortClassifications(classifications, sort)
);

export const selectFetchClassificationsIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchClassifications.success
);
export const selectFetchClassificationsIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchClassifications.pending
);
export const selectFetchClassificationsIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchClassifications.error
);

export const selectIsFetchingNodes: any = createSelector(
  selectRoot,
  (state) => state.api.fetchNodes.pending
);

// Update Node
export const selectUpdateNodeIsError = createSelector(
  selectRoot,
  (state) => state.api.updateNode.error
);
export const selectUpdateNodeIsSuccess = createSelector(
  selectRoot,
  (state) => state.api.updateNode.success
);
export const selectUpdateNodeIsPending = createSelector(
  selectRoot,
  (state) => state.api.updateNode.pending
);

// Create Node
export const selectAddNodeToClassificationIsPending: any = createSelector(
  selectRoot,
  (state) => state.api.addNodeToClassification.pending
);
export const selectAddingNodeToClassificationIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.addNodeToClassification.success
);
export const selectAddingNodeToClassificationIsError = createSelector(
  selectRoot,
  (state): string => state.api.addNodeToClassification.error
);

// Delete Node
export const selectRemoveNodeFromClassificationIsPending: any = createSelector(
  selectRoot,
  (state) => state.api.removeNodeFromClassification.pending
);
export const selectRemoveNodeFromClassificationIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.removeNodeFromClassification.success
);
export const selectRemoveNodeFromClassificationIsError = createSelector(
  selectRoot,
  (state): string => state.api.removeNodeFromClassification.error
);

export const selectIsFetchingClassification: any = createSelector(
  selectRoot,
  (state) => state.api.fetchClassification.pending
);

export const selectFetchClassificationIsError = createSelector(
  selectRoot,
  (state) => state.api.fetchClassification.error
);

export const selectLanguage: any = createSelector(selectRoot, (state) => state.language);

const getMappedClassification = (
  classification,
  selectedNode: IClassificationNode,
  filter: string
) => {
  if (!classification?.nodes) {
    return { ...classification, nodes: [] };
  }
  const { mappedNodes } = getNodesWithSelected(classification.nodes, selectedNode);
  const filteredNodes =
    filter.length > 2
      ? getFilteredNodes(mappedNodes as IClassificationNode[], filter)
      : mappedNodes;
  return { ...classification, nodes: filteredNodes };
};

const filterClassifications = (filter, classifications) => {
  if (!filter || filter.length < 1) {
    return classifications;
  }

  return classifications.filter((classification) =>
    classification.Name.toLowerCase().includes(filter.toLowerCase())
  );
};

type ISortFunction = (a: IClassification, b: IClassification) => number;
const getSortFunction = (sort: ClassificationsSort): ISortFunction => {
  switch (sort.orderBy) {
    case SortOrderBy.Origin: {
      return sort.direction === SortDirection.Asc
        ? (a: IClassification) => (a.IsPrivate ? 1 : -1)
        : (a: IClassification) => (a.IsPrivate ? -1 : 1);
    }
    case SortOrderBy.Version: {
      return sort.direction === SortDirection.Asc
        ? (a: IClassification, b: IClassification) =>
            (a.Version ?? '').localeCompare(b.Version ?? '')
        : (a: IClassification, b: IClassification) =>
            -(a.Version ?? '').localeCompare(b.Version ?? '');
    }
    case SortOrderBy.SortedObjects: {
      return sort.direction === SortDirection.Asc
        ? (a: IClassification, b: IClassification) =>
            a.Statistics.ObjectsAssignedPercentage > b.Statistics.ObjectsAssignedPercentage ? 1 : -1
        : (a: IClassification, b: IClassification) =>
            a.Statistics.ObjectsAssignedPercentage > b.Statistics.ObjectsAssignedPercentage
              ? -1
              : 1;
    }
    case SortOrderBy.Visibility:
      return sort.direction === SortDirection.Asc
        ? (a: IClassification) => (a.IsEnabled ? 1 : -1)
        : (a: IClassification) => (a.IsEnabled ? -1 : 1);
    case SortOrderBy.Name:
    default:
      return sort.direction === SortDirection.Asc
        ? (a: IClassification, b: IClassification) => (a.Name ?? '').localeCompare(b.Name ?? '')
        : (a: IClassification, b: IClassification) => -(a.Name ?? '').localeCompare(b.Name ?? '');
  }
};

const sortClassifications = (
  classifications: IClassification[],
  sort: ClassificationsSort
): IClassification[] => {
  const sortFunction = getSortFunction(sort);
  return (
    (
      classifications as unknown as ImmutableArray<IClassification>
    ).asMutable() as unknown as IClassification[]
  ).sort(sortFunction);
};

const getFilteredNodes = (nodes: IClassificationNode[], filter: string): IClassificationNode[] =>
  nodes.reduce((results, node) => {
    const updatedResults = matchesFilter(node, filter) ? [...results, node] : results;

    if (node.Children && node.Children.length > 0) {
      const filteredChildren = getFilteredNodes(node.Children, filter);
      return [...updatedResults, ...filteredChildren];
    }

    return updatedResults;
  }, []);

const matchesFilter = (node: IClassificationNode, filter: string) =>
  node.Name.toLowerCase().includes(filter.toLowerCase()) ||
  node.Code.toLowerCase().includes(filter.toLowerCase());

const getNodesWithSelected = (nodes, selectedNode) => {
  const mappedNodes = nodes.map((node) => getNodeWithSelected(node, selectedNode));
  const willContainSelected = Boolean(
    mappedNodes.find((node) => node.selected || node.containsSelected)
  );
  return { mappedNodes, containsSelected: willContainSelected };
};

const getNodeWithSelected = (node, selectedNode) => {
  const isSelected = node.Id === selectedNode?.Id;

  if (node?.Children.length > 0) {
    const { mappedNodes, containsSelected } = getNodesWithSelected(node.Children, selectedNode);
    return {
      ...node,
      selected: isSelected,
      containsSelected,
      Children: mappedNodes ?? [],
    };
  }

  return { ...node, selected: isSelected };
};
