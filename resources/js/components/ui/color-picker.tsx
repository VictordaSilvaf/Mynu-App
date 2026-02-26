'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Circle from '@uiw/react-color-circle';
import { type ColorResult } from '@uiw/color-convert';

const PRESET_COLORS = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
    '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107',
    '#ff9800', '#ff5722', '#795548', '#607d8b', '#000000', '#ffffff', '#f8fafc',
    '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155',
    '#1e293b', '#0f172a', '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#ef4444',
    '#dc2626', '#b91c1c', '#7f1d1d', '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74',
    '#fb923c', '#f97316', '#ea580c', '#c2410c', '#ecfdf5', '#d1fae5', '#a7f3d0',
    '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#f0fdf4', '#dcfce7',
    '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#eff6ff',
    '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8',
    '#7c3aed', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#e11d48', '#be123c',
    '#0d9488', '#0f766e', '#14532d', '#166534', '#4d7c0f', '#65a30d', '#84cc16',
    '#eab308', '#ca8a04', '#a16207', '#713f12', '#422006', '#1c1917', '#292524',
    '#44403c', '#57534e', '#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4', '#f5f5f4',
    '#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc',
    '#1e3a5f', '#1e40af', '#3730a3', '#5b21b6', '#6b21a8', '#86198f', '#9d174d',
];

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
}

const HEX_REGEX = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function toHex(hex: string): string {
    const match = HEX_REGEX.exec(hex ?? '');
    if (!match) {
        return '#000000';
    }
    const v = match[1];
    if (v.length === 3) {
        return '#' + v[0] + v[0] + v[1] + v[1] + v[2] + v[2];
    }
    return '#' + v;
}

export function ColorPicker({ color, onChange, className }: Readonly<ColorPickerProps>) {
    const displayColor = toHex(color || '#000000');

    const handleColorChange = (result: ColorResult) => {
        const hex = result?.hex ?? displayColor;
        onChange(toHex(hex));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${className}`}
                >
                    <div className="flex w-full items-center gap-2">
                        <div
                            className="h-4 w-4 shrink-0 rounded border border-border"
                            style={{ background: displayColor }}
                        />
                        <span className="flex-1 truncate text-xs">{displayColor}</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
                <Circle
                    colors={PRESET_COLORS}
                    color={displayColor}
                    className="max-w-52!"
                    onChange={handleColorChange}
                />
            </PopoverContent>
        </Popover>
    );
}
