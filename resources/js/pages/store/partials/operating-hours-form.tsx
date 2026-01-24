
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { OperatingHours } from '@/types';
import TimeInput from './time-input';

type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

const daysOfWeek: { id: DayOfWeek; name: string }[] = [
    { id: 'seg', name: 'Segunda-feira' },
    { id: 'ter', name: 'Terça-feira' },
    { id: 'qua', name: 'Quarta-feira' },
    { id: 'qui', name: 'Quinta-feira' },
    { id: 'sex', name: 'Sexta-feira' },
    { id: 'sab', name: 'Sábado' },
    { id: 'dom', name: 'Domingo' },
];

interface OperatingHoursFormProps {
    operatingHours: OperatingHours;
    setData: (
        key: 'operating_hours',
        value: OperatingHours,
    ) => void;
}

export default function OperatingHoursForm({ operatingHours, setData }: OperatingHoursFormProps) {
    const handleTimeChange = (day: DayOfWeek, type: 'open' | 'close', value: string) => {
        setData('operating_hours', {
            ...operatingHours,
            [day]: { ...operatingHours[day], [type]: value },
        });
    };

    const handleOpenToggle = (day: DayOfWeek, checked: boolean) => {
        setData('operating_hours', {
            ...operatingHours,
            [day]: { ...operatingHours[day], isOpen: checked },
        });
    };

    return (
        <div className="space-y-4">
            {daysOfWeek.map((day) => (
                <div key={day.id} className="grid grid-cols-4 items-center gap-4">
                    <div className="flex items-center gap-2 col-span-full md:col-span-1">
                        <Checkbox
                            id={`is_open_${day.id}`}
                            checked={operatingHours[day.id]?.isOpen ?? false}
                            onCheckedChange={(checked) => handleOpenToggle(day.id, !!checked)}
                        />
                        <Label htmlFor={`is_open_${day.id}`} className="font-medium">
                            {day.name}
                        </Label>
                    </div>
                    <TimeInput
                        label="Abertura"
                        value={operatingHours[day.id]?.open ?? ''}
                        onChange={(e) => handleTimeChange(day.id, 'open', e.target.value)}
                        disabled={!operatingHours[day.id]?.isOpen}
                    />
                    <TimeInput
                        label="Fechamento"
                        value={operatingHours[day.id]?.close ?? ''}
                        onChange={(e) => handleTimeChange(day.id, 'close', e.target.value)}
                        disabled={!operatingHours[day.id]?.isOpen}
                    />
                </div>
            ))}
        </div>
    );
}
