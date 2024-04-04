import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CountryCultureScreen } from '@bim-co/onfly-connect/Preferences';
import styled from '@emotion/styled';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
} from '../../../../Reducers/app/selectors';
import { selectPreferences } from '../../../../Reducers/preferences/selectors';
import { API_URL } from '../../../../Api/constants';
import { createCountriesResources } from './utils';
import { LanguageCode } from 'Scripts/App/Reducers/BimObject/types';

type Props = {
  resources: any;
  token: string;
  onflyId: number;
  languageCode: LanguageCode;
};

const Sections: React.FC<Props> = ({ resources, onflyId, token, languageCode }) => {
  const i18nResources = useMemo(() => createCountriesResources(resources), [resources]);

  return (
    <Container>
      <CountryCultureScreen 
        appConfig={{
          apiUrl: API_URL,
          resources: i18nResources,
          token,
          language: languageCode,
          onflyId,
        }}
      />
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  preferences: selectPreferences,
  resources: selectTranslatedResources,
  onflyId: selectManagementCloudId,
  token: selectToken,
  languageCode: selectLanguageCode,
});

const Container = styled.div`
  height: calc(100vh - 205px);
  width: 100%;
  position: relative;
`;

export default connect(mapStateToProps)(Sections);
