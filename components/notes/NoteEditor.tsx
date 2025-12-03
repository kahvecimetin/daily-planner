import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Trash2, Check } from 'lucide-react-native';
import { Note, NOTE_COLORS } from '@/types/note';
import { MONTHS_TR, DAYS_FULL_TR } from '@/types/calendar';

interface NoteEditorProps {
  visible: boolean;
  note?: Note | null;
  date: Date;
  onClose: () => void;
  onSave: (note: { id?: string; content: string; color: string }) => void;
  onDelete?: (noteId: string) => void;
}

export default function NoteEditor({
  visible,
  note,
  date,
  onClose,
  onSave,
  onDelete,
}: NoteEditorProps) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setColor(note.color);
    } else {
      setContent('');
      setColor(NOTE_COLORS[0]);
    }
  }, [note, visible]);

  const handleSave = () => {
    if (!content.trim()) {
      onClose();
      return;
    }

    onSave({
      ...(note && { id: note.id }),
      content: content.trim(),
      color,
    });
    onClose();
  };

  const handleDelete = () => {
    if (note && onDelete) {
      onDelete(note.id);
      onClose();
    }
  };

  const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const dateStr = `${date.getDate()} ${MONTHS_TR[date.getMonth()]} ${date.getFullYear()}, ${DAYS_FULL_TR[dayOfWeek]}`;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: color }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{dateStr}</Text>
            <View style={styles.headerActions}>
              {note && onDelete && (
                <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                  <Trash2 size={22} color="#FF3B30" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Check size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.contentInput}
            placeholder="Not yaz..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus={!note}
            textAlignVertical="top"
          />

          <View style={styles.colorPicker}>
            {NOTE_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorOption,
                  { backgroundColor: c },
                  color === c && styles.colorOptionSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
    color: '#1a1a1a',
    lineHeight: 28,
    padding: 20,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
});
