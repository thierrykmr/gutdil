import { db, auth, storage, analytics, logEvent } from '../src/__mocks__/firebaseConfig';

describe('firebaseConfig (mocked)', () => {
  it('exports firebase services for tests', () => {
    expect(db).toBeDefined();
    expect(auth).toBeDefined();
    expect(storage).toBeDefined();
    expect(analytics).toBeDefined();
    expect(typeof logEvent).toBe('function');
  });
});
