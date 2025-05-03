'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import {
  FileJson,
  Container,
  Database,
  Server,
  Code2,
  Cpu,
  Globe,
  Layers,
  Terminal,
} from 'lucide-react';

type TechIcon = {
  icon: React.ReactNode;
  label: string;
  size: number;
  position: {
    top: string;
    left: string;
  };
  animation: {
    duration: string;
    delay: string;
  };
};

export function FloatingTech() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const techIcons: TechIcon[] = [
    {
      icon: <span className="font-bold text-yellow-400">JS</span>,
      label: 'JavaScript',
      size: 40,
      position: { top: '-10%', left: '20%' },
      animation: { duration: '15s', delay: '0s' },
    },
    {
      icon: <span className="font-bold text-blue-400">TS</span>,
      label: 'TypeScript',
      size: 40,
      position: { top: '10%', left: '-20%' },
      animation: { duration: '18s', delay: '1s' },
    },
    {
      icon: <Container className="text-blue-500" />,
      label: 'Docker',
      size: 30,
      position: { top: '60%', left: '-15%' },
      animation: { duration: '20s', delay: '2s' },
    },
    {
      icon: <span className="font-bold text-cyan-400">Go</span>,
      label: 'Golang',
      size: 35,
      position: { top: '80%', left: '20%' },
      animation: { duration: '17s', delay: '0.5s' },
    },
    {
      icon: <span className="font-bold text-purple-400">V</span>,
      label: 'Vite',
      size: 30,
      position: { top: '30%', left: '110%' },
      animation: { duration: '19s', delay: '1.5s' },
    },
    {
      icon: <FileJson className="text-orange-400" />,
      label: 'JSON',
      size: 25,
      position: { top: '70%', left: '110%' },
      animation: { duration: '16s', delay: '2.5s' },
    },
    {
      icon: <span className="font-bold text-sky-400">R</span>,
      label: 'React',
      size: 35,
      position: { top: '-5%', left: '80%' },
      animation: { duration: '21s', delay: '1s' },
    },
    {
      icon: <Database className="text-green-400" />,
      label: 'Database',
      size: 30,
      position: { top: '40%', left: '-25%' },
      animation: { duration: '18s', delay: '3s' },
    },
    {
      icon: <Server className="text-red-400" />,
      label: 'AWS',
      size: 28,
      position: { top: '20%', left: '115%' },
      animation: { duration: '22s', delay: '2s' },
    },
    {
      icon: <span className="font-bold text-green-500">N</span>,
      label: 'Node.js',
      size: 32,
      position: { top: '90%', left: '70%' },
      animation: { duration: '19s', delay: '1.2s' },
    },
    {
      icon: <Code2 className="text-indigo-400" />,
      label: 'VSCode',
      size: 26,
      position: { top: '85%', left: '-10%' },
      animation: { duration: '17s', delay: '0.8s' },
    },
    {
      icon: <Cpu className="text-gray-400" />,
      label: 'Linux',
      size: 28,
      position: { top: '-15%', left: '50%' },
      animation: { duration: '20s', delay: '1.7s' },
    },
    {
      icon: <Globe className="text-blue-300" />,
      label: 'Next.js',
      size: 30,
      position: { top: '50%', left: '115%' },
      animation: { duration: '16s', delay: '0.3s' },
    },
    {
      icon: <Layers className="text-amber-500" />,
      label: 'Terraform',
      size: 25,
      position: { top: '5%', left: '-25%' },
      animation: { duration: '21s', delay: '2.2s' },
    },
    {
      icon: <Terminal className="text-green-500" />,
      label: 'Bash',
      size: 22,
      position: { top: '60%', left: '110%' },
      animation: { duration: '18s', delay: '1.3s' },
    },
  ];

  return (
    <div className="absolute inset-0">
      {techIcons.map((tech, index) => (
        <div
          key={index}
          className="bg-background/80 absolute flex items-center justify-center rounded-full p-2 shadow-md backdrop-blur-sm"
          style={{
            width: `${tech.size}px`,
            height: `${tech.size}px`,
            top: tech.position.top,
            left: tech.position.left,
            animation: `float ${tech.animation.duration} ease-in-out infinite alternate ${tech.animation.delay}`,
          }}
          title={tech.label}
        >
          {tech.icon}
        </div>
      ))}
    </div>
  );
}
