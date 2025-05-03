'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/ui/tabs';
import { useCallback } from 'react';

interface FilterTabsProps {
  categories: string[];
  activeFilter: string;
}

export function FilterTabs({ categories, activeFilter }: FilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'all') {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      params.delete('page');

      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (value: string) => {
    const queryString = createQueryString('filter', value);

    window.history.pushState(
      null,
      '',
      `${pathname}${queryString ? `?${queryString}` : ''}`
    );

    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  return (
    <Tabs value={activeFilter} className="mb-6 w-full">
      <div className="mb-4 overflow-x-auto">
        <TabsList className="inline-flex h-auto w-auto space-x-1 p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => handleFilterChange(category)}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
