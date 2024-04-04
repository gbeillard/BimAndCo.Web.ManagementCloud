import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { H2, Loader } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import { GetUrlByDashboardIdAndOnflyId } from '../utils/utils';
import {
  selectManagementCloudId,
  selectRole,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';

import Page from '../../CommonsElements/PageContentContainer';
import { RoleKey } from '../../../Reducers/Roles/types';
import { Body, Header, Iframe, LoaderContainer } from '../utils/styles';
import { METABASE_ASYNC_LOGS_DASHBOARD_ID } from '../../../Api/constants';

type Props = {
  OnflyId: number;
  role: {
    id: string;
    key: string;
    label: string;
  };
  resources: any;
};

const MetabaseAsyncLogsDashboard: React.FC<Props> = ({ OnflyId, role, resources }) => {
  const navigate = useNavigate();
  const [DashboardUrl, setDashboardUrl] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      const DashboardUrlResponse = await GetUrlByDashboardIdAndOnflyId(
        METABASE_ASYNC_LOGS_DASHBOARD_ID,
        OnflyId
      );
      setDashboardUrl(DashboardUrlResponse);
    };
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadIframe = () => {
    setIsLoading(false);
  };

  if (role.key !== RoleKey.admin) {
    navigate('/404');
  }

  return (
    <Page>
      <Header>
        <H2>{resources.AsyncLogs.DashboardTitle}</H2>
      </Header>
      <Body>
        {isLoading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
        <Iframe
          id="iframe-async-logs"
          src={DashboardUrl}
          className="async-logs-dashboard"
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
  OnflyId: selectManagementCloudId,
  role: selectRole,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(MetabaseAsyncLogsDashboard);
