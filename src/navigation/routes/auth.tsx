import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import Auth from '../AuthGuard';

export const auth: RouteObject = {
  element: <Auth />,
  children: [

  ],
};

