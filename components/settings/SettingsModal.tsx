import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronRight, FileText, Shield, Info, Globe } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useLanguage } from '@/contexts/LanguageContext';

// Privacy Policy ve Terms of Service URL'leri
const PRIVACY_POLICY_URL = 'https://example.com/privacy';
const TERMS_OF_SERVICE_URL = 'https://example.com/terms';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { t, language, setLanguage } = useLanguage();

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode ?? '1';

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Language Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Globe size={20} color="#4CAF50" />
                </View>
                <Text style={styles.settingText}>{t('settings.language')}</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {language === 'tr' ? t('settings.turkish') : t('settings.english')}
                </Text>
                <ChevronRight size={20} color="#999" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.legal')}</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => openURL(PRIVACY_POLICY_URL)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Shield size={20} color="#2196F3" />
                </View>
                <Text style={styles.settingText}>{t('settings.privacyPolicy')}</Text>
              </View>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => openURL(TERMS_OF_SERVICE_URL)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <FileText size={20} color="#FF9800" />
                </View>
                <Text style={styles.settingText}>{t('settings.termsOfService')}</Text>
              </View>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                  <Info size={20} color="#9C27B0" />
                </View>
                <Text style={styles.settingText}>{t('settings.appVersion')}</Text>
              </View>
              <Text style={styles.versionText}>{appVersion} ({buildNumber})</Text>
            </View>
          </View>

          </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  versionText: {
    fontSize: 16,
    color: '#999',
  },
});
