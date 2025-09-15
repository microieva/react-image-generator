import React, { useEffect, useState } from 'react';
import { useAnimation } from '../contexts/AnimationContext';

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  const { getAnimationClass } = useAnimation();
  const [animationClass, setAnimationClass] = useState<string>('');

  useEffect(() => {
    setAnimationClass(getAnimationClass());
  }, []);

  return (
    <div className={`animation ${animationClass}`.trim()}>
      {children}
    </div>
  );
};

export default AnimatedPage;