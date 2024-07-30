import React from 'react';

import { Button, Result } from 'antd';
import { useRouter } from 'next/router';
import { UserContext } from 'supertokens-node/types';

type ClaimValidationError = {
  message: string;
  // Add any other relevant fields here
};

interface AccessDeniedScreenProps {
  userContext?: UserContext;
  navigate?: (path: string) => void;
  validationError: ClaimValidationError;
}

const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
  validationError,
}) => {
  const router = useRouter();

  const handleGoHome = () => {
    if (typeof router.push === 'function') {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Result
        status="403"
        title="Access Denied"
        subTitle={
          validationError?.message ||
          "Sorry, you don't have access to this page."
        }
        extra={
          <Button type="primary" onClick={handleGoHome}>
            Go Home
          </Button>
        }
      />
    </div>
  );
};

export default AccessDeniedScreen;
