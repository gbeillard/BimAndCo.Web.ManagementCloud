import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';
import { useNavigate } from 'react-router-dom';
import { selectTranslatedResources, selectLanguageCode } from '../../../Reducers/app/selectors';
import { LanguageCode } from '../../../Reducers/app/types';

type Props = {
  resources: any;
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
});

// Empty state - Empty set
type EmptySetProps = Props & {
  setName: string;
};

const EmptyStateEmptySet: React.FC<EmptySetProps> = ({ resources, setName }) => {
  let title = resources.ContentManagementEmptyState.EmptySetTitle;

  if (title) {
    title = title.replace('[SetName]', setName);
  }

  return (
    <EmptyStateDS
      title={title}
      description={resources.ContentManagementEmptyState.EmptySetDescription}
    />
  );
};

export const EmptySet = connect(mapSelectToProps)(EmptyStateEmptySet);

// Empty state - Set does not exist
type SetDoesNotExistProps = Props & {
  languageCode: LanguageCode;
};

const EmptyStateSetDoesNotExist: React.FC<SetDoesNotExistProps> = ({ resources, languageCode }) => {
  const navigate = useNavigate();
  return (
    <EmptyStateDS
      title={resources.ContentManagementEmptyState.SetDoesNotExistTitle}
      description={resources.ContentManagementEmptyState.SetDoesNotExistDescription}
      actionLabel={resources.ContentManagementEmptyState.SetDoesNotExistAction}
      onClickAction={() => navigate(`/${languageCode}/dictionary/sets`)}
    />
  );
};

export const SetDoesNotExist = connect(mapSelectToProps)(EmptyStateSetDoesNotExist);
