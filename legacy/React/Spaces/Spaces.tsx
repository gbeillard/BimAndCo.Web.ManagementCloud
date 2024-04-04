import React, {  useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ONFLY_DOMAIN } from '../../Api/constants';

import { SpaceScreen } from '@bim-co/onfly-connect';
import { sendAnalytics as sendAnalyticsAction } from '../../Reducers/analytics/actions';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectRole,
  selectSubDomain,
  selectUser,
  selectSettings,
} from '../../Reducers/app/selectors';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import { API_URL } from '../../Api/constants';
import { LanguageCode } from '../../Reducers/BimObject/types';
import { ContentmanagementInformationsSettingsV1, UserInfoViewModelV10 } from '@bim-co/platformtypeandfixture';
import { User } from '../../Reducers/app/types';
import { RoleKey } from '../../Reducers/Roles/types';
import { retrieveUrlSpaceOnfly } from '../../Reducers/Spaces/utils';
import { Space } from 'Scripts/App/Reducers/Spaces/types';

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  resources: any;
  user: User;
  settings: ContentmanagementInformationsSettingsV1;
  subDomain: string;
  role: { key: RoleKey };
};

const Spaces = ({ onflyId, token, language, resources, user, settings, subDomain, role }: Props) => {
  const apiKey = localStorage.getItem('ApiKey');

  const appConfig = useMemo(() => ( {
    onflyId,
    apiKey,
    token,
    language,
    resources,
    apiUrl: API_URL,
  }), []);

  const userInfo: UserInfoViewModelV10 = useMemo(() => ({
    OnFlyId: user.id,
    Email: user.email,
    FirstName: user.firstName,
    LastName: user.lastName,
    City: user.city,
    Job: user.job,
    Role: { Key: role.key }
  }), []);

 const handleSpaceClick = (space: Space) => {
    window.open(retrieveUrlSpaceOnfly(space.SubDomain));
 }
  return <SpaceScreen appConfig={appConfig} domain={ONFLY_DOMAIN} subDomain={subDomain} user={userInfo} settings={settings} onClickSpace={handleSpaceClick} />;
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  resources: selectTranslatedResources,
  role: selectRole,
  subDomain: selectSubDomain,
  user: selectUser,
  settings: selectSettings,
});

const mapDispatchToProps = (dispatch) => ({
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Spaces));
