import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  ListRow,
  ListCell,
  space,
  defaultTheme,
  getClassificationColorFromId,
  Toggle,
  typeSize,
} from '@bim-co/componentui-foundation';
import {
  selectIsBoostOffer,
  selectManagementCloudId,
  selectTranslatedResources,
  selectUser,
} from '../../../Reducers/app/selectors';
import { IClassification } from '../../../Reducers/classifications/types';
import { User } from '../../../Reducers/app/types';
import ClassificationMenu from '../ClassificationMenu';

const getHumanReadablePercentage = (percentage: number) =>
  `${Math.round((!Number.isNaN(percentage) ? percentage : 0) * 10000) / 100}%`;

type Props = {
  classification: IClassification;
  onflyId: number;
  isBoostOffer: boolean;
  resources: any;
  user: User;
  onClassificationChanged: (c: IClassification) => void;
  onClassificationClicked: (x: IClassification) => void;
};
const Item: React.FC<Props> = ({
  classification,
  onClassificationChanged,
  onClassificationClicked,
  resources,
  isBoostOffer,
  onflyId,
  user,
  ...otherProps
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleClick = useCallback(() => {
    onClassificationClicked(classification);
  }, [onClassificationClicked, classification.Id]);

  const handleChange = useCallback(
    (isEnabled: boolean) => {
      onClassificationChanged({ ...classification, IsEnabled: isEnabled });
    },
    [onClassificationChanged, classification.Id, classification.IsEnabled]
  );

  const { color } = useMemo(
    () => getClassificationColorFromId(classification.Id),
    [classification.Id]
  );

  const enableFocus = () => setIsFocus(true);
  const disableFocus = () => setIsFocus(false);

  return (
    <ListRow {...otherProps} onClick={handleClick} hover focused={isFocus}>
      <ListCell>
        <NameWrapper>
          <ColorDot color={color} />
          {classification?.Name}
        </NameWrapper>
      </ListCell>
      <ListCell>
        <Origin isPrivate={classification.IsPrivate}>
          {classification.IsPrivate
            ? resources.ClassificationHome.PrivateOrigin
            : resources.ClassificationHome.BimAndCoOrigin}
        </Origin>
      </ListCell>
      <ListCell>{classification.Version}</ListCell>
      <ListCell>
        {getHumanReadablePercentage(classification?.Statistics?.ObjectsAssignedPercentage)}
      </ListCell>
      <ListCell>
        <Toggle
          label={
            classification.IsEnabled
              ? resources.ClassificationHome.EveryoneVisibility
              : resources.ClassificationHome.YourselfVisibility
          }
          checked={classification.IsEnabled}
          onChange={handleChange}
          size="dense"
        />
      </ListCell>
      <ListCell width={space[350]}>
        <ClassificationMenu
          classification={classification}
          onClick={enableFocus}
          onClose={disableFocus}
        />
      </ListCell>
    </ListRow>
  );
};

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ColorDot = styled.div<{ color: string }>(
  ({ color }) => `
  margin-left: ${space[100]};
  width: ${space[200]};
  height: ${space[200]};
  border-radius: ${defaultTheme.borderRadiusRounded};
  background-color: ${color};
  margin-right: ${space[125]};
`
);

const Origin = styled.span<{ isPrivate: boolean }>(
  ({ isPrivate }) => `
  font-size: ${typeSize.paragraph};
  font-weight: ${defaultTheme.boldWeight};
  color: ${isPrivate ? defaultTheme.primaryColor : defaultTheme.textColorTertiary};
`
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  isBoostOffer: selectIsBoostOffer,
  onflyId: selectManagementCloudId,
  user: selectUser,
});

export default connect(mapStateToProps)(React.memo(Item));
