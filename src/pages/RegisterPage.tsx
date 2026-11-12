import React from 'react';
import { LoginPage } from './LoginPage';

/**
 * Direct /register entrypoint delegating to the unified tabbed Auth Portal card.
 */
export const RegisterPage: React.FC = () => {
  return <LoginPage initialTab="register" />;
};
