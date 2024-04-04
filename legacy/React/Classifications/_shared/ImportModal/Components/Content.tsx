import React from 'react';
import { Cluster, H2, Icon, Loader, space, P } from '@bim-co/componentui-foundation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { getFileIcon } from '../../../../../../../Content/Icons/Files';
import { Icon as FileIcon } from '../../../../../components/Icons';
import { StackCenter, Wrapper } from './Styles';

type Props = {
  resources: any;
  file: File;
  isLoading: boolean;
};

const Content: React.FC<Props> = ({ resources, file, isLoading }) => {
  const fileIcon = getFileIcon('xlsx');

  const ContentIcon = isLoading ? (
    <Loader size="l" color="primary" />
  ) : (
    <Icon icon="check-circle" color="confirm" size="l" />
  );

  const title = isLoading
    ? resources.ClassificationImportModal.ImportInProgressTitle
    : resources.ClassificationImportModal.ImportCompletedTitle;

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
          <Cluster nowrap space={space[12]}>
            <FileIcon svg={fileIcon} />
            <div>
              <P>{file?.name}</P>
            </div>
          </Cluster>
        )}
      </StackCenter>
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Content);
