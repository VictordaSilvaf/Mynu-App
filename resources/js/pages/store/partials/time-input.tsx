import { Input } from '@/components/ui/input';
import React from 'react';
import { useMaskInput } from 'use-mask-input';

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
    const maskRef = useMaskInput({ mask: '99:99' });

    return (
        <div className="flex flex-col space-y-0.5 justify-end items-end col-span-2 md:col-span-1 ">
            <label className="text-xs font-medium text-zinc-500">{props.label}</label>
            <Input
                {...props}
                ref={maskRef}
                placeholder="HH:MM"
                pattern="[0-2][0-9]:[0-5][0-9]"
                type="text"
            />
        </div>
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
