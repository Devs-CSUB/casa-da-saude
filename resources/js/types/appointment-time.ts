// types/appointment-time.ts

export enum AppointmentTimeEnum {
    TIME_08_00 = 1,
    TIME_08_30 = 2,
    TIME_09_00 = 3,
    TIME_09_30 = 4,
    TIME_10_00 = 5,
    TIME_10_30 = 6,
    TIME_11_00 = 7,
    TIME_11_30 = 8,
    TIME_12_00 = 9,
    TIME_12_30 = 10,
    TIME_13_00 = 11,
    TIME_13_30 = 12,
    TIME_14_00 = 13,
    TIME_14_30 = 14,
    TIME_15_00 = 15,
    TIME_15_30 = 16,
    TIME_16_00 = 17,
    TIME_16_30 = 18,
    TIME_17_00 = 19,
    TIME_17_30 = 20,
}

// Correspondente function para obter os valores como array (opcional)
export const AppointmentTimeEnumOptions = Object.values(AppointmentTimeEnum).filter((value) =>
    typeof value === "number"
);

// Map de valores para label
export const AppointmentTimeEnumLabels: Record<number, string> = {
    [AppointmentTimeEnum.TIME_08_00]: "08:00",
    [AppointmentTimeEnum.TIME_08_30]: "08:30",
    [AppointmentTimeEnum.TIME_09_00]: "09:00",
    [AppointmentTimeEnum.TIME_09_30]: "09:30",
    [AppointmentTimeEnum.TIME_10_00]: "10:00",
    [AppointmentTimeEnum.TIME_10_30]: "10:30",
    [AppointmentTimeEnum.TIME_11_00]: "11:00",
    [AppointmentTimeEnum.TIME_11_30]: "11:30",
    [AppointmentTimeEnum.TIME_12_00]: "12:00",
    [AppointmentTimeEnum.TIME_12_30]: "12:30",
    [AppointmentTimeEnum.TIME_13_00]: "13:00",
    [AppointmentTimeEnum.TIME_13_30]: "13:30",
    [AppointmentTimeEnum.TIME_14_00]: "14:00",
    [AppointmentTimeEnum.TIME_14_30]: "14:30",
    [AppointmentTimeEnum.TIME_15_00]: "15:00",
    [AppointmentTimeEnum.TIME_15_30]: "15:30",
    [AppointmentTimeEnum.TIME_16_00]: "16:00",
    [AppointmentTimeEnum.TIME_16_30]: "16:30",
    [AppointmentTimeEnum.TIME_17_00]: "17:00",
    [AppointmentTimeEnum.TIME_17_30]: "17:30",
};

// Lista completa para usar no React (value, label)
export const AppointmentTimeList = AppointmentTimeEnumOptions.map((value) => ({
    value: value as number,
    label: AppointmentTimeEnumLabels[value as number],
}));
