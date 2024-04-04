import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Button } from '@bim-co/componentui-foundation';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import { setPageTitle as setPageTitleAction } from '../../../Reducers/app/actions';
import { CollectionDetailsViewModelV10 } from '@bim-co/platformtypeandfixture';
import { AppConfig } from '@bim-co/onfly-connect/Global';
import { useQuery } from '@tanstack/react-query'
import { getCollection } from './api';

type Props = {  
  appConfig: AppConfig,
  hasAccessToManageContents: boolean;
  setPageTitle: (title: string) => void;
};

const Header: React.FC<Props> = ({ 
  appConfig,
  hasAccessToManageContents,
  setPageTitle,
}) => {
  const { onflyId, resources, language } = appConfig;
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();

  const {
    data: collection,
    isSuccess,
    isError,
  } = useQuery<CollectionDetailsViewModelV10>(['collection', language, onflyId, collectionId], () =>
    getCollection(language, onflyId, parseInt(collectionId))
  );

  useEffect(() => {
    // Page title
    let pageTitle = resources.ContentManagementCollections.DetailsPageTitle;

    if (isSuccess && pageTitle && collection) {
      pageTitle = pageTitle.replace('[CollectionName]', collection.Name);

      setPageTitle(pageTitle as string);
    } else if (isError) {
      // Error when collection is loading
      setPageTitle(
        resources.ContentManagementCollectionsEmptyState.CollectionDoesNotExistTitle as string
      );
    }
  }, [language, isSuccess, isError]);

  return (
    <Container>
      {/* Left */}
      <FlexContainer>
        <Button icon="arrow-left" onClick={() => navigate(`/${language}/collections`)}>
          {resources.MetaResource.Back}
        </Button>
      </FlexContainer>

      {/* Right */}
      <FlexContainer>
        {hasAccessToManageContents && (
          <Button
            variant="primary"
            icon="object"
            onClick={() => navigate(`/${language}/${RoutePaths.ManageContents}`)}
          >
            {resources.ContentManagement.MenuItemManageContents}
          </Button>
        )}
      </FlexContainer>
    </Container>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-top: 20px;
`;

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (title: string) => dispatch(setPageTitleAction(title)),
});

export default connect(null, mapDispatchToProps)(Header);
