import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:4000';

test.beforeEach(async ({}, testInfo) => {
  // Playwright test lifecycle - reset and seed before each test
  const ctx = await testInfo.request.newContext({ baseURL });
  await ctx.post('/__test__/reset');
  await ctx.post('/__test__/seed');
  await ctx.dispose();
});

test('debería listar las notas sembradas correctamente (happy path)', async () => {
  const ctx = await testInfo.request.newContext({ baseURL });
  const res = await ctx.get('/notes');
  expect(res.status()).toBe(200);
  const data = await res.json();
  // resetAndSeed deja 2 notas, así que deberíamos tener al menos 2
  expect(data).toHaveLength(2);
  expect(data[0].title).toBeDefined();
  expect(data[1].title).toBeDefined();
  await ctx.dispose();
});

test('debería regresar 404 al buscar una nota que no existe (caso de error)', async () => {
  const ctx = await testInfo.request.newContext({ baseURL });
  const res = await ctx.get('/notes/999');
  expect(res.status()).toBe(404);
  const body = await res.json();
  expect(body.error).toBe('NotFound');
  await ctx.dispose();
});