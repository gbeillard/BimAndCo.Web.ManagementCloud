import React from 'react';
import { PropertyV1 as OCDictionnariesProperties } from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { css, Global } from '@emotion/react';
import {
  selectFeatures,
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import { API_URL_DICTIONARIES, API_URL } from '../../../Api/constants';
import PageContentContainer from '../../CommonsElements/PageContentContainer';

export const Properties = () => {
  const onflyId = useSelector(selectManagementCloudId);
  const languageCode = useSelector(selectLanguageCode);
  const resources = useSelector(selectTranslatedResources);
  const token = useSelector(selectToken);
  const features = useSelector(selectFeatures);
  const splitPath = window.location.pathname.split('/');
  const propertyGuid = splitPath[splitPath.length - 1];

  return (
    <PageContentContainer withNewBackgroundColor>
      <Wrapper>
        <Global styles={globalStyles} />
        <OCDictionnariesProperties
          key={languageCode}
          onflyId={onflyId}
          propertyGuid={propertyGuid}
          languageCode={languageCode}
          dictionariesApiUrl={API_URL_DICTIONARIES}
          apiUrl={API_URL}
          resources={resources}
          token={token}
          featuresFlags={features}
        />
      </Wrapper>
    </PageContentContainer>
  );
};

const globalStyles = css`
  .rdg {
    .rdg-cell,
    .DataGrid__Cell,
    .DataGrid__Header,
    .ContentsTable__Cell {
      padding-left: 5px !important;
    }
  }
`;

const Wrapper = styled.div`
  margin-top: -12px !important;
  [data-test-id='Entity-Skeleton'] {
    background-color: transparent;
  }
`;
