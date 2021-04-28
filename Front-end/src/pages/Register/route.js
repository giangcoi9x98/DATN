import { lazy } from 'react';
import Default from '../../layout/Default';
export default {
  path: '/register',
  extract: true,
  public: true,
  layout: Default,
  component: lazy(() => import('.')),
};
