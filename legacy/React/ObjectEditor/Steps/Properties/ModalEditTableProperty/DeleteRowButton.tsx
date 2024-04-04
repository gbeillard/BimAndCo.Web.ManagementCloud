import { Button, Icon } from '@bim-co/componentui-foundation';
import React from 'react';

type Props = {
  onClick: () => void;
};

const DeleteRowButton: React.FC<Props> = ({ onClick }) => (
  <Button size="dense" isFullWidth variant="alternative" onClick={onClick}>
    <Icon color="danger" icon="delete" size="s" />
  </Button>
);

export default DeleteRowButton;
