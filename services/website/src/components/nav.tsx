'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@workspace/ui/lib/utils';
import { Button } from '@workspace/ui/components/ui/button';
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerTrigger,
} from '@workspace/ui/components/ui/drawer';
import { Github, Menu } from 'lucide-react';

export type NavItem = { name: string; path: string };

export function NavDesktop({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex md:items-center md:gap-6">
      {items.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            'hover:text-foreground/80 text-sm transition-colors',
            pathname === item.path
              ? 'text-foreground font-medium'
              : 'text-foreground/60'
          )}
        >
          {item.name}
        </Link>
      ))}
      <Button variant="outline" size="sm" asChild>
        <Link href="https://github.com/mark-omarov" target="_blank">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Link>
      </Button>
    </nav>
  );
}

export function NavMobile({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-green-500 shadow-lg hover:bg-green-600"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <nav className="flex flex-col items-center gap-4 p-4">
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'hover:bg-accent w-full rounded-md px-4 py-2 text-center text-sm transition-colors',
                    pathname === item.path
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground/60'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link
                  href="https://github.com/mark-omarov"
                  target="_blank"
                  onClick={() => setOpen(false)}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function Nav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-background/80 container sticky top-0 z-50 mx-auto w-full border-b px-4 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center">
              <span className="font-bold text-green-500">~/</span>
              <span className="text-accent-foreground font-bold transition-colors duration-300 group-hover:text-green-500">
                mark-omarov
              </span>
              {pathname.length > 1 && (
                <span className="text-muted-foreground font-bold">
                  {pathname}
                </span>
              )}
            </Link>
          </div>
          <NavDesktop items={items} />
        </div>
      </header>
      <NavMobile items={items} />
    </>
  );
}
