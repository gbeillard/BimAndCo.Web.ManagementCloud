import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SearchIcon from '@material-ui/icons/Search';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  groupId: number;
  languageCode: string;
  resources: any;
};

const Objects: React.FC<Props> = ({ groupId, languageCode, resources }) => (
  <MenuItem
    link={
      groupId == 0 ? `/${languageCode}/bimobjects` : `/${languageCode}/group/${groupId}/bimobjects`
    }
    name={resources.ContentManagement.MenuItemObjects}
    icon={groupId !== 0 ? <SearchIcon /> : null}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Objects);