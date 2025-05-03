import { useEffect, useRef } from 'react';
import { env } from '~/env';

export function useDebugRerender(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    if (env.NODE_ENV === 'production') return;
    renderCount.current += 1;
    console.log(`${componentName} rendered:`, renderCount.current);
  });
}
