import styled from '@emotion/styled';
import React from 'react';
import ReactDropzone, { DropzoneOptions, DropzoneRef } from 'react-dropzone';

type Props = DropzoneOptions;

const Dropzone = React.forwardRef<DropzoneRef, Props>(({ ...dropzoneOptions }, ref?) => (
  <ReactDropzone ref={ref} noClick noKeyboard {...dropzoneOptions}>
    {({ getRootProps, getInputProps }) => (
      <Wrapper {...getRootProps()}>
        <input {...getInputProps()} />
      </Wrapper>
    )}
  </ReactDropzone>
));

const Wrapper = styled.div`
  display: none;
`;

export default Dropzone;
