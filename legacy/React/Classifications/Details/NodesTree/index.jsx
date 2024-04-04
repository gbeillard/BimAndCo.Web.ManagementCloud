import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { DndProvider, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { defaultTheme, Icon, space } from '@bim-co/componentui-foundation';
import toastr from 'toastr';

import AddButton from './AddButton';
import NodeList from './NodeList';
import { DRAG_TYPES } from './constants';
import { NODES_DISPLAY } from '../../../../Reducers/classifications/types';
import {
  selectAddingNodeToClassificationIsSuccess,
  selectIsFetchingNodes,
} from '../../../../Reducers/classifications/selectors';
import ClassificationNodeModal from '../../_shared/ClassificationNodeModal';

const NodesTree = ({
  classificationId,
  nodes,
  onNodeSelected,
  onNodeAdded,
  onNodeDeleted,
  onNodeMoved,
  display,
  isFetchingNodes,
  resources,
  nodesCount,
  disableCriticalFeatures,
}) => {
  const visibleNodes = nodes.slice(0, nodesCount);

  if (isFetchingNodes) {
    return (
      <IconWrapper>
        <Icon icon="loader" size="m" />
      </IconWrapper>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <NodesTreeInner
        classificationId={classificationId}
        nodes={visibleNodes}
        onNodeSelected={onNodeSelected}
        onNodeAdded={onNodeAdded}
        onNodeDeleted={onNodeDeleted}
        onNodeMoved={onNodeMoved}
        display={display}
        resources={resources}
        disableCriticalFeatures={disableCriticalFeatures}
      />
    </DndProvider>
  );
};
const NodesTreeInner = ({
  classificationId,
  nodes,
  onNodeSelected,
  onNodeAdded,
  onNodeDeleted,
  onNodeMoved,
  display,
  resources,
  disableCriticalFeatures,
  addingNodeToClassificationIsSuccess,
}) => {
  const [show, setShow] = useState(false);
  const open = () => {
    setShow(true);
  };
  const close = () => {
    setShow(false);
  };

  useEffect(() => {
    // Create node success
    if (addingNodeToClassificationIsSuccess) {
      close();
    }
  }, [addingNodeToClassificationIsSuccess]);

  const onNodeAddedHandler = (addedNode) => {
    onNodeAdded(addedNode, null);
  };

  const [{ isOverCurrent }, drop] = useDrop({
    accept: DRAG_TYPES.NODE,
    canDrop: (item) => canDropHandler(item.dndNode),
    drop: (item, monitor) => onNodeDropped(item.dndNode, monitor),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  const canDropHandler = (droppedNode) =>
    !disableCriticalFeatures &&
    display === NODES_DISPLAY.EDIT &&
    !nodes.find((node) => node.Id === droppedNode.Id);
  const onNodeDropped = (droppedNode, monitor) => {
    if (disableCriticalFeatures || monitor.didDrop()) {
      return;
    }
    onNodeMoved(null, droppedNode);
  };

  return (
    <Wrapper ref={drop} dropping={isOverCurrent}>
      {!disableCriticalFeatures && (
        <AddButtonWrapper>
          <AddButton label="" onClick={open} />
        </AddButtonWrapper>
      )}
      <NodeList
        classificationId={classificationId}
        nodes={nodes}
        onNodeSelected={onNodeSelected}
        onNodeAdded={onNodeAdded}
        onNodeDeleted={onNodeDeleted}
        onNodeMoved={onNodeMoved}
        display={display}
        resources={resources}
        disableCriticalFeatures={disableCriticalFeatures}
        show
        isRoot
      />
      <ClassificationNodeModal isOpen={show} onSubmit={onNodeAddedHandler} onClose={close} />
    </Wrapper>
  );
};

const spin = keyframes`
    from {
       transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${space[100]};
  margin-left: ${space[350]};
  > * {
    animation: ${spin} 1s ease infinite;
  }
`;

const Wrapper = styled.div`
  padding: ${space[62]};
  border: ${(props) =>
    props.dropping
      ? `${space[6]} solid ${defaultTheme.textColorSecondary}`
      : `${space[6]} solid transparent`};
  border-radius: ${defaultTheme.borderRadius};
`;
const AddButtonWrapper = styled.div`
  margin-left: ${space[200]};
`;

const mapStateToProps = createStructuredSelector({
  isFetchingNodes: selectIsFetchingNodes,
  addingNodeToClassificationIsSuccess: selectAddingNodeToClassificationIsSuccess,
});

export default connect(mapStateToProps)(NodesTree);
