import { lazy } from 'react';
import Default from '../../layout/Default';

export default {
  path: '/login',
  extract: true,
  public: true,
  layout: Default,
  component: lazy(() => import('.')),
};
