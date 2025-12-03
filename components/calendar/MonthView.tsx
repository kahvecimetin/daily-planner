import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMonthDays } from '@/utils/calendar';
import { useTranslation } from '@/contexts/LanguageContext';

interface MonthViewProps {
  year: number;
  month: number;
  noteDates: Set<string>;
  onDayPress: (date: Date) => void;
  onWeekPress: (date: Date) => void;
}

export default function MonthView({ year, month, noteDates, onDayPress, onWeekPress }: MonthViewProps) {
  const { daysShort } = useTranslation();
  const days = getMonthDays(year, month, noteDates);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.weekNumberHeader} />
        {daysShort.map((day, index) => (
          <View key={index} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            <TouchableOpacity
              style={styles.weekNumber}
              onPress={() => onWeekPress(week[0].date)}
            >
              <Text style={styles.weekNumberText}>
                {getWeekNumber(week[0].date)}
              </Text>
            </TouchableOpacity>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayCell,
                  day.isToday && styles.todayCell,
                  !day.isCurrentMonth && styles.otherMonthDay,
                ]}
                onPress={() => onDayPress(day.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    day.isToday && styles.todayText,
                    !day.isCurrentMonth && styles.otherMonthText,
                  ]}
                >
                  {day.date.getDate()}
                </Text>
                {day.hasNotes && (
                  <View style={styles.noteIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekNumberHeader: {
    width: 30,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    flex: 1,
    paddingTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 50,
  },
  weekNumber: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekNumberText: {
    fontSize: 11,
    color: '#999',
  },
  dayCell: {
    flex: 1,
    padding: 4,
    borderRadius: 8,
    marginHorizontal: 2,
    marginVertical: 2,
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: '#E3F2FD',
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  otherMonthText: {
    color: '#999',
  },
  noteIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginTop: 4,
  },
});
