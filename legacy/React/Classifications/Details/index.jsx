/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import toastr from 'toastr';

import Component from './Component';
import {
  fetchNodes as fetchNodesAction,
  setNodes as setNodesAction,
  updateNode as updateNodeAction,
  setNodesFilter as setNodesFilterAction,
  selectNode as selectNodeAction,
  addNodeToClassification as addNodeToClassificationAction,
  removeNodeFromClassification as removeNodeFromClassificationAction,
  moveNode as moveNodeAction,
  fetchClassification as fetchClassificationAction,
  resetState as resetClassificationsStateAction,
} from '../../../Reducers/classifications/actions';
import {
  selectDisplayedNodesFilter,
  selectNodesDisplay,
  selectSelectedNode,
  selectMappedClassification,
  selectLanguage,
  selectUpdateNodeIsError,
  selectAddingNodeToClassificationIsError,
  selectRemoveNodeFromClassificationIsError,
  selectFetchClassificationIsError,
  selectIsFetchingClassification,
} from '../../../Reducers/classifications/selectors';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectTranslatedResources,
  selectSettings,
  selectUser,
  selectIsBoostOffer,
} from '../../../Reducers/app/selectors';
import { isDisableCriticalFeatures } from '../utils';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import { setPageTitle as setPageTitleAction } from '../../../Reducers/app/actions';

const DetailsContainer = ({
  classification,
  fetchClassification,
  fetchNodes,
  moveNode,
  updateNode,
  selectNode,
  addNodeToClassification,
  removeNodeFromClassification,
  filter,
  setFilter,
  display,
  languageCode,
  currentNode,
  resources,
  classificationsLanguage,
  resetClassificationsState,
  onflyId,
  isBoostOffer,
  settings,
  user,
  updateNodeIsError,
  addingNodeToClassificationIsError,
  deleteNodeIsError,
  setPageTitle,
  fetchClassificationIsPending,
  fetchClassificationIsError,
}) => {
  const navigate = useNavigate();

  const { classificationId } = useParams();

  useEffect(() => {
    // mount
    fetchClassification(parseInt(classificationId));

    // unmount
    return () => {
      resetClassificationsState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (classificationId) {
      fetchClassification(parseInt(classificationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classificationsLanguage]);

  useEffect(() => {
    if (classificationId) {
      fetchNodes(parseInt(classificationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classificationId]);

  useEffect(() => {
    // Create node failed
    if (addingNodeToClassificationIsError) {
      toastr.error(addingNodeToClassificationIsError, resources.ContentManagement.CreateNodeFailed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addingNodeToClassificationIsError]);

  useEffect(() => {
    // Page title
    if (fetchClassificationIsError) {
      // Error when classification is loading or classification is public
      setPageTitle(resources.ContentManagementEmptyState.ClassificationDoesNotExistTitle);
    }
  }, [languageCode, setPageTitle, resources, fetchClassificationIsError]);

  useEffect(() => {
    // Update node failed
    if (updateNodeIsError) {
      toastr.error(updateNodeIsError, resources.ContentManagement.UpdateNodeFailed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNodeIsError]);

  useEffect(() => {
    // Delete node failed
    if (deleteNodeIsError) {
      toastr.error(resources.ContentManagement.DeleteNodeFailed, deleteNodeIsError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteNodeIsError]);

  if (!settings.EnableClassificationManagement) {
    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>{resources.ContentManagement.Error403}</p>
      </div>
    );
  }

  if (!classification.nodes) {
    return <span>Loading...</span>;
  }

  const onPageChangeHandler = (id) => {
    const url = `/${languageCode}/${RoutePaths.ManageClassifications}/${id}`;
    navigate(url);
  };

  const onLanguageChangeHandler = (language) => {
    const url = `/${language}/${RoutePaths.ManageClassifications}/${classification.id}`;
    navigate(url);
  };

  const onNodeAddedHandler = (addedNode, nodeId) => {
    addNodeToClassification(classification.Id, nodeId, addedNode);
  };

  const onNodeDeletedHandler = (node, keepPropertiesWithValue) => {
    removeNodeFromClassification(classification.Id, node, keepPropertiesWithValue);
  };

  const onNodeEditedHandler = (node) => {
    updateNode(classification.Id, node);
  };

  const onNodeMovedHandler = (node, target) => {
    moveNode(classification.Id, node, target);
  };

  const onClassificationEditedHandler = () => {
    fetchClassification(classification.Id);
  };

  return (
    <Component
      classification={classification}
      filter={filter}
      onNodeSelected={selectNode}
      onNodeAdded={onNodeAddedHandler}
      onNodeDeleted={onNodeDeletedHandler}
      onNodeMoved={onNodeMovedHandler}
      onFilterChanged={setFilter}
      display={display}
      onPageChange={onPageChangeHandler}
      currentLanguageCode={languageCode}
      onLanguageChange={onLanguageChangeHandler}
      currentNode={currentNode}
      resources={resources}
      onNodeEdited={onNodeEditedHandler}
      onClassificationEdited={onClassificationEditedHandler}
      disableCriticalFeatures={isDisableCriticalFeatures(
        classification,
        isBoostOffer,
        onflyId,
        user
      )}
      fetchClassificationIsPending={fetchClassificationIsPending}
      fetchClassificationIsError={fetchClassificationIsError}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  classification: selectMappedClassification,
  filter: selectDisplayedNodesFilter,
  display: selectNodesDisplay,
  languageCode: selectLanguageCode,
  currentNode: selectSelectedNode,
  resources: selectTranslatedResources,
  classificationsLanguage: selectLanguage,
  onflyId: selectManagementCloudId,
  settings: selectSettings,
  user: selectUser,
  isBoostOffer: selectIsBoostOffer,
  updateNodeIsError: selectUpdateNodeIsError,
  addingNodeToClassificationIsError: selectAddingNodeToClassificationIsError,
  deleteNodeIsError: selectRemoveNodeFromClassificationIsError,
  fetchClassificationIsError: selectFetchClassificationIsError,
  fetchClassificationIsPending: selectIsFetchingClassification,
});

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (title) => dispatch(setPageTitleAction(title)),
  fetchClassification: (id) => dispatch(fetchClassificationAction(id)),
  fetchNodes: (id) => dispatch(fetchNodesAction(id)),
  setNodes: (nodes) => dispatch(setNodesAction(nodes)),
  updateNode: (classificationId, node) => dispatch(updateNodeAction(classificationId, node)),
  selectNode: (node) => dispatch(selectNodeAction(node)),
  addNodeToClassification: (classificationId, nodeId, node) =>
    dispatch(addNodeToClassificationAction(classificationId, nodeId, node)),
  removeNodeFromClassification: (classificationId, node, keepPropertiesWithValue) =>
    dispatch(removeNodeFromClassificationAction(classificationId, node, keepPropertiesWithValue)),
  moveNode: (classificationId, target, node) =>
    dispatch(moveNodeAction(classificationId, target, node)),
  setFilter: (filter) => dispatch(setNodesFilterAction(filter)),
  resetClassificationsState: () => dispatch(resetClassificationsStateAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsContainer);
