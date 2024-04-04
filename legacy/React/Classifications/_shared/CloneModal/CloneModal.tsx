import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@bim-co/componentui-foundation';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { IClassification } from '../../../../Reducers/classifications/types';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';

import CloneContent from './Components/CloneContent';
import CloneError from './Components/CloneError';

type Props = {
  resources: any;
  isOpen: boolean;
  classification: IClassification;
  errors: any;
  isLoading: boolean;
  onRedirect: () => void;
  onClose: () => void;
};

const CloneModal: React.FC<Props> = ({
  resources,
  isOpen,
  classification,
  errors,
  isLoading,
  onClose,
  onRedirect,
}) => {
  const getContent = () => {
    if (errors) {
      return <CloneError />;
    }

    return <CloneContent isLoading={isLoading} onRedirect={onRedirect} onClose={onClose} />;
  };

  return (
    <Dialog isOpen={isOpen} onClose={isLoading ? null : onClose}>
      <DialogTitle>{classification?.Name}</DialogTitle>
      <DialogContent>{getContent()}</DialogContent>
      <DialogActions>
        {!isLoading && <Button onClick={onClose}>{resources.MetaResource.Close}</Button>}
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(CloneModal);
