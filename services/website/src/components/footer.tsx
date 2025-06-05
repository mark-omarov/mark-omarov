import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container mx-auto border-t px-4 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-muted-foreground text-center text-sm md:text-left">
          © {new Date().getFullYear()} Mark Omarov. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/mark-omarov"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link
            href="https://www.linkedin.com/in/mark-omarov/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </div>
          </Link>
          <Link href="mailto:contact@omarov.dev">
            <div className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
