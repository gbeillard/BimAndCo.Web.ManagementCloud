import { Checkbox } from '@bim-co/componentui-foundation';
import React, { useState } from 'react';

type Props = {
  value: boolean;
  onChange: (event: any) => void;
};

const MyCheckbox: React.FC<Props> = ({ value, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(value);

  const onClick = (event: any) => {
    onChange({ ...event, target: { ...event.target, value: !isChecked } });
    setIsChecked(!isChecked);
  };

  return <Checkbox isChecked={isChecked} onClick={(event: any) => onClick(event)} />;
};

export default MyCheckbox;
