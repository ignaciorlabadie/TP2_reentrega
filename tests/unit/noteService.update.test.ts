import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - updateNote (Ejercicio 4)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('actualiza solo title, sin tocar content', () => {
    const note = service.createNote({ title: 'Original', content: 'Contenido' });
    const updated = service.updateNote(note.id, { title: 'Nuevo título' });

    expect(updated?.title).toBe('Nuevo título');
    expect(updated?.content).toBe('Contenido');
  });

  it('actualiza solo content, sin tocar title', () => {
    const note = service.createNote({ title: 'Original', content: 'Contenido' });
    const updated = service.updateNote(note.id, { content: 'Nuevo contenido' });

    expect(updated?.title).toBe('Original');
    expect(updated?.content).toBe('Nuevo contenido');
  });

  it('devuelve undefined si el id no existe', () => {
    const updated = service.updateNote(999, { title: 'X' });
    expect(updated).toBeUndefined();
  });
});