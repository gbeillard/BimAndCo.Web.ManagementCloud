import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import {
  selectIsBoostOffer,
  selectAppConfig,
} from '../../../Reducers/app/selectors';
import { Authorizations, globalAuthorizations } from '../../Sidebar/authorizations';
import Page from '../../CommonsElements/PageContentContainer';
import { CollectionDetails as CollectionDetailsOC } from '@bim-co/onfly-connect';
import { AppConfig } from '@bim-co/onfly-connect/Global';
import { CollectionDetailsViewModelV10 } from '@bim-co/platformtypeandfixture';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import { GroupType } from '../../../Reducers/groups/constants';
import { SearchObjectGroup } from '../../../Reducers/BimObject/types';
import { Files, Objects } from '../../Search';
import Header from './Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Props = {
  isBoostOffer: boolean;
  appConfig: AppConfig,
};

const CollectionDetails: React.FC<Props> = ({
  isBoostOffer,
  appConfig,
}) => {
  const { language, user} = appConfig;
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const hasAccessToManageContents = (globalAuthorizations[user?.Role?.Key] as Authorizations)?.contents
    ?.enableManageContents;

  const handleOnClickEmptyCollection = () => {
    const url = `/${language}/${RoutePaths.ManageContents}`;
    navigate(url);
  };

  const handleOnClickEmptyFavoriteCollection = () => {
    const url = `/${language}/${isBoostOffer ? 'files' : 'bimobjects'}`;
    navigate(url);
  };

  const renderContent = (collection: CollectionDetailsViewModelV10) => {
    const props = {
      group: {
        id: collection?.Id,
        type: GroupType.Collection,
        isFavorite: collection?.IsFavorite,
      } as SearchObjectGroup,
    };
    
    if(isBoostOffer){
      return <Files {...props} />;
    }

    return <Objects {...props} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Page withNewBackgroundColor>
        <Header 
          appConfig={appConfig}
          hasAccessToManageContents={hasAccessToManageContents}
        />
        <CollectionDetailsOC 
          appConfig={appConfig}
          collectionId={parseInt(collectionId)}
          onClickNoCollection={() => navigate(`/${language}/collections`)}
          onClickEmptyCollection={hasAccessToManageContents && handleOnClickEmptyCollection}
          onClickEmptyFavoriteCollection={handleOnClickEmptyFavoriteCollection}
          renderContent={renderContent}
        />
      </Page>
    </QueryClientProvider>
  );
};

const mapSelectToProps = createStructuredSelector({
  isBoostOffer: selectIsBoostOffer,
  appConfig: selectAppConfig,
});

export default connect(mapSelectToProps)(CollectionDetails);
