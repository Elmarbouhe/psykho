import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodSelector } from './mood-selector';
import { Mood } from '@prisma/client';

// Mock useTranslation
vi.mock('@/components/providers/language-provider', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('MoodSelector', () => {
    it('renders all mood buttons', () => {
        render(<MoodSelector onSelect={() => { }} />);

        expect(screen.getByText('dashboard.mood.joyful')).toBeDefined();
        expect(screen.getByText('dashboard.mood.calm')).toBeDefined();
        expect(screen.getByText('dashboard.mood.sad')).toBeDefined();
        expect(screen.getByText('dashboard.mood.anxious')).toBeDefined();
    });

    it('calls onSelect when a button is clicked', () => {
        const onSelect = vi.fn();
        render(<MoodSelector onSelect={onSelect} />);

        const joyfulBtn = screen.getByText('dashboard.mood.joyful');
        fireEvent.click(joyfulBtn);

        expect(onSelect).toHaveBeenCalledWith(Mood.JOYFUL);
    });
});
