import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {  selectSettings } from '../../Reducers/app/selectors';
import { getShouldShowMonitoring } from './asyncUtils';

type Props = {
  children: JSX.Element;
};

const AsyncGuard = ({ children }: Props) => {
  const settings = useSelector(selectSettings);
  const location = useLocation();

  if (!getShouldShowMonitoring(settings)) {
    return <Navigate to={`/404`} state={{ from: location }} replace />;
  }

  return children;
};

export default AsyncGuard;
