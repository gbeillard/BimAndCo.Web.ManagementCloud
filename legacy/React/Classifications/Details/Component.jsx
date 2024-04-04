import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styled from '@emotion/styled';
import { TextField, Portal, space, Loader } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import NodesTree from './NodesTree';
import Header from './Header';
import { Panel } from './Panel';
import PageContentContainer from '../../CommonsElements/PageContentContainer';
import ClassificationNodeModal from '../_shared/ClassificationNodeModal';
import { selectUpdateNodeIsSuccess } from '../../../Reducers/classifications/selectors';
import EmptyStateClassification from '../EmptyState';

const InifiniteScrollLoader = () => null;
const scrollStep = 100;

const Component = ({
  classification,
  onNodeSelected,
  onNodeAdded,
  onNodeEdited,
  onNodeDeleted,
  onNodeMoved,
  filter,
  onFilterChanged,
  display,
  onPageChange,
  currentLanguageCode,
  onLanguageChange,
  currentNode,
  resources,
  disableCriticalFeatures,
  updateNodeIsSuccess,
  fetchClassificationIsPending,
  fetchClassificationIsError,
}) => {
  const [showEditNode, setShowEditNode] = useState(false);
  const [nodesCount, setNodesCount] = useState(scrollStep);

  useEffect(() => {
    if (updateNodeIsSuccess) {
      closeEditNode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNodeIsSuccess]);

  if (fetchClassificationIsPending) {
    return (
      <PageContentContainer withNewBackgroundColor>
        <Loader />
      </PageContentContainer>
    );
  }

  // Error when classification is loading or classification is public
  if (fetchClassificationIsError) {
    return (
      <PageContentContainer withNewBackgroundColor>
        <EmptyStateClassification.ClassificationDoesNotExist />
      </PageContentContainer>
    );
  }

  const onLoadMore = () => {
    setNodesCount((currentCount) => currentCount + scrollStep);
  };

  const onChangeHandler = (event) => {
    onFilterChanged(event.target.value);
  };

  const openEditNode = () => {
    setShowEditNode(true);
  };
  const closeEditNode = () => {
    setShowEditNode(false);
  };

  const onSubmitEditHandler = (node) => {
    onNodeEdited(node);
  };

  return (
    <PageContentContainer withNewBackgroundColor>
      <InfiniteScroll
        loadMore={onLoadMore}
        hasMore={nodesCount < classification.nodes?.length}
        loader={<InifiniteScrollLoader />}
        useWindow={false}
      >
        <Header
          classification={classification}
          onPageChange={onPageChange}
          onLanguageChange={onLanguageChange}
          languageCode={currentLanguageCode}
          disableCriticalFeatures={disableCriticalFeatures}
        />
        <Main>
          <FilterWrapper>
            <TextField
              value={filter}
              onChange={onChangeHandler}
              size="dense"
              placeholder={resources.ClassificationDetails.Search}
              iconLeft="search"
            />
          </FilterWrapper>
          <NodesTree
            classificationId={classification.Id}
            nodes={classification.nodes}
            onNodeSelected={onNodeSelected}
            onNodeAdded={onNodeAdded}
            onNodeDeleted={onNodeDeleted}
            onNodeMoved={onNodeMoved}
            display={display}
            resources={resources}
            nodesCount={nodesCount}
            disableCriticalFeatures={disableCriticalFeatures}
          />
        </Main>
        <ClassificationNodeModal
          isOpen={showEditNode}
          node={currentNode}
          onClose={closeEditNode}
          onSubmit={onSubmitEditHandler}
        />
        <Portal>
          <PanelWrapper>
            <Panel
              node={currentNode}
              classificationId={classification.Id}
              onClose={() => onNodeSelected(null)}
              onEditNode={openEditNode}
              disableCriticalFeatures={disableCriticalFeatures}
            />
          </PanelWrapper>
        </Portal>
      </InfiniteScroll>
    </PageContentContainer>
  );
};

// start styled elements
const Main = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: ${space[200]};
`;
const PanelWrapper = styled.div`
  position: absolute;
  top: 150px;
  left: 40%;
  right: ${space[225]};
`;
const FilterWrapper = styled.div`
  margin-left: ${space[75]};
  max-width: ${space[1000]};
`;

// end styled elements

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  updateNodeIsSuccess: selectUpdateNodeIsSuccess,
});

export default connect(mapStateToProps)(Component);
