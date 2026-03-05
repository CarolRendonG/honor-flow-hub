import React, { createContext, useContext, useState, useCallback } from 'react';

interface DonationContextType {
  honorPoints: number;
  donatedProjectIds: Set<string>;
  recordDonation: (projectId: string, amount: number) => void;
}

const DonationContext = createContext<DonationContextType | null>(null);

export const useDonations = () => {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error('useDonations must be used within DonationProvider');
  return ctx;
};

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [honorPoints, setHonorPoints] = useState(0);
  const [donatedProjectIds, setDonatedProjectIds] = useState<Set<string>>(new Set());

  const recordDonation = useCallback((projectId: string, amount: number) => {
    const pts = Math.round(amount / 10);
    setHonorPoints(prev => prev + pts);
    setDonatedProjectIds(prev => new Set(prev).add(projectId));
  }, []);

  return (
    <DonationContext.Provider value={{ honorPoints, donatedProjectIds, recordDonation }}>
      {children}
    </DonationContext.Provider>
  );
};
