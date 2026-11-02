import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getNote (Ejercicio 3)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve la nota cuando el id existe', () => {
    const created = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const found = service.getNote(created.id);

    expect(found).toEqual(created);
  });

  it('devuelve undefined cuando el id no existe', () => {
    const found = service.getNote(999);

    expect(found).toBeUndefined();
  });
});