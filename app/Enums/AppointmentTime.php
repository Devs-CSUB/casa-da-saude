<?php

namespace App\Enums;

enum AppointmentTime: int
{
    case TIME_08_00 = 1;
    case TIME_08_30 = 2;
    case TIME_09_00 = 3;
    case TIME_09_30 = 4;
    case TIME_10_00 = 5;
    case TIME_10_30 = 6;
    case TIME_11_00 = 7;
    case TIME_11_30 = 8;
    case TIME_12_00 = 9;
    case TIME_12_30 = 10;
    case TIME_13_00 = 11;
    case TIME_13_30 = 12;
    case TIME_14_00 = 13;
    case TIME_14_30 = 14;
    case TIME_15_00 = 15;
    case TIME_15_30 = 16;
    case TIME_16_00 = 17;
    case TIME_16_30 = 18;
    case TIME_17_00 = 19;
    case TIME_17_30 = 20;

    /**
     * Get all times as an array.
     */
    public static function all(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get label for display purposes.
     */
    public function label(): string
    {
        return match($this) {
            self::TIME_08_00 => '08:00',
            self::TIME_08_30 => '08:30',
            self::TIME_09_00 => '09:00',
            self::TIME_09_30 => '09:30',
            self::TIME_10_00 => '10:00',
            self::TIME_10_30 => '10:30',
            self::TIME_11_00 => '11:00',
            self::TIME_11_30 => '11:30',
            self::TIME_12_00 => '12:00',
            self::TIME_12_30 => '12:30',
            self::TIME_13_00 => '13:00',
            self::TIME_13_30 => '13:30',
            self::TIME_14_00 => '14:00',
            self::TIME_14_30 => '14:30',
            self::TIME_15_00 => '15:00',
            self::TIME_15_30 => '15:30',
            self::TIME_16_00 => '16:00',
            self::TIME_16_30 => '16:30',
            self::TIME_17_00 => '17:00',
            self::TIME_17_30 => '17:30',
        };
    }
}
