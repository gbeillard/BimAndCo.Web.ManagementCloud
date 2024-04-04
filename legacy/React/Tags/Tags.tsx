import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { initialize as initializeAction, Tags as OCTags } from '@bim-co/onfly-connect';
import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import { sendAnalytics as sendAnalyticsAction } from '../../Reducers/analytics/actions';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectRole,
} from '../../Reducers/app/selectors';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import { API_URL } from '../../Api/constants';
import { LanguageCode } from 'Scripts/App/Reducers/BimObject/types';

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  resources: any;
  initialize: (config: any) => void;
};

const Tags: React.FC<Props> = ({ onflyId, token, language, resources, initialize }) => {
  const apiKey = localStorage.getItem('ApiKey');

  const appConfig = useMemo(() => ( {
    onflyId,
    apiKey,
    token,
    language,
    resources,
    apiUrl: API_URL,
  }), []);

  useEffect(() => {
    initialize(appConfig);
  }, [apiKey, initialize, language, resources, onflyId, token]);

  return <OCTags appConfig={appConfig} />;
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  resources: selectTranslatedResources,
  role: selectRole,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeAction(config)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Tags));
