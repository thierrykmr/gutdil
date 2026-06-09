import { DEAL_CATEGORIES, DEFAULT_IMAGE_URL } from '../../src/constants/index';

describe('constants', () => {
  it('exports deal categories', () => {
    expect(DEAL_CATEGORIES).toContain('Education');
    expect(DEAL_CATEGORIES).toContain('Tech');
    expect(DEAL_CATEGORIES.length).toBe(8);
  });

  it('exports default image url', () => {
    expect(DEFAULT_IMAGE_URL).toMatch(/^https:\/\//);
    expect(DEFAULT_IMAGE_URL).toContain('placehold.co');
  });
});
