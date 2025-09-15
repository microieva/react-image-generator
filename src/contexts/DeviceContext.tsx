import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Breakpoints, DeviceContextValue } from '../types/device';

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
  customBreakpoints?: Partial<Breakpoints>;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ 
  children, 
  customBreakpoints 
}) => {
  const breakpoints = useMemo((): Breakpoints => {
    const defaultBreakpoints: Breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1025
    };
    return { ...defaultBreakpoints, ...customBreakpoints };
  }, [customBreakpoints]); 

  const [deviceState, setDeviceState] = useState<Omit<DeviceContextValue, 'breakpoints' | 'isClient'>>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const detectDeviceType = (): void => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width <= breakpoints.mobile;
      const isTablet = width > breakpoints.mobile && width <= breakpoints.tablet;
      const isDesktop = width > breakpoints.tablet;

      setDeviceState({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height
      });
    };
    detectDeviceType();

    const handleResize = (): void => {
      detectDeviceType();
    };

    window.addEventListener('resize', handleResize);
    
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]); 

  const value: DeviceContextValue = {
    ...deviceState,
    breakpoints,
    isClient
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextValue => {
  const context = useContext(DeviceContext);
  
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  
  return context;
};