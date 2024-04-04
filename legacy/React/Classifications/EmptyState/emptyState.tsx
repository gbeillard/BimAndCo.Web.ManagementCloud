import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';
import { useNavigate } from 'react-router-dom';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import { LanguageCode } from '../../../Reducers/app/types';
import { RoutePaths } from '../../Sidebar/RoutePaths';

type Props = {
  resources: any;
};

// Empty state - Empty classification
type EmptyClassificationProps = Props & {
  classificationName: string;
};

const EmptyStateEmptyClassification: React.FC<EmptyClassificationProps> = ({
  resources,
  classificationName,
}) => {
  let title = resources.ContentManagementEmptyState.EmptyClassificationTitle;

  if (title) {
    title = title.replace('[ClassificationName]', classificationName);
  }

  return (
    <EmptyStateDS
      title={title}
      description={resources.ContentManagementEmptyState.EmptyClassificationDescription}
    />
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
});

export const EmptyStateClassification = connect(mapSelectToProps)(EmptyStateEmptyClassification);

// Empty state - Classification does not exist
type EmptyStateClassificationDoesNotExistProps = Props & {
  languageCode: LanguageCode;
};

const EmptyStateClassificationDoesNotExist: React.FC<EmptyStateClassificationDoesNotExistProps> = ({
  resources,
  languageCode,
}) => {
  const navigate = useNavigate();

  const navigateToClassificationsList = () => {
    const url = `/${languageCode}/${RoutePaths.ManageClassifications}`;
    navigate(url);
  };

  return (
    <EmptyStateDS
      title={resources.ContentManagementEmptyState.ClassificationDoesNotExistTitle}
      description={resources.ContentManagementEmptyState.ClassificationDoesNotExistDescription}
      actionLabel={resources.ContentManagementEmptyState.ClassificationDoesNotExistAction}
      onClickAction={navigateToClassificationsList}
    />
  );
};

export const ClassificationDoesNotExist = connect(mapSelectToProps)(
  EmptyStateClassificationDoesNotExist
);
