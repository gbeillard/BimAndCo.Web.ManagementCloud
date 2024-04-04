import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@bim-co/componentui-foundation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { BadRequestError } from 'Scripts/App/Api/types';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import { IClassification } from '../../../../Reducers/classifications/types';
import Content from './Components/Content';
import Errors from './Components/Errors';

type Props = {
  resources: any;
  classification: IClassification;
  file: File;
  isOpen: boolean;
  isLoading: boolean;
  errors: BadRequestError[];
  isFatalError: boolean;
  onClose: () => void;
  onImport: () => void;
  onExport: () => void;
};

const ImportModal: React.FC<Props> = ({
  resources,
  classification,
  file,
  isOpen,
  isLoading,
  errors,
  isFatalError,
  onClose,
  onImport,
  onExport,
}) => {
  const getContent = () => {
    if (errors?.length || isFatalError) {
      return (
        <Errors
          file={file}
          errors={errors}
          isFatalError={isFatalError}
          onImport={onImport}
          onExport={onExport}
        />
      );
    }

    return <Content file={file} isLoading={isLoading} />;
  };

  return (
    <Dialog isOpen={isOpen} onClose={!isLoading && onClose}>
      <DialogTitle>{classification.Name}</DialogTitle>
      <DialogContent>{getContent()}</DialogContent>
      <DialogActions>
        {!isLoading && (
          <>
            {(isFatalError || errors?.length) && (
              <Button variant="secondary" icon="import" onClick={onImport}>
                {resources.ClassificationMenu.Import}
              </Button>
            )}
            <Button onClick={onClose}>{resources.MetaResource.Close}</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ImportModal);
