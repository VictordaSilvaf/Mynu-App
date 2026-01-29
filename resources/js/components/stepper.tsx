import { Check } from "lucide-react";


export default function Stepper({ step, steps, setStep }: { step: number; steps: string[]; setStep: (step: number) => void }) {
    return (
        <div className="flex items-center gap-2 justify-between divide-solid">
            {steps.map((label, index) => (
                <>
                    <div key={index} className="flex items-center gap-2">
                        <div
                            onClick={() => setStep(index)}
                            className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs transition
                            ${index === step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 cursor-pointer'}
                        `}
                        >
                            {index === step ? (<Check className="w-4 h-4" />) : index + 1}
                        </div>
                        {index === step &&
                            <span className={`text-xs whitespace-nowrap ${index === step ? 'font-semibold text-primary' : 'text-gray-600'}`}>
                                {label}
                            </span>
                        }
                    </div>

                    {index < steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                    )}
                </>
            ))}
        </div>
    );
}