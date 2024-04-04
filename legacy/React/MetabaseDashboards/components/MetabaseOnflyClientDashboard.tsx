import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, H1, H2, P, Loader } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { GetMetabaseDashboardData, GetMetabaseDashboardDataExport } from '../utils/api';
import {
  selectTranslatedResources,
  selectSettings,
  selectManagementCloudId,
  selectLanguageCode,
} from '../../../Reducers/app/selectors';

import Page from '../../CommonsElements/PageContentContainer';
import { GetUrlFromMetabaseData } from '../utils/utils';
import { Body, Header, Iframe, LoaderContainer } from '../utils/styles';

type Props = {
  Settings: any;
  Language: string;
  OnflyId: number;
  resources: any;
};

const MetabaseOnflyClientDashboard: React.FC<Props> = ({
  Settings,
  Language,
  OnflyId,
  resources,
}) => {
  const [IframeUrl, setIframeUrl] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      const MetabaseData = await GetMetabaseDashboardData(OnflyId, Language);
      const IframeUrlResponse = await GetUrlFromMetabaseData(OnflyId, MetabaseData);
      setIframeUrl(IframeUrlResponse);
    };
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataExport = () => {
    GetMetabaseDashboardDataExport(OnflyId, Language, resources);
  };

  const onLoadIframe = () => {
    setIsLoading(false);
  };

  if (!Settings.EnableMetabaseDashboards) {
    return (
      <Page>
        <H1>BIM&CO - ONFLY</H1>
        <P>Error 403 Access Denied</P>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <H2>{resources.Metabase.DashboardTitle}</H2>
        <Button icon="download" variant="secondary" onClick={handleDataExport}>
          {resources.Metabase.DataExport}
        </Button>
      </Header>
      <Body>
        {isLoading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
        <Iframe
          id="iframe-metabase"
          src={IframeUrl}
          className="metabase-dashboard"
          frameBorder="0"
          width="100%"
          allowFullScreen
          isLoading={isLoading}
          onLoad={onLoadIframe}
        />
      </Body>
    </Page>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  OnflyId: selectManagementCloudId,
  Language: selectLanguageCode,
  Settings: selectSettings,
});

export default connect(mapStateToProps)(MetabaseOnflyClientDashboard);
