import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getWeekDays } from '@/utils/calendar';
import { useTranslation } from '@/contexts/LanguageContext';

interface WeekViewProps {
  currentDate: Date;
  noteDates: Set<string>;
  onDayPress: (date: Date) => void;
}

export default function WeekView({ currentDate, noteDates, onDayPress }: WeekViewProps) {
  const { t, daysFull } = useTranslation();
  const days = getWeekDays(currentDate, noteDates);

  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dayCard, day.isToday && styles.todayCard]}
          onPress={() => onDayPress(day.date)}
          activeOpacity={0.7}
        >
          <View style={styles.dayHeader}>
            <Text style={[styles.dayName, day.isToday && styles.todayText]}>
              {daysFull[index]}
            </Text>
            <View style={[styles.dateCircle, day.isToday && styles.todayCircle]}>
              <Text style={[styles.dateNumber, day.isToday && styles.todayDateText]}>
                {day.date.getDate()}
              </Text>
            </View>
          </View>
          {day.hasNotes && (
            <View style={styles.noteIndicator}>
              <View style={styles.noteDot} />
              <Text style={styles.noteText}>{t('weekView.hasNotes')}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todayCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: '#007AFF',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  todayDateText: {
    color: '#fff',
  },
  noteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  noteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
  },
});
