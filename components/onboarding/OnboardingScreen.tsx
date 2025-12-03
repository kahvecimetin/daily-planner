import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Pencil, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: 'calendar' | 'pencil' | 'zap';
  title: string;
  description: string;
  bgColors: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'calendar',
    title: 'Takvimini Kesfet',
    description: 'Yil, ay, hafta veya gun.\nIstedigin gorunumde gezin.',
    bgColors: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    icon: 'pencil',
    title: 'Notlarini Yaz',
    description: 'Her gune ozel notlar ekle.\nRenklerle duzenle.',
    bgColors: ['#f093fb', '#f5576c'],
  },
  {
    id: '3',
    icon: 'zap',
    title: 'Hazirsin!',
    description: 'Basit. Hizli. Senin icin.',
    bgColors: ['#4facfe', '#00f2fe'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle1X = useRef(new Animated.Value(0)).current;
  const particle2X = useRef(new Animated.Value(0)).current;
  const particle3X = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating icon animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for icon container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating particles
    const createParticleAnimation = (animY: Animated.Value, animX: Animated.Value, durationY: number, durationX: number) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(animY, { toValue: -30, duration: durationY, useNativeDriver: true }),
            Animated.timing(animY, { toValue: 30, duration: durationY, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(animX, { toValue: 20, duration: durationX, useNativeDriver: true }),
            Animated.timing(animX, { toValue: -20, duration: durationX, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };

    createParticleAnimation(particle1Y, particle1X, 3000, 4000);
    createParticleAnimation(particle2Y, particle2X, 2500, 3500);
    createParticleAnimation(particle3Y, particle3X, 3500, 3000);
  }, []);

  const animateTransition = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateTransition(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlide = slides[currentIndex];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const renderIcon = () => {
    const iconProps = { size: 64, color: '#fff', strokeWidth: 1.5 };
    switch (currentSlide.icon) {
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'pencil':
        return <Pencil {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.bgColors[0] }]}>
      {/* Gradient overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: currentSlide.bgColors[1] }]} />

      {/* Floating particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { transform: [{ translateY: particle1Y }, { translateX: particle1X }] }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { transform: [{ translateY: particle2Y }, { translateX: particle2X }] }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { transform: [{ translateY: particle3Y }, { translateX: particle3X }] }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle4,
          { transform: [{ translateY: particle2Y }, { translateX: particle1X }] }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle5,
          { transform: [{ translateY: particle3Y }, { translateX: particle2X }] }
        ]}
      />

      {/* Decorative circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {currentIndex < slides.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Atla</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconOuterContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) },
                  { translateY: floatAnim },
                  { rotate: rotation },
                ],
              },
            ]}
          >
            <View style={styles.iconGlow} />
            <View style={styles.iconContainer}>
              {renderIcon()}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Basla' : 'Devam'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 10,
    height: 50,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconOuterContainer: {
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 32,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  particle1: {
    width: 20,
    height: 20,
    top: '15%',
    left: '10%',
  },
  particle2: {
    width: 14,
    height: 14,
    top: '25%',
    right: '15%',
  },
  particle3: {
    width: 24,
    height: 24,
    top: '55%',
    left: '15%',
  },
  particle4: {
    width: 16,
    height: 16,
    top: '65%',
    right: '12%',
  },
  particle5: {
    width: 12,
    height: 12,
    top: '40%',
    right: '20%',
  },
  decorCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -100,
    right: -100,
  },
  decorCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 100,
    left: -80,
  },
});
