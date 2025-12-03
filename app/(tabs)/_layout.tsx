import { Tabs } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.calendar'),
          tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
