// eliminar una nota existente, devuelve true y luego getNote(id) es undefined / listNotes() no contiene la nota eliminada
// eliminar solo la nota pedida y no afecta a las demás notas
// devuelve false si el id no existe

import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('elimina una nota existente y devuelve true', () => {
        const note = service.createNote({ title: 'Original', content: 'Contenido' });

        const deleted = service.deleteNote(note.id);

        expect(deleted).toBe(true);
        expect(service.getNote(note.id)).toBeUndefined();
        expect(service.listNotes()).toHaveLength(0);
    });

    it('elimina solo la nota pedida y conserva las demás', () => {
        const a = service.createNote({ title: 'A', content: 'Contenido A' });
        const b = service.createNote({ title: 'B', content: 'Contenido B' });

        const deleted = service.deleteNote(a.id);

        expect(deleted).toBe(true);
        expect(service.getNote(a.id)).toBeUndefined();
        expect(service.getNote(b.id)).toEqual(b);
        expect(service.listNotes()).toHaveLength(1);
    });

    it('devuelve false si el id no existe', () => {
        const deleted = service.deleteNote(999);

        expect(deleted).toBe(false);
    });
});