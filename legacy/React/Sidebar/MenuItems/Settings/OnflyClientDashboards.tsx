import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  resources: any;
};

const OnflyClientDashboards: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem link={`/${languageCode}/metabase/onfly-client-dashboard`} name={resources.Metabase.Menu} />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(OnflyClientDashboards);