import { Platform } from 'react-native';
import mobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Test ID'leri - Yayına çıkmadan önce gerçek ID'lerle değiştirin
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_PLANNER_IOS_BANNER_AD_ID,
      android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    }) ?? TestIds.BANNER;

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_PLANNER_IOS_INTERSELLER_AD_ID ,
      android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    }) ?? TestIds.INTERSTITIAL;

class AdService {
  private interstitialAd: InterstitialAd | null = null;
  private isInterstitialLoaded = false;
  private interstitialLoadAttempts = 0;
  private maxInterstitialLoadAttempts = 3;
  private actionCount = 0;
  private actionsBeforeInterstitial = 5; // Her 5 aksiyonda bir interstitial göster

  async initialize() {
    try {
      await mobileAds().initialize();
      this.loadInterstitialAd();
    } catch (error) {
      console.log('AdMob initialization error:', error);
    }
  }

  getBannerAdUnitId() {
    return BANNER_AD_UNIT_ID;
  }

  private loadInterstitialAd() {
    if (this.interstitialLoadAttempts >= this.maxInterstitialLoadAttempts) {
      return;
    }

    this.interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isInterstitialLoaded = true;
      this.interstitialLoadAttempts = 0;
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isInterstitialLoaded = false;
      this.loadInterstitialAd();
    });

    this.interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      this.isInterstitialLoaded = false;
      this.interstitialLoadAttempts++;
      setTimeout(() => this.loadInterstitialAd(), 5000);
    });

    this.interstitialAd.load();
  }

  async showInterstitialAd(): Promise<boolean> {
    if (this.isInterstitialLoaded && this.interstitialAd) {
      try {
        await this.interstitialAd.show();
        return true;
      } catch (error) {
        console.log('Interstitial show error:', error);
        return false;
      }
    }
    return false;
  }

  // Aksiyon sayacı - belirli sayıda aksiyondan sonra interstitial göster
  async trackAction(): Promise<boolean> {
    this.actionCount++;
    if (this.actionCount >= this.actionsBeforeInterstitial) {
      this.actionCount = 0;
      return await this.showInterstitialAd();
    }
    return false;
  }

  // Belirli zamanlarda interstitial göstermek için
  async showInterstitialIfReady(): Promise<boolean> {
    return await this.showInterstitialAd();
  }
}

export const adService = new AdService();
export default adService;
