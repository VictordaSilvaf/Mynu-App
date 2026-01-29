'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Circle from '@uiw/react-color-circle';
import { ColorResult, hsvaToHex } from '@uiw/color-convert';
import { useState } from 'react';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
    const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
    const handleColorChange = (color: ColorResult) => {
        onChange(color.hex);
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
                            className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                            style={{ background: color }}
                        />
                        <div className="flex-1 truncate">{color}</div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <Circle
                    colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b', '#000000']}
                    color={hsva}
                    className='max-w-52!'
                    onChange={(color) => {
                        setHsva(color.hsva);
                        handleColorChange(color);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
