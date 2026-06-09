import { generateSearchIndex } from '../../src/utils/searchHelper';

describe('generateSearchIndex', () => {
  it('returns unique keywords from title and description', () => {
    const result = generateSearchIndex(
      'Formation React avancée',
      'Apprenez React avec des exercices pratiques'
    );
    expect(result).toContain('formation');
    expect(result).toContain('react');
    expect(result).toContain('avancée');
    expect(result).toContain('apprenez');
    expect(new Set(result).size).toBe(result.length);
  });

  it('filters stop words and short words', () => {
    const result = generateSearchIndex('Le deal du jour', 'Un bon plan');
    expect(result).not.toContain('le');
    expect(result).not.toContain('du');
    expect(result).not.toContain('un');
    expect(result).not.toContain('deal');
  });

  it('handles empty inputs', () => {
    expect(generateSearchIndex()).toEqual([]);
    expect(generateSearchIndex('', '')).toEqual([]);
  });

  it('strips punctuation', () => {
    const result = generateSearchIndex('Hello, world!', 'Test.');
    expect(result).toContain('hello');
    expect(result).toContain('world');
    expect(result).toContain('test');
  });
});
