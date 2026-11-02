import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

// EJERCICIO 6: escriban un test que verifique que si se crea una nota con `pinned: true`, se llama a `notify(nota)`

// mock del módulo de notificaciónes
vi.mock('../../src/services/notificationService', () => {
    return {
        notify: vi.fn(),
    };
});

describe('NoteService - createNote (Ejercicio 6)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        // Limpiar el mock antes de cada test. Sino el test de "No llama a notify() con una nota normal" va a fallar porque el mock sigue teniendo la llamada del test anterior.
        vi.clearAllMocks();


        // Crear un nuevo servicio con un repositorio en memoria para cada test 
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

it('llama a notify() si la nota creada tiene pinned: true', () => {
    const nuevaNota = {
        title: 'Nota importante',
        content: 'Esta nota es importante',
        pinned: true,
    };

    const notaCreada = service.createNote(nuevaNota);

    // Verificar que notify fue llamado con la nota creada
    expect(notify).toHaveBeenCalledWith(notaCreada);
});

it('No llama a notify() con una nota normal (pinned: false)', () => {
    const nuevaNota = {
        title: 'Nota normal',
        content: 'Esta nota no es importante',
        //pinned: false, No es necesario ( por el Ej1 es por defecto false)
    };
service.createNote(nuevaNota);
    // Verificar que notify NO fue llamado
    expect(notify).not.toHaveBeenCalled();
});
});