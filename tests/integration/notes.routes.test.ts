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