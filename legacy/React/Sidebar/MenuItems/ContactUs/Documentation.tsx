import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { sendAnalytics as sendAnalyticsAction } from '../../../../Reducers/analytics/actions';
import { AnalyticsEvent } from '../../../../Reducers/analytics/types';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';
import { EN_ONLINE_HELP_URL, FR_ONLINE_HELP_URL } from '../../../../Api/constants';

type Props = {
  languageCode: string;
  resources: any;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const Documentation: React.FC<Props> = ({ languageCode, resources, sendAnalytics }) => (
  <MenuItem
    link={languageCode === 'fr' ? `${FR_ONLINE_HELP_URL}` : `${EN_ONLINE_HELP_URL}`}
    name={resources.ContentManagement.MenuItemOnlineHelp}
    isExternalLink
    handleClick={() => sendAnalytics(AnalyticsEvent.UserClickedDocumentationMenu)}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Documentation);
