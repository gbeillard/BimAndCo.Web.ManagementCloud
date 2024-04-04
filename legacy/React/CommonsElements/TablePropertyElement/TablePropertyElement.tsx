import React from 'react';
import { Stack, Toggle } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import { Property } from '../../../Reducers/dictionary/types';
import TableConfig from './TableConfig';
import { SchemaTable } from './types';

type Props = {
  isTable: boolean;
  setIsTable: (isTable: boolean) => void;
  schemaTable: SchemaTable | null;
  setSchemaTable: (schemaTable: SchemaTable) => void;
  resources: any;
  errorFieldSchemaTable: boolean;
};

const TablePropertyElement: React.FC<Props> = ({
  isTable,
  setIsTable,
  schemaTable,
  setSchemaTable,
  resources,
  errorFieldSchemaTable,
}) => {
  const onChange = () => {
    if (!isTable) setSchemaTable({ Columns: [null], Rows: [] });
    setIsTable(!isTable);
  };

  const setColumns = (columns: Property[]): void => {
    setSchemaTable({ ...schemaTable, Columns: columns });
  };

  return (
    <StackStyled>
      <HelperText>{resources.ContentManagement.PropertiesModalTableHelperTextToggle}</HelperText>
      <Toggle
        checked={isTable}
        label={
          isTable
            ? resources.ContentManagement.PropertiesModalTableYes
            : resources.ContentManagement.PropertiesModalTableNo
        }
        onChange={onChange}
      />
      <LabelStyled errorFieldSchemaTable={errorFieldSchemaTable}>
        {resources.ContentManagement.PropertiesModalTableLabelToggle}
      </LabelStyled>
      {isTable && (
        <TableConfig columns={schemaTable.Columns} setColumns={setColumns} resources={resources} />
      )}
    </StackStyled>
  );
};

const HelperText = styled.label`
  color: rgb(175, 168, 157);
  font-size: 12px !important;
  margin-top: 5px;
`;

const StackStyled = styled(Stack)`
  margin-top: 5px;
  margin-left: 10px;
`;

const LabelStyled = styled.p<{ errorFieldSchemaTable: boolean }>(
  ({ errorFieldSchemaTable }) => `
    color: ${errorFieldSchemaTable ? 'red' : 'black'}!important;
  `
);

export default TablePropertyElement;
