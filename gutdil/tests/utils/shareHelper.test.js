import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shareDeal } from '../../src/utils/shareHelper';

describe('shareDeal', () => {
  const mockDeal = {
    id: '123',
    title: 'Super Deal',
    description: 'Une super description'
  };

  const mockSetAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurer le mock global pour navigator et window
    vi.stubGlobal('navigator', {
      share: undefined,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
    
    vi.stubGlobal('window', {
      location: {
        origin: 'http://localhost:3000'
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('copies URL to clipboard if navigator.share is not supported', async () => {
    await shareDeal(mockDeal, mockSetAlert);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/deals/123');
    expect(mockSetAlert).toHaveBeenCalledWith('Lien du bon plan copié dans le presse-papiers !', 'success');
  });

  it('uses navigator.share if supported', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share: mockShare,
      clipboard: {
        writeText: vi.fn()
      }
    });

    await shareDeal(mockDeal, mockSetAlert);

    expect(mockShare).toHaveBeenCalledWith({
      title: 'Super Deal',
      text: 'Une super description',
      url: 'http://localhost:3000/deals/123'
    });
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('falls back to clipboard if navigator.share throws a non-AbortError', async () => {
    const mockShare = vi.fn().mockRejectedValue(new Error('Share error'));
    vi.stubGlobal('navigator', {
      share: mockShare,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });

    await shareDeal(mockDeal, mockSetAlert);

    expect(mockShare).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/deals/123');
    expect(mockSetAlert).toHaveBeenCalledWith('Lien du bon plan copié dans le presse-papiers !', 'success');
  });

  it('does not fall back or alert if navigator.share throws AbortError', async () => {
    const abortError = new Error('Share cancelled');
    abortError.name = 'AbortError';
    const mockShare = vi.fn().mockRejectedValue(abortError);
    
    vi.stubGlobal('navigator', {
      share: mockShare,
      clipboard: {
        writeText: vi.fn()
      }
    });

    await shareDeal(mockDeal, mockSetAlert);

    expect(mockShare).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(mockSetAlert).not.toHaveBeenCalled();
  });
});
