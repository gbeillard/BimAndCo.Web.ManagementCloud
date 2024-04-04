import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { initialize as initializeAction, Inspector as InspectorFile } from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { Modal } from '@bim-co/componentui-foundation';
import moment from 'moment';
import { createSearchResources } from '../../../../Search/utils';
import { fileList } from '../api';
import { API_URL } from '../../../../../Api/constants';
import { LanguageCode } from '../../../../../Reducers/app/types';

type Props = {
  Language: LanguageCode;
  Resources: any;
  OnflyId: number;
  TemporaryToken: string;
  initialize: (config: {}) => void;
  dataLanguage: string;
};

const FileDetail = ({
  Language,
  Resources,
  OnflyId,
  TemporaryToken,
  initialize,
  dataLanguage,
}: Props) => {
  const { fileId } = useParams();
  const { mediaType } = useParams();
  const [file, setFile] = useState(null);
  const mappedResources = useMemo(() => createSearchResources(Resources, 'files'), [Resources]);
  const [isPreviewPopin, setIsPreviewPopin] = useState(false);
  const [isPreviewPopinPhoto, setIsPreviewPopinPhoto] = useState(false);
  const apiKey = localStorage.getItem('ApiKey');
  const fileRequest = [{ Id: fileId, MediaType: mediaType }];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fileList(Language, OnflyId, fileRequest).then((response) => {
      setFile(response[0]);
      setIsLoading(false);
    });
  }, [fileId, Language, OnflyId]);

  useEffect(() => {
    const config = {
      apiUrl: API_URL,
      onflyId: OnflyId,
      apiKey,
      token: TemporaryToken,
      language: Language,
      entityName: 'files',
      resources: mappedResources,
      dataLanguage,
    };

    initialize(config);
  }, [Language, Resources, dataLanguage]);

  useEffect(() => {
    const formatDate = (dateToFormat: string) => moment(dateToFormat).format('YYYYMMDDhhmmss');

    if (file) {
      if (file.Url === null) {
        setFile({ ...file, Url: '' });
      }

      // @TODO: remove this when the API will be fixed
      if (
        formatDate(file.CreatedAt) !== 'Invalid date' ||
        formatDate(file.UpdatedAt) !== 'Invalid date'
      ) {
        setFile({
          ...file,
          CreatedAt: formatDate(file.CreatedAt),
          UpdatedAt: formatDate(file.UpdatedAt),
        });
      }
      // till here
    }
  }, [file]);

  const handleClosePreview = () => {
    setIsPreviewPopin(false);
    setIsPreviewPopinPhoto(false);
  };

  const getIFrameTemplateSrc = (src: string, width: number, height: number): string => {
    if (!src) {
      return '';
    }
    const [url, params] = src.split('?');
    if (!params) {
      return `${url}?width=${width}&height=${height}`;
    }
    return `${url}?${params}&width=${width}&height=${height}`;
  };

  const IFramePreviewModel = ({ item, width, height }: any) => {
    const returnUrl = getIFrameTemplateSrc(item.src, width, height);
    const encodedReturnUrl = encodeURIComponent(returnUrl);

    const src = `${API_URL}/${Language}/onflyconnect?token=${TemporaryToken}&returnUrl=${encodedReturnUrl}&width=${width}&height=${height}`;

    return <StyledIFrame title="iframe" src={src} width="100%" height="100%" />;
  };

  return (
    <ContentWrapper>
      <InspectorFile
        document={file}
        onPreviewThumbnail={() => setIsPreviewPopinPhoto(true)}
        onClickPreviewModel={() => setIsPreviewPopin(true)}
        isLoading={isLoading}
      />
      <StyledModal active={isPreviewPopin} close={handleClosePreview}>
        <IFramePreviewModel item={file} width={1000} height={1000} />
      </StyledModal>
      <StyledModal active={isPreviewPopinPhoto} close={handleClosePreview}>
        <img src={file?.BimObject?.Photo} alt={file?.Name} />
      </StyledModal>
    </ContentWrapper>
  );
};

const StyledModal = styled(Modal)`
  width: 100% !important;
  padding: 0;
`;

const StyledIFrame = styled.iframe`
  width: 100%;
  min-height: 50vh !important;
  border: none;
`;

const ContentWrapper = styled.div`
  & > div:first-of-type {
    height: 100vh;
  }
`;

const mapDispatchToProps = (dispatch) => ({
  initialize: (config) => dispatch(initializeAction(config)),
});

const mapStateToProps = ({ appState }) => ({
  Language: appState.Language,
  Resources: appState.Resources[appState.Language],
  OnflyId: appState.ManagementCloudId,
  TemporaryToken: appState.TemporaryToken,
  dataLanguage: appState.DataLanguage,
});

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail);
