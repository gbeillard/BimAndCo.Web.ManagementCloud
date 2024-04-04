import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { ManageUsers } from '@bim-co/onfly-connect';
import { withRouter } from '../../Utils/withRouter';
import { API_URL } from '../../Api/constants';
import Page from '../CommonsElements/PageContentContainer';
import { createUserManagerResources } from './utils';

const ManageUsersScreen = ({ Language, TemporaryToken, managementCloudId, resources, UserId }) => {
  const nextResources = useMemo(() => createUserManagerResources(resources), [resources]);

  const appConfig = {
    apiUrl: API_URL,
    token: TemporaryToken,
    onflyId: managementCloudId,
    resources: nextResources,
    language: Language,
  };
  return <Page><ManageUsers appConfig={appConfig} currentUserId={UserId} /></Page>;
};

const mapStateToProps = (store: any) => {
  const { appState } = store;

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    UserId: appState.UserId,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

export default withRouter(connect(mapStateToProps)(ManageUsersScreen));
