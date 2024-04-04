import { H2, Icon, P } from '@bim-co/componentui-foundation';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { StackCenter, Wrapper } from '../../ImportModal/Components/Styles';

type Props = {
  resources: any;
};

const CloneError: React.FC<Props> = ({ resources }) => (
  <Wrapper>
    <Icon icon="alert" color="danger" size="l" />
    <StackCenter>
      <H2>{resources.ClassificationCloneModal.DuplicationErrorTitle}</H2>
      <div>
        <P>{resources.ClassificationCloneModal.DuplicationErrorDescription}</P>
      </div>
    </StackCenter>
  </Wrapper>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(CloneError);
