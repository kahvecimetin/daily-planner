import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MONTHS_TR, DAYS_TR } from '@/types/calendar';
import { getMonthDays } from '@/utils/calendar';

interface YearViewProps {
  year: number;
  noteDates: Set<string>;
  onMonthPress: (month: number) => void;
  onDayPress: (date: Date) => void;
}

export default function YearView({ year, noteDates, onMonthPress, onDayPress }: YearViewProps) {
  const renderMiniMonth = (month: number) => {
    const days = getMonthDays(year, month, noteDates);

    return (
      <TouchableOpacity
        key={month}
        style={styles.miniMonth}
        onPress={() => onMonthPress(month)}
        activeOpacity={0.7}
      >
        <Text style={styles.monthTitle}>{MONTHS_TR[month]}</Text>
        <View style={styles.daysHeader}>
          {DAYS_TR.map((day, index) => (
            <Text key={index} style={styles.dayHeaderText}>
              {day.charAt(0)}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.isToday && styles.todayCell,
                !day.isCurrentMonth && styles.otherMonthDay,
              ]}
              onPress={() => onDayPress(day.date)}
            >
              <Text
                style={[
                  styles.dayText,
                  day.isToday && styles.todayText,
                  !day.isCurrentMonth && styles.otherMonthText,
                ]}
              >
                {day.date.getDate()}
              </Text>
              {day.hasNotes && <View style={styles.noteDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.yearGrid}>
        {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  miniMonth: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  dayHeaderText: {
    fontSize: 10,
    color: '#666',
    width: 20,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 10,
    color: '#1a1a1a',
  },
  todayCell: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  todayText: {
    color: '#fff',
    fontWeight: '600',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#999',
  },
  noteDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B6B',
  },
});
