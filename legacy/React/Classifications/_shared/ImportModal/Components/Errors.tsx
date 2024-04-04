import { Button, H2, Icon, P } from '@bim-co/componentui-foundation';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { BadRequestError } from 'Scripts/App/Api/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import ErrorsModal from './ErrorsModal';
import { StackCenter, Wrapper } from './Styles';

type Props = {
  resources: any;
  file: File;
  errors: BadRequestError[];
  isFatalError: boolean;
  onImport: () => void;
  onExport: () => void;
};

const Errors: React.FC<Props> = ({
  resources,
  isFatalError,
  onImport,
  onExport,
  ...otherProps
}) => {
  const [isErrorsModalOpen, setIsErrorsModalOpen] = useState(false);

  const openErrorsModal = () => {
    setIsErrorsModalOpen(true);
  };

  const closeErrorsModal = () => {
    setIsErrorsModalOpen(false);
  };

  const importNewFile = () => {
    onImport?.();
  };

  const title = isFatalError
    ? resources.ClassificationImportModal.ImportFatalErrorTitle
    : resources.ClassificationImportModal.ImportErrorTitle;

  return (
    <>
      <Wrapper>
        <Icon icon="alert" color="danger" size="l" />
        <StackCenter>
          <H2>{title}</H2>
          {isFatalError ? (
            <>
              <div>
                <P>{resources.ClassificationImportModal.ImportFatalErrorDescription}</P>
              </div>
              <Button variant="primary" icon="export" onClick={onExport}>
                {resources.ClassificationMenu.Export}
              </Button>
            </>
          ) : (
            <Button variant="danger" onClick={openErrorsModal}>
              {resources.ClassificationImportModal.ImportErrorButton}
            </Button>
          )}
        </StackCenter>
      </Wrapper>
      <ErrorsModal
        isOpen={isErrorsModalOpen}
        onClose={closeErrorsModal}
        onImport={importNewFile}
        {...otherProps}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Errors);
