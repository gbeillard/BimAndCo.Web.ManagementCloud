import React from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Label, space, defaultTheme, Dropdown } from '@bim-co/componentui-foundation';
import { ObjectVariant } from '../../../../../Reducers/BimObject/Variants/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { selectVariants } from '../../../../../Reducers/BimObject/Variants/selectors';

type Props = {
  values: ObjectVariant[];
  onChange: (x: Option[]) => void;
  variants: ObjectVariant[];
  resources: any;
};

type Option = {
  value: number;
  label: string;
};

const mapVariantsToOptions = (vars: ObjectVariant[]): Option[] =>
  vars?.map((variant) => ({
    value: variant?.Id,
    label: variant?.Name,
  }));

const VariantsMultiSelect: React.FC<Props> = ({ values, onChange, variants, resources }) => (
  <>
    <StyledLabel>{resources.DocumentsDialog.LabelDocumentReference}</StyledLabel>
    <Dropdown
      placeholder={resources.DocumentsDialog.PlaceholderDocumentReference}
      value={mapVariantsToOptions(values)}
      onChange={onChange}
      options={mapVariantsToOptions(variants)}
      isMulti
    />
  </>
);

const mapStateToProps = createStructuredSelector({
  variants: selectVariants,
  resources: selectTranslatedResources,
});

const StyledLabel = styled(Label)`
  margin-bottom: ${space[50]};
  font-weight: ${defaultTheme.boldWeight};
`;

export default connect(mapStateToProps)(VariantsMultiSelect);
