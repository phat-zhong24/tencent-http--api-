import { join } from 'path';
import { Framework } from '../typings';

export const COMPONENT_NAME = 'http';

export const VERSION_YAML_PATH = join(__dirname, '..', 'version.yml');

export const COMPONENT_CODE_PATH = join(__dirname, '..', 'build');

export const FRAMEWORKS: Framework[] = [
  'express',
  'koa',
  'egg',
  'next',
  'nuxt',
  'nest',
  'flask',
  'django',
  'laravel',
  'thinkphp',
];
