import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import { RoutePaths } from '../../RoutePaths';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  resources: any;
};

const ManageContentsFiles: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/${RoutePaths.ManageContentsFiles}`}
    name={resources?.ContentManagement?.MenuItemManageContentsFiles}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ManageContentsFiles);