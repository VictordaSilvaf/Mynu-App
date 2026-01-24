import AppLogoI from '@/assets/images/logo.png';
import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img src={AppLogoI} alt="Mynu Logo" className="h-full w-auto" />
    );
}
