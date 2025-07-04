import { Variants } from 'framer-motion';

export type PlayState = 'playing' | 'paused' | 'loading';

export const boxVariant: Variants = {
  playing: {
    backgroundColor: '#1a1a1a',
    boxShadow: '0px 0px 40px 0px #8B5CF64D',
  },
  paused: {
    backgroundColor: '#0f0f0f',
    boxShadow: '0px 4px 20px 0px #00000080',
  },
  loading: {
    backgroundColor: '#0f0f0f',
    boxShadow: '0px 4px 20px 0px #00000080',
  },
};

export const albumVariant: Variants = {
  playing: {
    rotate: 360,
    scale: 1,
    transition: {
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  paused: { scale: 0.95, transition: { type: 'spring' } },
  loading: { scale: 0.9, transition: { type: 'spring' }, opacity: 0.5 },
};

export const equalizerBarsVariant: Variants = {
  playing: (bar: number) => ({
    height: '100%',
    transition: {
      duration: 0.5,
      repeatType: 'reverse',
      repeat: Infinity,
      delay: bar * 0.1,
      ease: 'easeInOut',
    },
  }),
  paused: { height: '20%' },
  loading: { height: '50%', opacity: 0.5 },
};
