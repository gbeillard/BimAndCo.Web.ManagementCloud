import React from 'react';
import { DictionnariesValues as OCDictionnariesValues } from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectFeatures,
  selectLanguageCode,
  selectManagementCloudId,
  selectRole,
  selectToken,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import { API_URL_DICTIONARIES, API_URL } from '../../../Api/constants';

export const DictionnariesValues: React.FC = () => {
  const onflyId = useSelector(selectManagementCloudId);
  const languageCode = useSelector(selectLanguageCode);
  const resources = useSelector(selectTranslatedResources);
  const token = useSelector(selectToken);
  const features = useSelector(selectFeatures);
  const navigate = useNavigate();
  const role = useSelector(selectRole);

  if (!features.includes('DictionaryValues') || role.key !== 'admin') {
    navigate('/404');
  }

  return (
    <Wrapper>
      <OCDictionnariesValues
        token={token}
        key={languageCode}
        onflyId={onflyId}
        languageCode={languageCode}
        apiUrlDictionaries={API_URL_DICTIONARIES}
        apiUrl={API_URL}
        resources={resources}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  [data-test-id='Entity-Skeleton'] {
    background-color: transparent;
  }
  .rdg {
    height: calc(100vh - 175px);
  }
  .rdg-cell {
    padding: 0 10px;
  }
`;
