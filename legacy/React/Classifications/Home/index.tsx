import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';

import ApiV10 from '../../../Reducers/classifications/api';
import Component from './Component';
import {
  selectFilter,
  selectSort,
  selectVisibleClassifications,
  selectLanguage as selectClassificationsLanguage,
} from '../../../Reducers/classifications/selectors';
import {
  setFilter as setFilterAction,
  setSort as setSortAction,
  fetchClassifications as fetchClassificationsAction,
  updateClassification as updateClassificationAction,
  setLanguage as setClassificationsLanguageAction,
  resetState as resetStateAction,
} from '../../../Reducers/classifications/actions';
import { setLoader as setLoaderAction } from '../../../Reducers/app/actions';
import { ClassificationsSort, IClassification } from '../../../Reducers/classifications/types';
import { LanguageCode } from '../../../Reducers/app/types';

import PageContentContainer from '../../CommonsElements/PageContentContainer';

import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import { ClassificationResponse } from '../interfaces';
import { redirectToClassificationDetails } from '../utils';

type Props = {
  classifications: IClassification[];
  filter: string;
  sort: ClassificationsSort;
  resources: any;
  managementCloudId: number;
  language: LanguageCode;
  classificationsLanguage: LanguageCode;
  fetchClassifications: () => void;
  updateClassification: (c: IClassification) => void;
  setFilter: (f: string) => void;
  setSort: (s: ClassificationsSort) => void;
  setClassificationsLanguage: (l: LanguageCode) => void;
  resetState: () => void;
  EnableClassificationManagement: boolean;
};

export const ClassificationsContainer: React.FC<Props> = ({
  classifications,
  filter,
  sort,
  resources,
  managementCloudId,
  language,
  classificationsLanguage,
  EnableClassificationManagement, // mapSelectToProps
  fetchClassifications,
  updateClassification,
  setFilter,
  setSort,
  setClassificationsLanguage,
  resetState, // mapDispatchToProps
}) => {
  useEffect(
    () => () => {
      resetState();
    },
    []
  );

  useEffect(() => {
    setClassificationsLanguage(language);
  }, [language]);

  useEffect(() => {
    classificationsLanguage && fetchClassifications();
  }, [classificationsLanguage]);

  if (classifications === null) {
    return null;
  }

  const handleCreateModalSubmit = (classification) => {
    // utilisé pour la Modal de création de classifications, hors scope
    ApiV10.create(managementCloudId, { ...classification, LanguageCode: language })
      .then((res: ClassificationResponse) => {
        /* Après la requête */
        redirectToClassificationDetails(res.Id, language);
      })
      .catch((error) =>
        toastr.error(resources.ContentManagementClassif.ErrorCreateClassification, error)
      );
  };

  const handleClassificationClicked = useCallback(
    ({ Id }) => {
      redirectToClassificationDetails(Id, language);
    },
    [language]
  );

  if (EnableClassificationManagement) {
    return (
      <Component
        classifications={classifications}
        onClassificationChanged={updateClassification}
        onCreate={handleCreateModalSubmit}
        onClassificationClicked={handleClassificationClicked}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
    );
  }
  return (
    <PageContentContainer withNewBackgroundColor>
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>Error 403 Access Denied</p>
      </div>
    </PageContentContainer>
  );
};

const mapStateToProps = (store) => {
  const { appState } = store;

  return {
    resources: selectTranslatedResources(store),
    managementCloudId: appState.ManagementCloudId,
    language: appState.Language,
    classifications: selectVisibleClassifications(store),
    filter: selectFilter(store),
    sort: selectSort(store),
    classificationsLanguage: selectClassificationsLanguage(store),
    EnableClassificationManagement: appState.Settings.EnableClassificationManagement,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchClassifications: () => dispatch(fetchClassificationsAction()),
  updateClassification: (classification: IClassification) =>
    dispatch(updateClassificationAction(classification)),
  setFilter: (filter: string) => dispatch(setFilterAction(filter)),
  setSort: (sort: ClassificationsSort) => dispatch(setSortAction(sort)),
  setLoader: (state) => dispatch(setLoaderAction(state)),
  setClassificationsLanguage: (language) => dispatch(setClassificationsLanguageAction(language)),
  resetState: () => dispatch(resetStateAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ClassificationsContainer));
