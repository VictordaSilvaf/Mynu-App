import { Input } from '@/components/ui/input';
import React from 'react';
import { useMaskInput } from 'use-mask-input';

type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>((props) => {
    const maskRef = useMaskInput({ mask: '(99) 99999-9999' });

    return <Input {...props} ref={maskRef} />;
});

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
