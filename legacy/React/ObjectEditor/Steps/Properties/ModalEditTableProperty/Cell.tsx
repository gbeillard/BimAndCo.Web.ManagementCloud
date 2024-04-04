import { TextField } from '@bim-co/componentui-foundation';
import React from 'react';
import styled from '@emotion/styled';
import MyCheckbox from './MyCheckbox';
import { DataType, TypeColumn } from './types';

type Props = {
  dataType: TypeColumn;
  initValue: DataType;
  onChange: (event: any) => void;
};

const Cell: React.FC<Props> = ({ dataType, initValue, onChange }) => {
  const getInput = () => {
    if (dataType === TypeColumn.BOOLEAN) {
      return <MyCheckbox value={initValue as boolean} onChange={onChange} />;
    }
    return (
      <TextFieldStyled isDense size="dense" type={dataType} value={initValue} onChange={onChange} />
    );
  };

  return getInput();
};

const TextFieldStyled = styled(TextField)`
  [data-test-id='TextField'] {
    [data-test-id='TextField-content'] {
      padding: 0;
    }
  }
`;

export default Cell;
