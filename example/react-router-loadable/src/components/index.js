import loadable from '@loadable/component';
// export { default as Container } from './Container';

const Container = loadable(() => import('./Container'));

export { Container };

