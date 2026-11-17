import React from 'react';
import {
  BookOpen,
  Brain,
  Calculator,
  Code2,
  Cpu,
  Database,
  Layers,
  Network,
} from 'lucide-react';
import { SubjectIconName } from '../../types';

interface SubjectIconProps {
  name: SubjectIconName;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({
  name,
  className = 'w-5 h-5',
}) => {
  switch (name) {
    case 'code':
      return <Code2 className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'brain':
      return <Brain className={className} />;
    case 'network':
      return <Network className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'calculator':
      return <Calculator className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'book':
    default:
      return <BookOpen className={className} />;
  }
};
