import AppLogoIcon from '@/assets/images/logo.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-transparent">
                <img src={AppLogoIcon} alt="Mynu Logo" className="h-full w-auto" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold uppercase">
                    Mynu
                </span>
            </div>
        </>
    );
}
