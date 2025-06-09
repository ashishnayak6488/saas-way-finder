import { MotionProps } from 'framer-motion';

// Define a type for Framer Motion animation variants
interface AnimationVariant extends Pick<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'> {}

// FadeInUp animation
export const fadeInUp: AnimationVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// SlideIn animation
export const slideIn: AnimationVariant = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 },
};

// ScaleUp animation
export const scaleUp: AnimationVariant = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 },
};

// ContentAnimation
export const contentAnimation: AnimationVariant = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3 },
};

// TypewriterAnimation with children stagger
interface TypewriterAnimationVariant {
  hidden: Pick<MotionProps, 'initial'>['initial'];
  visible: {
    opacity: number;
    y: number;
    transition: {
      type: string;
      damping: number;
      stiffness: number;
      staggerChildren: number;
      delayChildren: number;
    };
  };
}

export const typewriterAnimation: TypewriterAnimationVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

// LetterAnimation
interface LetterAnimationVariant {
  hidden: Pick<MotionProps, 'initial'>['initial'];
  visible: Pick<MotionProps, 'animate'>['animate'];
}

export const letterAnimation: LetterAnimationVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};