import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  initialize as initializeOC,
  SummaryManagerObjects as SummaryManagerObjectsOC,
} from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { InitializeOptions } from '@bim-co/onfly-connect/Global';
import {
  selectHasBimandCoPublication,
  selectHasPrivateSite,
  selectLanguageCode,
  selectManagementCloudId,
  selectSummaryUploadDetailsList,
  selectToken,
  selectTranslatedResources,
} from '../../../../../Reducers/app/selectors';
import { SummaryUploadDetailsListSkeleton } from '../../utils/DataTableSkeleton';
import { OCMappedResources } from '../../../../ContentManager/mappedResources';
// eslint-disable-next-line import/no-named-default
import { default as OCResources } from '../../../../ContentManager/resources';
import { API_URL } from '../../../../../Api/constants';

type Props = {
  language: any;
  resources: any;
  SummaryUploadDetailsList: any;
  onflyId: number;
  token: string;
  enableWhiteLabelSite: boolean;
  enableBimandCoPublication: boolean;
  initialize: (config: any) => void;
};

const SummaryManagerObjects = ({
  language,
  resources,
  initialize,
  SummaryUploadDetailsList,
  token,
  onflyId,
  enableWhiteLabelSite,
  enableBimandCoPublication,
}: Props) => {
  const [objects, setObjects] = useState([]);
  const apiKey = localStorage.getItem('ApiKey');
  useEffect(() => {
    const config = {
      language,
      entityName: 'object',
      resources: OCMappedResources(resources, OCResources),
      apiUrl: API_URL,
      apiKey,
      token,
      onflyId,
    };

    initialize(config);
  }, [apiKey, initialize, language, onflyId, resources, token]);

  useEffect(() => {
    setObjects(SummaryUploadDetailsList);
  }, [SummaryUploadDetailsList]);

  if (!objects?.length) {
    return (
      <ContentWrapper>
        <SummaryUploadDetailsListSkeleton />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <SummaryManagerObjectsOC
        objects={objects}
        enableWhiteLabelSite={enableWhiteLabelSite}
        enableBimAndCoPublication={enableBimandCoPublication}
      />
    </ContentWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  language: selectLanguageCode,
  resources: selectTranslatedResources,
  token: selectToken,
  SummaryUploadDetailsList: selectSummaryUploadDetailsList,
  enableWhiteLabelSite: selectHasPrivateSite,
  enableBimandCoPublication: selectHasBimandCoPublication,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initializeOC(config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SummaryManagerObjects);

const ContentWrapper = styled.div`
  & > div:first-of-type {
    height: 100vh;
  }
`;
