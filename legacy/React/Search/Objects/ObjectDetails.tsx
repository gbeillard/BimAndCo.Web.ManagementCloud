/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo } from 'react';

import { ObjectDetailsScreen, initialize as initializeAction } from '@bim-co/onfly-connect';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import {
  selectDataLanguage,
  selectDisplayName,
  selectDocumentTypes,
  selectLanguageCode,
  selectManagementCloudId,
  selectSoftwares,
  selectToken,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import { createSearchResources } from '../utils';
import { DocumentTypeDetails } from '../../../Reducers/BimObject/Documents/types';
import { SearchObjectGroup } from '../../../Reducers/BimObject/types';
import { LanguageCode } from '../../../Reducers/app/types';
import { API_URL } from '../../../Api/constants';
import { selectPluginData } from '../../../Reducers/plugin/selectors';
import Page from '../../CommonsElements/PageContentContainer';
import { fetchDocumentTypes } from '../../../Reducers/app/actions';

declare const window: any;

type Props = {
  documentTypes: DocumentTypeDetails[];
  softwares: any[];
  resources: any;
  group?: SearchObjectGroup;
  language: LanguageCode;
  token: string;
  onflyId: number;
  entityName: string;
  initialize: (config: any) => void;
  fetchTypes: () => void;
  dataLanguage: string;
};

const ObjectDetails = ({
  documentTypes,
  softwares,
  resources,
  token,
  group,
  onflyId,
  language,
  entityName,
  initialize,
  fetchTypes,
  dataLanguage,
}: Props) => {
  const { bimobjectId } = useParams();
  const isPlugin = window._isPlugin;
  const apiKey = localStorage.getItem('ApiKey');
  const mappedResources = useMemo(() => createSearchResources(resources, 'objects'), [resources]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!documentTypes || documentTypes.length === 0) {
      fetchTypes();
    }
  }, []);

  useEffect(() => {
    const config = {
      onflyId,
      apiKey,
      token,
      language,
      resources: mappedResources,
      apiUrl: API_URL,
      group,
      entityName,
      dataLanguage,
    };

    initialize(config);

    return () => {
      initialize({
        ...config,
        group: null,
      });
    };
  }, [
    apiKey,
    entityName,
    group,
    initialize,
    language,
    mappedResources,
    onflyId,
    token,
    dataLanguage,
  ]);

  const handleEdit = (object) => {
    navigate(`/${language}/bimobject/${object.Id}/edit`);
  };

  return (
    <Page>
      <ObjectDetailsScreen
        objectId={parseInt(bimobjectId)}
        softwares={softwares}
        documentTypes={documentTypes as any}
        onEdit={handleEdit}
        resources={resources}
        isPlugin={isPlugin}
      />
    </Page>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  language: selectLanguageCode,
  onflyId: selectManagementCloudId,
  entityName: selectDisplayName,
  softwares: selectSoftwares,
  documentTypes: selectDocumentTypes,
  resources: selectTranslatedResources,
  pluginData: selectPluginData,
  dataLanguage: selectDataLanguage,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
  fetchTypes: () => dispatch(fetchDocumentTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectDetails);
