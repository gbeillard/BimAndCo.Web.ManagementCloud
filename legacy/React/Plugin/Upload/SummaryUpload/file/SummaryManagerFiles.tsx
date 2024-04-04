import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { initialize as initializeAction } from '@bim-co/onfly-connect';
import { SummaryManagerFiles } from '@bim-co/onfly-connect/SummaryManager';
import { createSearchResources } from '../../../../Search/utils';
import { API_URL } from '../../../../../Api/constants';
import { LanguageCode } from '../../../../../Reducers/app/types';
import { SummaryUploadDetailsListSkeleton } from '../../utils/DataTableSkeleton';

type Props = {
  Language: LanguageCode;
  Resources: any;
  OnflyId: number;
  TemporaryToken: string;
  initialize: (config: {}) => void;
  SummaryUploadDetailsListFiles: { Id: number; MediaType: string }[];
};

const FilesList = ({
  Language,
  Resources,
  OnflyId,
  TemporaryToken,
  initialize,
  SummaryUploadDetailsListFiles,
}: Props) => {
  const mappedResources = useMemo(() => createSearchResources(Resources, 'files'), [Resources]);
  const apiKey = localStorage.getItem('ApiKey');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const config = {
      apiUrl: API_URL,
      onflyId: OnflyId,
      apiKey,
      token: TemporaryToken,
      language: Language,
      entityName: 'files',
      resources: mappedResources,
    };

    initialize(config);
  }, [Language, Resources]);

  useEffect(() => {
    setFiles(SummaryUploadDetailsListFiles);
  }, [SummaryUploadDetailsListFiles]);

  if (!files.length) {
    return <SummaryUploadDetailsListSkeleton />;
  }

  return <SummaryManagerFiles files={files} />;
};

const mapDispatchToProps = (dispatch) => ({
  initialize: (config) => dispatch(initializeAction(config)),
});

const mapStateToProps = ({ appState }) => ({
  Language: appState.Language,
  Resources: appState.Resources[appState.Language],
  OnflyId: appState.ManagementCloudId,
  TemporaryToken: appState.TemporaryToken,
  SummaryUploadDetailsListFiles: appState.SummaryUploadDetailsListFiles,
});

export default connect(mapStateToProps, mapDispatchToProps)(FilesList);
