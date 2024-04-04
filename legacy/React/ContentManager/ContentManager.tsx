/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import toastr from 'toastr';

import { Contents as OCContent, initialize as initializeAction } from '@bim-co/onfly-connect';

import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import { useLocation } from 'react-router-dom';
import { DocumentTypeDetails } from '../../Reducers/BimObject/Documents/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';
import * as PluginUtils from '../../Utils/pluginUtils';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectUrl,
  selectEnableFileSearch,
  selectSoftwares,
  selectHasPrivateSite,
  selectRole,
  selectHasBimandCoPublication,
  selectIsBoostOffer,
  selectDisplayName,
  selectSettings,
  selectDataLanguage,
  selectFeatures,
  selectDocumentTypes,
  selectEnableIfcSDL,
} from '../../Reducers/app/selectors';
import { selectPluginData } from '../../Reducers/plugin/selectors';
import { RoleKey } from '../../Reducers/Roles/types';
import OCResources from './resources';
import { API_URL, BIMOBJECT_API_URL } from '../../Api/constants';
import { history } from '../../history';
import { getDefaultLibraries, getLibrariesSettings } from '../../Utils/librariesUtils';
import { OCMappedResources } from './mappedResources';
import { sendAnalytics as sendAnalyticsAction } from '../../Reducers/analytics/actions';
import * as ContentUtils from '../../Utils/contentUtils';
import {selectPreferences} from "../../Reducers/preferences/selectors";
import {ManagementCloudViewModelV10} from "@bim-co/platformtypeandfixture";
import { LanguageCode } from 'Scripts/App/Reducers/BimObject/types';

declare const window: any;

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  entityName: string;
  resources: any;
  Url: string;
  enableWhiteLabelSite: boolean;
  enableBimandCoPublication: boolean;
  initialize: (config: any) => void;
  role?: { key: RoleKey };
  isBoostOffer: boolean;
  settings: any;
  preferences: ManagementCloudViewModelV10;
  dataLanguage: string;
  featuresFlags: string[];
  enableIfcSDL: boolean;
  softwares: any;
  documentTypes: DocumentTypeDetails[];
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const ContentManager: React.FC<Props> = ({
  onflyId,
  token,
  language,
  entityName,
  resources,
  isBoostOffer,
  enableWhiteLabelSite,
  enableBimandCoPublication,
  Url,
  initialize,
  role,
  settings,
  preferences,
  dataLanguage,
  featuresFlags,
  enableIfcSDL,
  softwares,
  documentTypes,
  sendAnalytics,
}) => {
  const { pathname, state } = useLocation();
  const apiKey = localStorage.getItem('ApiKey');
  const isPlugin = window._isPlugin;

  useEffect(() => {
    const message = (state as any)?.message;
    if (message) {
      toastr.success(message);
      history.replace(pathname, null); // Clear location state | test this shit
    }
  }, []);

  const mappedResources = useMemo(
    () => OCMappedResources(resources, OCResources),
    [resources, OCResources]
  );

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
      contentPromise = ContentUtils.downloadContent(
        { Id: content.id, ...content },
        onflyId,
        resources
      );
    }
    contentPromise.then(() => {
      sendAnalytics(AnalyticsEvent.UserClickedContentDownloadContent);
    });
  };

  useEffect(() => {
    const config = {
      onflyId,
      apiKey,
      token,
      language,
      entityName,
      resources: mappedResources,
      apiUrl: API_URL,
      bimobjectApiUrl:BIMOBJECT_API_URL, 
      dataLanguage,
    };
    initialize(config);
  }, [
    onflyId,
    entityName,
    apiKey,
    token,
    resources,
    language,
    Url,
    mappedResources,
    initialize,
    dataLanguage,
  ]);

  const appConfig = useMemo(() => ({
    apiUrl: API_URL,
    bimobjectApiUrl: BIMOBJECT_API_URL,
    onflyId,
    entityName,
    apiKey,
    token,
    language,
    Url,
    resources: mappedResources,
    dataLanguage,
  }), []);

  return (
    <ContentWrapper>
      <OCContent
        appConfig={appConfig}
        createObjectUrl={!isBoostOffer ? `/${language}/bimobject/create` : null}
        editObjectUrl={`/${language}/bimobject/[objectId]/edit/informations`}
        enableWhiteLabelSite={enableWhiteLabelSite}
        enableSynchronize={settings.EnableSynchroRevit}
        isReadOnlyStatuses={role?.key === RoleKey.object_creator}
        enableBimAndCoPublication={enableBimandCoPublication}
        defaultLibraries={getDefaultLibraries(enableWhiteLabelSite, role.key)}
        librariesSettings={getLibrariesSettings(role.key)}
        enableDefaultMapping={!isBoostOffer} // if offer boost then dont show default mapping option
        featuresFlags={featuresFlags}
        onFileDownload={handleDownload}
        isPlugin={isPlugin}
        softwares={softwares}
        hideEmptyProperty={preferences.EmptyPropertiesPreference}
        documentTypes={documentTypes}
      />
    </ContentWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  entityName: selectDisplayName,
  resources: selectTranslatedResources,
  Url: selectUrl,
  enableWhiteLabelSite: selectHasPrivateSite,
  enableBimandCoPublication: selectHasBimandCoPublication,
  enableFileSearch: selectEnableFileSearch,
  pluginData: selectPluginData,
  softwares: selectSoftwares,
  role: selectRole,
  isBoostOffer: selectIsBoostOffer,
  settings: selectSettings,
  preferences: selectPreferences,
  dataLanguage: selectDataLanguage,
  featuresFlags: selectFeatures,
  documentTypes: selectDocumentTypes,
  enableIfcSDL: selectEnableIfcSDL,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

const ContentWrapper = styled.div`
  margin: -11px -15px 0 -15px;
  .rdg {
    height: calc(100vh - 257px);
    .rdg-cell {
      padding: 0 10px;
    }
    .ContentsTable__Cell__Vignette {
      padding-left: 15px;
    }
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ContentManager));
