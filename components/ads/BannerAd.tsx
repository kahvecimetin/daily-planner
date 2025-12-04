import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adService } from '@/services/AdService';

interface BannerAdProps {
  size?: BannerAdSize;
}

export default function BannerAd({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: BannerAdProps) {
  // Web platformunda reklam gösterme
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={adService.getBannerAdUnitId()}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
