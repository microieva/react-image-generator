import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  animationType: string;
  setAnimationType: (type: string) => void;
  getAnimationClass: () => string;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
  defaultAnimation?: string;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ 
  children, 
  defaultAnimation = 'slideInRight' 
}) => {
  const [animationType, setAnimationType] = useState(defaultAnimation);

  const getAnimationClass = () => {
    return `animate__animated animate__${animationType}`;
  };

  return (
    <AnimationContext.Provider value={{ 
      animationType, 
      setAnimationType, 
      getAnimationClass 
    }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};