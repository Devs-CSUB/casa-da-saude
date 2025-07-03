<?php

namespace App\Enums;

/**
 * Enum para o Status do Agendamento.
 */
enum AppointmentStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case CANCELED = 'canceled';
    case COMPLETED = 'completed';

    /**
     * Retorna a etiqueta legível para o status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::PAID => 'Pago',
            self::CANCELED => 'Cancelado',
            self::COMPLETED => 'Concluído',
        };
    }

    /**
     * Retorna um array com os nomes de todos os casos do enum.
     *
     * @return array<int, string>
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Retorna um array com os valores de todos os casos do enum.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Retorna uma representação em array, ideal para selects de formulário.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function toArray(string $key = 'value', string $value = 'label'): array
    {
        return array_map(
            fn (self $option) => [
                $key => $option->value,
                $value => $option->label(),
            ],
            self::cases()
        );
    }
}
