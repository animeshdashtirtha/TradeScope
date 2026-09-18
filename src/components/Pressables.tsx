import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable } from 'react-native';

function useReducedMotion() {
  const reducedMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reducedMotion.current = enabled;
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reducedMotion.current = enabled;
    });
    return () => sub.remove();
  }, []);

  return reducedMotion;
}

type PressIconProps = {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
};

export function PressIcon({ children, onPress, label }: PressIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, { toValue: 0.88, duration: 130, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const onPressOut = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}

type PressLinkProps = {
  children: React.ReactNode;
  onPress: () => void;
};

export function PressLink({ children, onPress }: PressLinkProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = () => {
    if (reducedMotion.current) return;
    Animated.timing(opacity, { toValue: 0.5, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const onPressOut = () => {
    if (reducedMotion.current) return;
    Animated.timing(opacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={{ opacity }}>{children}</Animated.View>
    </Pressable>
  );
}

type PressScaleProps = {
  children: React.ReactNode;
  onPress?: () => void;
  scaleTo?: number;
};

export function PressScale({ children, onPress, scaleTo = 0.97 }: PressScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, { toValue: scaleTo, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const onPressOut = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, { toValue: 1, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  };
  return (
    <Pressable accessibilityRole="button" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}
