import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAppConfig } from '../../Reducers/app/selectors';
import Page from '../CommonsElements/PageContentContainer';
import { Collections as CollectionsOC } from '@bim-co/onfly-connect';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoutePaths } from '../Sidebar/RoutePaths';
import { CollectionDetailsViewModelV10 } from '@bim-co/platformtypeandfixture';
import { AppConfig } from '@bim-co/onfly-connect/Global';

type Props = {
  appConfig: AppConfig,
};

const Collections: React.FC<Props> = ({
  appConfig,
}) => {
  const { language, resources } = appConfig;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleOnClickListRow = (collection: CollectionDetailsViewModelV10) => {
    navigate(`${pathname}/${collection?.Id}`);
  };

  const handleOnCreated = () => {
    navigate(`/${language}/${RoutePaths.ManageContents}`, { state: { 
      message: resources.ContentManagementCollections.CreateCollectionSuccess, 
    }});
  };

  return (
    <Page>
      <CollectionsOC
        appConfig={appConfig}
        onClickRow={handleOnClickListRow}
        onCreated={handleOnCreated}
      />
    </Page>
  );
};

const mapSelectToProps = createStructuredSelector({
  appConfig: selectAppConfig,
});

export default connect(mapSelectToProps)(Collections);
