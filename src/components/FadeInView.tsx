import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, InteractionManager, Platform } from 'react-native';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
};

export function FadeInView({ children, delay = 0, duration = 200, translateY = 8 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(translateY)).current;
  const reducedMotion = useRef(false);

  useEffect(() => {
    let subscription: { remove(): void } | null = null;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reducedMotion.current = enabled;
    });

    subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reducedMotion.current = enabled;
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    const task = InteractionManager.runAfterInteractions(() => {
      if (reducedMotion.current) {
        opacity.setValue(1);
        translate.setValue(0);
        return;
      }

      animation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]);
      animation.start();
    });

    return () => {
      task.cancel();
      animation?.stop();
    };
  }, [delay, duration, opacity, translate]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: translate }] }}>
      {children}
    </Animated.View>
  );
}
