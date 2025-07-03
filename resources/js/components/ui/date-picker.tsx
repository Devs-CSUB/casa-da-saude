import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

type DatePickerProps = {
    selected: Date | null; // Data atualmente selecionada
    onChange: (date: Date | null) => void; // Callback acionado ao mudar a data
    placeholder?: string; // Placeholder do campo de texto
    minDate?: Date; // Data mínima permitida
    maxDate?: Date; // Data máxima permitida
    showTimeSelect?: boolean; // Mostra seleção de horário
    dateFormat?: string; // Formato da data
};

const DatePicker: React.FC<DatePickerProps> = ({
    selected,
    onChange,
    placeholder = 'Selecione uma data',
    minDate,
    maxDate,
    showTimeSelect = false,
    dateFormat = 'dd/MM/yyyy', // Formato padrão
}) => {
    return (
        <ReactDatePicker
            selected={selected}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            showTimeSelect={showTimeSelect}
            dateFormat={dateFormat}
            placeholderText={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
    );
};

export { DatePicker };
