import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { ViewType } from '@/types/calendar';
import { Note } from '@/types/note';
import { addDays, addMonths, addYears, formatDateKey } from '@/utils/calendar';
import { saveNotes, loadNotes } from '@/utils/storage';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import YearView from '@/components/calendar/YearView';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import NoteEditor from '@/components/notes/NoteEditor';
import SettingsModal from '@/components/settings/SettingsModal';
import BannerAd from '@/components/ads/BannerAd';
import { adService } from '@/services/AdService';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('day');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Load notes and initialize ads on mount
  useEffect(() => {
    const load = async () => {
      const savedNotes = await loadNotes();
      setNotes(savedNotes);
      setIsLoaded(true);
    };
    load();

    // AdMob'u başlat
    if (Platform.OS !== 'web') {
      adService.initialize();
    }
  }, []);

  // Save notes when they change
  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes);
    }
  }, [notes, isLoaded]);

  const noteDates = useMemo(() => {
    return new Set(notes.map((n) => n.date));
  }, [notes]);

  const currentDayNotes = useMemo(() => {
    const dateKey = formatDateKey(currentDate);
    return notes.filter((n) => n.date === dateKey);
  }, [notes, currentDate]);

  const handlePrevious = useCallback(() => {
    switch (viewType) {
      case 'year':
        setCurrentDate((prev) => addYears(prev, -1));
        break;
      case 'month':
        setCurrentDate((prev) => addMonths(prev, -1));
        break;
      case 'week':
        setCurrentDate((prev) => addDays(prev, -7));
        break;
      case 'day':
        setCurrentDate((prev) => addDays(prev, -1));
        break;
    }
  }, [viewType]);

  const handleNext = useCallback(() => {
    switch (viewType) {
      case 'year':
        setCurrentDate((prev) => addYears(prev, 1));
        break;
      case 'month':
        setCurrentDate((prev) => addMonths(prev, 1));
        break;
      case 'week':
        setCurrentDate((prev) => addDays(prev, 7));
        break;
      case 'day':
        setCurrentDate((prev) => addDays(prev, 1));
        break;
    }
  }, [viewType]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDayPress = useCallback((date: Date) => {
    setCurrentDate(date);
    setViewType('day');
  }, []);

  const handleWeekPress = useCallback((date: Date) => {
    setCurrentDate(date);
    setViewType('week');
  }, []);

  const handleMonthPress = useCallback((month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setViewType('month');
  }, [currentDate]);

  const handleAddNote = useCallback(() => {
    setSelectedNote(null);
    setEditorVisible(true);
  }, []);

  const handleNotePress = useCallback((note: Note) => {
    setSelectedNote(note);
    setEditorVisible(true);
  }, []);

  const handleSaveNote = useCallback(
    async (noteData: { id?: string; content: string; color: string }) => {
      const dateKey = formatDateKey(currentDate);

      if (noteData.id) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteData.id
              ? { ...n, content: noteData.content, color: noteData.color }
              : n
          )
        );
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          date: dateKey,
          content: noteData.content,
          color: noteData.color,
          createdAt: new Date(),
        };
        setNotes((prev) => [...prev, newNote]);
      }

      // Not kaydedildiğinde interstitial reklam sayacını artır
      if (Platform.OS !== 'web') {
        await adService.trackAction();
      }
    },
    [currentDate]
  );

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditorVisible(false);
    setSelectedNote(null);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setSettingsVisible(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setSettingsVisible(false);
  }, []);

  const renderView = () => {
    switch (viewType) {
      case 'year':
        return (
          <YearView
            year={currentDate.getFullYear()}
            noteDates={noteDates}
            onMonthPress={handleMonthPress}
            onDayPress={handleDayPress}
          />
        );
      case 'month':
        return (
          <MonthView
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            noteDates={noteDates}
            onDayPress={handleDayPress}
            onWeekPress={handleWeekPress}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            noteDates={noteDates}
            onDayPress={handleDayPress}
          />
        );
      case 'day':
        return (
          <DayView
            date={currentDate}
            notes={currentDayNotes}
            onAddNote={handleAddNote}
            onNotePress={handleNotePress}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CalendarHeader
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={setViewType}
        onToday={handleToday}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSettingsPress={handleOpenSettings}
      />
      <View style={styles.content}>
        {renderView()}
      </View>

      {/* Banner Reklam */}
      {Platform.OS !== 'web' && <BannerAd />}

      {viewType === 'day' && (
        <TouchableOpacity style={styles.fab} onPress={handleAddNote}>
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <NoteEditor
        visible={editorVisible}
        note={selectedNote}
        date={currentDate}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />

      <SettingsModal
        visible={settingsVisible}
        onClose={handleCloseSettings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Banner reklam için yukarı kaydırıldı
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
