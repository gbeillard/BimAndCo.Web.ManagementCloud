import React, { useState } from 'react';
import { colors, Concept, Autocomplete } from '@bim-co/componentui-foundation';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Property } from '../../../Reducers/dictionary/types';
import { selectProperties } from '../../../Reducers/dictionary/selectors';
import { DATA_TYPES } from '../../Properties/PropertyPicker/constants';

type Props = {
  index: number;
  columns: (Property | null)[] | null;
  setColumns: (columns: (Property | null)[]) => void;
};

const CellTableConfig: React.FC<Props> = ({ index, columns, setColumns }) => {
  const properties: Property[] = useSelector(selectProperties);
  const [focus, setFocus] = useState<boolean>(false);
  const [isRender, setIsRender] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getOptionLabel = (option: any) => option?.name;

  const isOptionEqualToValue = (option: any, value: any) => option.id === value.id;

  const renderValues = (values: any, getValueProps: any) => {
    const result = values.map((value: any) => {
      const { onDelete } = getValueProps(index);
      return getConcept(value, onDelete);
    });
    return result;
  };

  const getConcept = (value: any, onDelete: any) => (
    <Concept.PropertyWithChip
      key={value?.id}
      textColor={colors.BM[90]}
      size="dense"
      color={colors.BM[90]}
      onClick={onDelete || (() => {})}
    >
      {value?.name}
    </Concept.PropertyWithChip>
  );

  const options = [...properties]
    .filter(
      (property: Property) => !columns.find((col: Property | null) => col && col.Id === property.Id)
    )
    .filter(
      (property: Property) =>
        [
          DATA_TYPES.BOOL,
          DATA_TYPES.INT,
          DATA_TYPES.NUMERIC,
          DATA_TYPES.STRING,
          DATA_TYPES.TEXT,
        ].includes(property.DataTypeId) && !property.IsTable
    )
    .map((property: Property, ind: number) => ({
      id: ind,
      name: property.Name,
      data: property,
    }));

  const values = columns[index]
    ? [
        {
          id: index,
          name: columns[index].Name,
          data: columns[index],
        },
      ]
    : [];

  const handleChange = (_, newValues: any[]) => {
    setColumns(
      columns.map((property: Property, ind: number) => {
        if (ind !== index) return property;
        if (newValues.length !== 0) return newValues[newValues.length - 1].data;
        return null;
      })
    );
    setFocus(false);
    setIsRender(false);
    setIsOpen(false);
  };

  const handleMouseEnter = () => setFocus(true);

  const handleMouseLeave = () => {
    if (focus && !isOpen) {
      setFocus(false);
      setIsRender(false);
      setIsOpen(false);
    }
  };

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    if (!isRender && focus) {
      setIsRender(true);
    } else {
      setFocus(false);
      setIsRender(false);
      setIsOpen(false);
    }
  };

  return (
    <Container onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {focus ? (
        <Autocomplete
          options={options}
          values={values}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          renderValues={renderValues}
          onChange={handleChange}
          onOpen={handleOpen}
          onClose={handleClose}
        />
      ) : (
        getConcept(values[0] || null, null)
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

export default CellTableConfig;
