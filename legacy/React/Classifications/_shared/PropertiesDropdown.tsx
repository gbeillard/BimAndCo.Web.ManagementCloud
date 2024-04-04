import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Autocomplete, colors, Concept, SortDirection } from '@bim-co/componentui-foundation';
/* Types */
import { Property } from '../../../Reducers/PropertiesV10/types';
import { ReasonType, Reason } from '../../../Reducers/classifications/types';

import {
  setFilterSort as setFilterSortAction,
  fetchAllProperties as fetchAllPropertiesAction,
} from '../../../Reducers/PropertiesV10/actions';

// Selectors
import { selectFilter } from '../../../Reducers/properties/selectors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import {
  selectFetchPropertiesIsPending,
  selectClassificationsProperties,
} from '../../../Reducers/PropertiesV10/selectors';

type GetValuePropsType = (index: number) => {
  onDelete: () => void;
};

type Props = {
  selectedProperty: Property;
  // from parent component
  onSelectProperty: (property: Property) => void;
  onDeleteProperty: () => void;
  placeholder: string;
  // mapStateToProps
  resources: any;
  properties?: Property[];
  fetchPropertiesIsPending: boolean;
  // mapDispatchToProps
  fetchAllProperties?: (
    mappingConfigurationId?: string,
    mappingConfigurationLanguage?: string,
    mappingDictionaryLanguage?: string
  ) => void;
  setFilterSort?: (field: string, order: SortDirection) => void;
};

const PropertiesDropdown: React.FC<Props> = ({
  // from parent component
  selectedProperty,
  onSelectProperty,
  onDeleteProperty,
  placeholder,
  // mapStateToProps
  properties,
  resources,
  fetchPropertiesIsPending,
  // mapDispatchToProps
  fetchAllProperties,
  setFilterSort,
}) => {
  /**
   * Initial call : Component mounted
   */
  useEffect(() => {
    // reset all fitlers and sort
    setFilterSort('Name', SortDirection.Asc);
    if (!fetchPropertiesIsPending) {
      // Load all properties
      fetchAllProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectProperty = (values: Property[], value: Property) => {
    onSelectProperty({
      Id: value.Id,
      Name: value.Name,
    });
  };

  const onChange = (event: MouseEvent, values: Property[], reason: ReasonType, value: Property) => {
    switch (reason) {
      case Reason.SelectOption:
        handleSelectProperty(values, value);
        break;
      case Reason.RemoveOption:
        onDeleteProperty();
        break;
      default:
        break;
    }
  };

  const isOptionEqualToValue = (option, value) => option?.Id === value?.Id;

  const renderValues = (values: Property[], getValueProps: GetValuePropsType) =>
    values?.map((property: Property, index: number) => {
      const { onDelete } = getValueProps(index);
      return (
        <Concept.PropertyWithChip
          key={property.Id}
          textColor={colors.BM[90]}
          color={colors.BM[90]}
          onDelete={onDelete}
        >
          {property?.Name}
        </Concept.PropertyWithChip>
      );
    });

  return (
    <Autocomplete
      placeholder={placeholder}
      options={properties}
      isLoading={fetchPropertiesIsPending}
      values={selectedProperty ? [selectedProperty] : []}
      getOptionLabel={(option) => option?.Name}
      onChange={onChange}
      hideSelectedOptions
      noOptionsText={resources.ContentManagementClassif.NoOptions}
      renderValues={renderValues}
      isOptionEqualToValue={isOptionEqualToValue}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  properties: selectClassificationsProperties,
  filter: selectFilter,
  resources: selectTranslatedResources,
  fetchPropertiesIsPending: selectFetchPropertiesIsPending, // otherwise conflict of naming upper
});

const mapDispatchToProps = (dispatch) => ({
  setFilterSort: (field: string, order: SortDirection) =>
    dispatch(setFilterSortAction(field, order)),
  fetchAllProperties: (
    mappingConfigurationId: string,
    mappingConfigurationLanguage: string,
    mappingDictionaryLanguage: string
  ) =>
    dispatch(
      fetchAllPropertiesAction(
        mappingConfigurationId,
        mappingConfigurationLanguage,
        mappingDictionaryLanguage
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PropertiesDropdown));
