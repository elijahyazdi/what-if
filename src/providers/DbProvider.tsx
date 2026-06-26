import React, { ReactNode, useEffect, useState } from 'react';
import { runMigrations } from '../db';
import { LoadingScreen } from '../screens/LoadingScreen';

export const DbProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    runMigrations()
      .then(() => setReady(true))
      .catch(err => {
        console.error('DB migration failed:', err);
        setError(err);
      });
  }, []);

  if (error) {
    // Fall through to LoadingScreen for now; surfacing a real error UI is a
    // future deliverable. The error is logged to the console.
    return <LoadingScreen />;
  }

  if (!ready) return <LoadingScreen />;

  return <>{children}</>;
};
