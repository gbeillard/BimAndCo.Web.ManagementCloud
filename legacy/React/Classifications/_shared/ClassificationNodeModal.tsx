import React, { useState, useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  space,
} from '@bim-co/componentui-foundation';
import { replaceStringByComponent } from '../../../Utils/utilsResources';
import { IClassificationNode } from '../../../Reducers/classifications/types';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import {
  selectAddNodeToClassificationIsPending,
  selectUpdateNodeIsPending,
} from '../../../Reducers/classifications/selectors';
import { defaultNode } from './DefaultValues';

type Props = {
  node?: IClassificationNode;
  onSubmit: (node: IClassificationNode) => void;
  onClose: () => void;
  resources: any;
  isOpen: boolean;
  parentNode?: IClassificationNode;
  isLoadingNode?: boolean;
  updateNodeIsPending: boolean;
};

const defaultParentNode = {
  Id: -1,
  Name: '',
};

const ClassificationNodeModal: React.FC<Props> = ({
  node = defaultNode,
  onSubmit,
  onClose,
  resources,
  isOpen,
  isLoadingNode,
  parentNode = defaultParentNode,
  updateNodeIsPending,
}) => {
  const [localNode, setLocalNode] = useState<IClassificationNode>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      setLocalNode(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const nameValidation = (value: string) => !value?.trim() && resources.MetaResource.Required;

  const validate = {
    Name: (name: string) => nameValidation(name),
  };

  const checkField = (field: string, value) => {
    const validation = validate[field];

    // Return the error message
    return validation && validation(value);
  };

  const getNewErrors = (currentErrors, field: string, value) => {
    const error = checkField(field, value);

    const newErrors = { ...currentErrors };
    if (!error) {
      delete newErrors[field];
    } else {
      newErrors[field] = error;
    }

    return newErrors;
  };

  const checkForm = () => {
    const newErrors = Object.keys(localNode || {}).reduce(
      (currentErrors, field) => getNewErrors(currentErrors, field, localNode[field]),
      {}
    );

    setErrors(newErrors);

    return newErrors;
  };

  const isValidForm = () => {
    const newErrors: { [s: string]: unknown } = checkForm();

    return !Object.values(newErrors || {}).length;
  };

  // Handle text fields
  const handleChangeTextField: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event
  ) => {
    const { name, value } = event.currentTarget;

    setLocalNode({
      ...localNode,
      [name]: value,
    });
    setErrors(getNewErrors(errors, name, value));
  };

  const onClickHandler = () => {
    isValidForm() && onSubmit(localNode);
  };
  const onCloseHandler = () => {
    onClose();
    setErrors({});
  };

  if (node === null) {
    return null;
  }

  const parentNodeName = parentNode?.Name ?? '';

  const titleAdd =
    parentNode?.Id === -1
      ? resources.ContentManagementClassif.AddRootNode
      : replaceStringByComponent(
          resources.ContentManagementClassif.AddNode,
          '[ClassificationNode]',
          <strong>{parentNodeName}</strong>
        );
  const titleEdit = replaceStringByComponent(
    resources.ContentManagement.ClassificationNodeName,
    '[NodeName]',
    <strong>{node?.Name}</strong>
  );
  const finalTitle = node?.Id ? titleEdit : titleAdd;

  const nodeModalSaveButton = node?.Id
    ? resources.ContentManagementClassif.EditNodeButton
    : resources.ContentManagementClassif.AddButton;

  const isLoadingButton = updateNodeIsPending || isLoadingNode;

  return (
    <Dialog isOpen={isOpen} onClose={onCloseHandler}>
      <DialogTitle>{finalTitle}</DialogTitle>
      <DialogContent>
        <Stack space={space[100]}>
          <TextField
            name="Name"
            label={resources.ContentManagementClassif.AddRootNodeName}
            value={localNode?.Name}
            onChange={handleChangeTextField}
            placeholder={resources.ContentManagementClassif.AddRootNodeName}
            maxLength={200}
            fullWidth
            isRequired
            isError={errors?.Name}
            helperText={errors?.Name}
          />
          <TextField
            name="Code"
            label={resources.ContentManagementClassif.AddRootNodeCode}
            value={localNode?.Code}
            onChange={handleChangeTextField}
            placeholder={resources.ContentManagementClassif.AddRootNodeCode}
            fullWidth
            maxLength={100}
          />
          <TextField
            name="Description"
            label={resources.ContentManagementClassif.NodeDefinition}
            placeholder={resources.ContentManagementClassif.NodeDefinition}
            value={localNode?.Description}
            onChange={handleChangeTextField}
            fullWidth
            isMultiline
            rows="4"
            maxLength={4000}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler} isDisabled={isLoadingButton}>
          {resources.MetaResource.Cancel}
        </Button>
        <Button variant="primary" onClick={onClickHandler} isLoading={isLoadingButton}>
          {nodeModalSaveButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  isLoadingNode: selectAddNodeToClassificationIsPending,
  updateNodeIsPending: selectUpdateNodeIsPending,
});

export default connect(mapStateToProps)(ClassificationNodeModal);
