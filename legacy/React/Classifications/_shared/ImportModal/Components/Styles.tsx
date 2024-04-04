import React from 'react';
import { Ellipsis, space, Stack as DSStack } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';

export const Wrapper: React.FC = ({ children }) => (
  <WrapperCenter space={space[150]}>{children}</WrapperCenter>
);

export const StackCenter: React.FC = ({ children }) => <Stack space={space[50]}>{children}</Stack>;

export const TableCellContent: React.FC<{ title?: string }> = ({ title, children }) => (
  <TableCellContentWrapper title={title}>
    <Ellipsis>{children}</Ellipsis>
  </TableCellContentWrapper>
);

const Stack = styled(DSStack)`
  align-items: center;
  text-align: center;
`;

const WrapperCenter = styled(Stack)`
  margin-top: ${space[400]};
  margin-bottom: ${space[350]};
`;

const TableCellContentWrapper = styled.div`
  overflow: hidden;
`;
