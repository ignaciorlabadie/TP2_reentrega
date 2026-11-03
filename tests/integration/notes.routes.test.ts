import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { makeApp } from '../../src/app';

describe('Notes routes - GET /notes/:id (Ejercicio 3)', () => {
  let app: Express;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 con la nota cuando el id existe', async () => {
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    expect(created.status).toBe(201);

    const res = await request(app).get(`/notes/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it('devuelve 404 cuando el id no existe', async () => {
    const res = await request(app).get('/notes/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });
});

// Test del Ejercicio 4 
describe('Integración - PATCH /notes/:id (Ejercicio 4)', () => {
  it('actualiza solo title, sin tocar content', async () => {
    const app = makeApp(':memory:');
    
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Original', content: 'Contenido' });

    const res = await request(app)
      .patch(`/notes/${created.body.id}`)
      .send({ title: 'Nuevo título' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Nuevo título');
    expect(res.body.content).toBe('Contenido');
  });

  it('devuelve 404 si el id no existe', async () => {
    const app = makeApp(':memory:');
    const res = await request(app).patch('/notes/999').send({ title: 'X' });
    expect(res.status).toBe(404);
  });
});

// Test del Ejercicio 5- DeleteNote
describe('Integración - DELETE /notes/:id (Ejercicio 5)', () => {
  let app: Express;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 204 y la nota deja de existir', async () => {
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const res = await request(app).delete(`/notes/${created.body.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    const after = await request(app).get(`/notes/${created.body.id}`);
    expect(after.status).toBe(404);
  });

  it('devuelve 404 cuando el id no existe', async () => {
    const res = await request(app).delete('/notes/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });
});
