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

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  description: string;
  bgColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    emoji: '📅',
    title: 'Takvimini Kesfet',
    description: 'Yil, ay, hafta veya gun.\nIstedigin gorunumde gezin.',
    bgColor: '#667eea',
  },
  {
    id: '2',
    emoji: '✨',
    title: 'Notlarini Yaz',
    description: 'Her gune ozel notlar ekle.\nRenklerle duzenle.',
    bgColor: '#f093fb',
  },
  {
    id: '3',
    emoji: '🚀',
    title: 'Hazirsin!',
    description: 'Basit. Hizli. Senin icin.',
    bgColor: '#4facfe',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle1X = useRef(new Animated.Value(0)).current;
  const particle2X = useRef(new Animated.Value(0)).current;
  const particle3X = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating emoji animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
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
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.bgColor }]}>
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
              styles.emojiContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatAnim },
                  { rotate: rotation },
                ],
              },
            ]}
          >
            <Text style={styles.emoji}>{currentSlide.emoji}</Text>
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
              <View
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
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emojiContainer: {
    marginBottom: 40,
  },
  emoji: {
    fontSize: 120,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 28,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    top: '60%',
    left: '20%',
  },
  particle4: {
    width: 16,
    height: 16,
    top: '70%',
    right: '10%',
  },
  particle5: {
    width: 12,
    height: 12,
    top: '40%',
    right: '25%',
  },
});
