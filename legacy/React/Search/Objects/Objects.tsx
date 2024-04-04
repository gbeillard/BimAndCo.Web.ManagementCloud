/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import {
  Objects as OCSearch,
  initialize as initializeAction,
  FilesDownloaderModal,
  useDocumentTypes,
} from '@bim-co/onfly-connect';
import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import { useNavigate } from 'react-router-dom';
import { DocumentTypeDetails } from '../../../Reducers/BimObject/Documents/types';
import { sendAnalytics as sendAnalyticsAction } from '../../../Reducers/analytics/actions';

import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectSoftwares,
  selectRole,
  selectDisplayName,
  selectDocumentTypes,
  selectEnableIfcSDL,
  selectSettings,
  selectHasPrivateSite,
  selectDataLanguage,
} from '../../../Reducers/app/selectors';

import { LanguageCode } from '../../../Reducers/app/types';
import { AnalyticsEvent } from '../../../Reducers/analytics/types';
import { SearchObjectGroup, SearchResponseDocument } from '../../../Reducers/BimObject/types';

import { API_URL } from '../../../Api/constants';
import { GroupType } from '../../../Reducers/groups/constants';

import { isFavorite } from '../../../Reducers/BimObject/utils';
import { createSearchResources } from '../utils';

import * as PluginUtils from '../../../Utils/pluginUtils';
import * as ContentUtils from '../../../Utils/contentUtils';

import { getDefaultLibraries, getLibrariesSettings } from '../../../Utils/librariesUtils';
import { RoleKey } from '../../../Reducers/Roles/types';
import { selectPluginData } from '../../../Reducers/plugin/selectors';
import { selectPreferences } from '../../../Reducers/preferences/selectors';
import { PluginData } from '../../../Reducers/plugin/types';
import {ManagementCloudViewModelV10} from "@bim-co/platformtypeandfixture";

declare const window: any;

type ModeProps = {
  isCollectionMode: boolean;
};

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  resources: any;
  enableIfcSDL: boolean;
  softwares: any;
  group?: SearchObjectGroup;
  entityName: string;
  initialize: (config: any) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
  documentTypes: DocumentTypeDetails[];
  settings: {
    EnableSetsManagement: boolean;
  };
  role?: { key: RoleKey };
  pluginData: PluginData;
  preferences: ManagementCloudViewModelV10;
  enableWhiteSiteLabel: boolean;
  dataLanguage: string;
};

const Objects = ({
  onflyId,
  token,
  language,
  resources,
  softwares,
  group,
  entityName,
  initialize,
  sendAnalytics,
  documentTypes: passedDocumentTypes,
  enableIfcSDL,
  settings,
  role,
  pluginData,
  preferences,
  enableWhiteSiteLabel,
  dataLanguage,
}: Props) => {
  const navigate = useNavigate();
  const [objectToDownload, setObjectToDownload] = useState(null);
  const apiKey = localStorage.getItem('ApiKey');
  const isPlugin = window._isPlugin;
  const mappedResources = useMemo(() => createSearchResources(resources, 'objects'), [resources]);
  const { data: fetchedDocumentTypes } = useDocumentTypes();
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setReload(reload + 1);
  }, [pluginData]);

  const documentTypeValues = useMemo(() => {
    if (passedDocumentTypes?.length === 0) {
      return fetchedDocumentTypes;
    }
    return passedDocumentTypes;
  }, [passedDocumentTypes, fetchedDocumentTypes]);

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

  const isCollectionMode = group?.type === GroupType.Collection;

  const handleClickFavorite = (document: SearchResponseDocument) => {
    const isBimObjectFavorite = isFavorite(document);

    if (!isBimObjectFavorite) {
      sendAnalytics(AnalyticsEvent.UserAddedObjectToCollection);
    }
  };

  const handleDownload = (content: any) => {
    let contentPromise;
    if (isPlugin) {
      contentPromise = PluginUtils.downloadPluginContent(
        content,
        onflyId,
        enableIfcSDL,
        resources,
        language
      );
    } else {
      contentPromise = ContentUtils.downloadContent(content, onflyId, resources);
    }
    contentPromise.then(() => {
      sendAnalytics(AnalyticsEvent.UserClickedContentDownloadContent);
    });
  };

  const handleClose = () => setObjectToDownload(null);

  const handleEdit = (object) => {
    if (isPlugin) {
      navigate(`/${language}/bimobject/${object.Id}/edit`);
    } else if (!isPlugin) {
      window.open(`/${language}/bimobject/${object.Id}/edit`);
    }
  };

  const handlePluginBundleDownload = (bundle: string) => {
    PluginUtils.downloadPluginBundle(bundle, resources);
  };

  const appConfig = useMemo(() => ({
    apiUrl: API_URL,
    token,
    onflyId,
    resources: mappedResources,
    language,
  }), []);

  return (
    <SearchWrapper isCollectionMode={isCollectionMode}>
      <OCSearch
        key={reload}
        onClickFavorite={handleClickFavorite}
        onDownload={setObjectToDownload}
        onFileDownload={handleDownload}
        onBundleDownload={handlePluginBundleDownload}
        onEdit={handleEdit}
        librariesSettings={getLibrariesSettings(role.key)}
        defaultLibraries={getDefaultLibraries(enableWhiteSiteLabel, role.key)}
        mode={isPlugin ? 'smartDownload' : 'default'}
        bundleParameters={{
          MappingConfigurationId: pluginData.configurationID,
          MappingConfigurationLanguage:
            pluginData?.configurationLanguage || pluginData.mappingDictionaryLanguage,
          CaoName: pluginData.software,
        }}
        softwares={softwares}
        documentTypes={documentTypeValues}
        setsDisabled={!settings.EnableSetsManagement}
        isPlugin={isPlugin}
        caoName={pluginData.software}
        caoVersion={pluginData.softwareVersion}
        hideEmptyProperty={preferences.EmptyPropertiesPreference}
        appConfig={appConfig}
      />
      {objectToDownload && (
        <FilesDownloaderModal
          key={reload}
          object={objectToDownload}
          softwares={softwares}
          documentTypes={documentTypeValues}
          active={Boolean(objectToDownload)}
          onClose={handleClose}
          onDownload={handleDownload}
          caoName={pluginData.software}
          caoVersion={pluginData.softwareVersion}
          isPlugin={isPlugin}
        />
      )}
    </SearchWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  settings: selectSettings,
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  enableIfcSDL: selectEnableIfcSDL,
  resources: selectTranslatedResources,
  softwares: selectSoftwares,
  role: selectRole,
  entityName: selectDisplayName,
  documentTypes: selectDocumentTypes,
  pluginData: selectPluginData,
  preferences: selectPreferences,
  enableWhiteSiteLabel: selectHasPrivateSite,
  dataLanguage: selectDataLanguage,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

// Mix old styles with new layout
const SearchWrapper = styled.div<ModeProps>(
  ({ isCollectionMode }) => `
    margin: 0 ${isCollectionMode ? '-8' : '-15'}px;
    ${!isCollectionMode ? 'margin-top: -11px;' : ''}

    & > div:first-of-type {
        height: calc(100vh - ${isCollectionMode ? '167' : '59'}px);
    }
`
);

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Objects);
