import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import type { Icon } from '~/data/content';

const iconComponents = {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
};

export const getIcon = (name?: Icon) => {
  if (!name) return null;
  const IconComponent = iconComponents[name];
  return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
};
