import { Button, H2, Icon, Loader, P } from '@bim-co/componentui-foundation';
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { StackCenter, Wrapper } from '../../ImportModal/Components/Styles';

type Props = {
  resources: any;
  isLoading: boolean;
  onRedirect: () => void;
  onClose: () => void;
};

const CloneContent: React.FC<Props> = ({ resources, isLoading, onRedirect, onClose }) => {
  const ContentIcon = isLoading ? (
    <Loader size="l" color="primary" />
  ) : (
    <Icon icon="check-circle" color="confirm" size="l" />
  );

  const title = isLoading
    ? resources.ClassificationClone.InProgressTitle
    : resources.ClassificationCloneModal.DuplicationCompleted;

  const handleClickRedirect = () => {
    onRedirect();
    onClose();
  };

  return (
    <Wrapper>
      {ContentIcon}
      <StackCenter>
        <H2>{title}</H2>
        {isLoading ? (
          <div>
            <P>{resources.ClassificationImportModal.ImportInProgressDescription}</P>
          </div>
        ) : (
          <Button variant="secondary" onClick={handleClickRedirect}>
            {resources.ClassificationCloneModal.DuplicationRedirection}
          </Button>
        )}
      </StackCenter>
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(CloneContent);
