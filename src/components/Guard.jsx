// src/components/Guard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectHasPermission } from '../reduxAuth/authSelectors';

export const Guard = ({ permission, children, fallback = null }) => {
  const hasAccess = useSelector((state) => selectHasPermission(state, permission));

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};