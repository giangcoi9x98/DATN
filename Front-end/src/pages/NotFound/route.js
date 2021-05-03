import { lazy } from 'react';
import Home from '../../layout/Home';

export default {
  path: '/not-found',
  extract: true,
  public: true,
  layout: Home,
  component: lazy(() => import('.')),
};