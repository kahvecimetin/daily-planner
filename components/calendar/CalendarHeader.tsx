import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ViewType } from '@/types/calendar';
import { getStartOfWeek, getEndOfWeek } from '@/utils/calendar';
import { useTranslation } from '@/contexts/LanguageContext';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function CalendarHeader({
  currentDate,
  viewType,
  onViewChange,
  onToday,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  const { t, months } = useTranslation();

  const views: { key: ViewType; label: string }[] = [
    { key: 'year', label: t('views.year') },
    { key: 'month', label: t('views.month') },
    { key: 'week', label: t('views.week') },
    { key: 'day', label: t('views.day') },
  ];

  const today = new Date();
  const isToday = currentDate.toDateString() === today.toDateString();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  const isCurrentYear = currentDate.getFullYear() === today.getFullYear();

  const showTodayButton =
    (viewType === 'day' && !isToday) ||
    (viewType === 'month' && !isCurrentMonth) ||
    (viewType === 'year' && !isCurrentYear) ||
    (viewType === 'week' && !isToday);

  const getTitle = () => {
    switch (viewType) {
      case 'year':
        return currentDate.getFullYear().toString();
      case 'month':
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week': {
        const start = getStartOfWeek(currentDate);
        const end = getEndOfWeek(currentDate);
        if (start.getMonth() === end.getMonth()) {
          return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]}`;
        }
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
      }
      case 'day':
        return `${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.viewSwitcher}>
          {views.map((view) => (
            <TouchableOpacity
              key={view.key}
              style={[
                styles.viewButton,
                viewType === view.key && styles.activeViewButton,
              ]}
              onPress={() => onViewChange(view.key)}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  viewType === view.key && styles.activeViewButtonText,
                ]}
              >
                {view.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
          <ChevronLeft size={28} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{getTitle()}</Text>
          {showTodayButton && (
            <TouchableOpacity onPress={onToday}>
              <Text style={styles.todayText}>{t('calendar.goToToday')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onNext} style={styles.navButton}>
          <ChevronRight size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 3,
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  activeViewButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeViewButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  todayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
    marginTop: 4,
  },
});
