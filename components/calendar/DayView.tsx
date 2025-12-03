import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DAYS_FULL_TR, MONTHS_TR } from '@/types/calendar';
import { Note } from '@/types/note';

interface DayViewProps {
  date: Date;
  notes: Note[];
  onAddNote: () => void;
  onNotePress: (note: Note) => void;
}

export default function DayView({ date, notes, onAddNote, onNotePress }: DayViewProps) {
  const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <View style={styles.container}>
      <View style={[styles.header, isToday && styles.todayHeader]}>
        <Text style={styles.dayName}>{DAYS_FULL_TR[dayOfWeek]}</Text>
        <View style={styles.dateRow}>
          <Text style={[styles.dateNumber, isToday && styles.todayText]}>
            {date.getDate()}
          </Text>
          <Text style={[styles.monthYear, isToday && styles.todaySubtext]}>
            {MONTHS_TR[date.getMonth()]} {date.getFullYear()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
        {notes.length === 0 ? (
          <TouchableOpacity style={styles.emptyState} onPress={onAddNote}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Bu gun icin not yok</Text>
            <Text style={styles.emptyHint}>Eklemek icin dokun</Text>
          </TouchableOpacity>
        ) : (
          <>
            {notes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={[styles.noteCard, { backgroundColor: note.color }]}
                onPress={() => onNotePress(note)}
                activeOpacity={0.7}
              >
                <Text style={styles.noteContent}>{note.content}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fafafa',
  },
  todayHeader: {
    backgroundColor: '#E3F2FD',
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  dateNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  todayText: {
    color: '#007AFF',
  },
  monthYear: {
    fontSize: 18,
    color: '#666',
  },
  todaySubtext: {
    color: '#007AFF',
  },
  notesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  noteContent: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
});
