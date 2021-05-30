import { lazy } from 'react';
import Home from '../../layout/Home';

export default {
  path: '/post/:id',
  extract: true,
  public: true,
  layout: Home,
  component: lazy(() => import('.')),
};