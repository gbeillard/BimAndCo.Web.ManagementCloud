import styled from '@emotion/styled';
import { space, defaultTheme } from '@bim-co/componentui-foundation';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space[100]};
  padding-top: ${space[125]};
`;

export const Body = styled.div`
  background-color: ${defaultTheme.backgroundColor};
  border-radius: ${defaultTheme.borderRadiusBig};
  overflow: hidden;
`;

export const LoaderContainer = styled.div`
  padding-top: ${space[250]};
`;

export const Iframe = styled.iframe<{ isLoading: boolean }>`
  ${({ isLoading }) => `  
  height: calc(100vh - ${isLoading ? '235' : '171'}px);
`}
`;
