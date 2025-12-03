import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/note';

const NOTES_KEY = 'daily_planner_notes';
const ONBOARDING_KEY = 'daily_planner_onboarding_completed';

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving notes:', e);
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    if (jsonValue != null) {
      const notes = JSON.parse(jsonValue);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      }));
    }
    return [];
  } catch (e) {
    console.error('Error loading notes:', e);
    return [];
  }
};

export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {
    console.error('Error saving onboarding status:', e);
  }
};

export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (e) {
    console.error('Error loading onboarding status:', e);
    return false;
  }
};
