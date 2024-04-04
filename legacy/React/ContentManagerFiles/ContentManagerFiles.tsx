import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import toastr from 'toastr';

import {
  ContentsFiles as OCContentFiles,
  initialize as initializeAction,
} from '@bim-co/onfly-connect';

import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import { useLocation } from 'react-router-dom';
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
  selectDataLanguage,
} from '../../Reducers/app/selectors';
import { selectPluginData } from '../../Reducers/plugin/selectors';

import { LanguageCode } from '../../Reducers/app/types';
import { RoleKey } from '../../Reducers/Roles/types';
import OCResources from './resources';
import { API_URL } from '../../Api/constants';
import { history } from '../../history';
import { getDefaultLibraries, getLibrariesSettings } from '../../Utils/librariesUtils';
import { OCMappedResources } from './mappedResources';

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
  dataLanguage: string;
};

const ContentManagerFiles: React.FC<Props> = ({
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
  dataLanguage,
}) => {
  const { pathname, state } = useLocation();
  const apiKey = localStorage.getItem('ApiKey');

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

  useEffect(() => {
    const config = {
      onflyId,
      apiKey,
      token,
      language,
      entityName,
      resources: mappedResources,
      apiUrl: API_URL,
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

  return (
    <ContentWrapper>
      <OCContentFiles
        enableWhiteLabelSite={enableWhiteLabelSite}
        isReadOnlyStatuses={role?.key === RoleKey.object_creator}
        enableBimAndCoPublication={enableBimandCoPublication}
        defaultLibraries={getDefaultLibraries(enableWhiteLabelSite, role.key)}
        librariesSettings={getLibrariesSettings(role.key)}
        enableDefaultMapping={!isBoostOffer}
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
  dataLanguage: selectDataLanguage,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
});

const ContentWrapper = styled.div`
  margin: -11px -15px 0 -15px;
  .rdg {
    height: calc(100vh - 255px);
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ContentManagerFiles));
