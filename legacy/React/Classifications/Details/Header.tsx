import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { H2, Icon, space } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import { IClassification } from '../../../Reducers/classifications/types';
import { LanguageCode } from '../../../Reducers/app/types';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import {
  fetchNodes as fetchNodesAction,
  setLanguage as setLanguageAction,
} from '../../../Reducers/classifications/actions';
import LanguagesMenu from '../../CommonsElements/LanguagesMenu';
import {
  selectLanguage,
  selectIsFetchingClassification,
} from '../../../Reducers/classifications/selectors';
import { FlexWrapper } from './Panel/_shared/styles';
import ClassificationMenu from '../ClassificationMenu';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import { getClassificationName } from '../_shared/utils';

type Props = {
  classification: IClassification;
  title: string;
  languageCode: LanguageCode;
  classificationLanguage: LanguageCode;
  setClassificationLanguage: (x: LanguageCode) => void;
  isFetchingClassification: boolean;
  fetchNodes: (classificationId: number) => void;
};

const Header: React.FC<Props> = ({
  classification,
  title,
  languageCode,
  classificationLanguage,
  setClassificationLanguage,
  isFetchingClassification,
  fetchNodes,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setClassificationLanguage(languageCode);
  }, []);

  const navigateToClassificationsList = () => {
    const url = `/${languageCode}/${RoutePaths.ManageClassifications}`;
    navigate(url);
  };

  const onImportCompleted = () => {
    fetchNodes(classification?.Id);
  };

  const currentTranslationName = getClassificationName(classification, classificationLanguage);

  return (
    <MainWrapper apart>
      <FlexWrapper>
        <IconWrapper onClick={navigateToClassificationsList}>
          <Icon icon="arrow-left" size="l" />
        </IconWrapper>
        <LanguagesMenu
          value={classificationLanguage}
          onChange={setClassificationLanguage}
          menuOptions={{ placement: 'bottom-end' }}
        />
        <TitleWrapper>
          {!isFetchingClassification && <H2>{title || currentTranslationName}</H2>}
        </TitleWrapper>
      </FlexWrapper>
      <ClassificationMenu
        classification={classification}
        onDelete={navigateToClassificationsList}
        onImportCompleted={onImportCompleted}
      />
    </MainWrapper>
  );
};

const MainWrapper = styled(FlexWrapper)`
  align-items: center;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: ${space[50]};
`;
const TitleWrapper = styled.div`
  margin-left: ${space[50]};
`;

const mapStateToProps = createStructuredSelector({
  classificationLanguage: selectLanguage,
  resources: selectTranslatedResources,
  isFetchingClassification: selectIsFetchingClassification,
});
const mapDispatchToProps = (dispatch) => ({
  setClassificationLanguage: (language) => dispatch(setLanguageAction(language)),
  fetchNodes: (classificationId: number) => dispatch(fetchNodesAction(classificationId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
