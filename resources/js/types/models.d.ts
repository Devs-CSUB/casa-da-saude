import { User } from "./index";

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name?: string;
    guard?: string;
}

export interface Module {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Area {
    id: number;
    name: string;
}

export interface AppointmentItem {
    id: number;
    appointment_id: number;
    procedure_id: number;
    professional_id: number;
    value: string;

    [key: string]: unknown;
}

export interface ScheduleItem {
    id: number;
    schedule_id: number;
    appointment_time: string;
    appointment_item_id: number | null;

    // Relacionamentos opcionais
    schedule?: Schedule;
    appointment_item?: AppointmentItem;

    [key: string]: unknown;
}

export interface Schedule {
    id: number;
    professional_id: number;
    date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    professional?: User;
    items?: ScheduleItem[];

    [key: string]: unknown;
}

export interface Category {
    id: number;
    area_id: number;
    name: string;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}

export interface Procedure {
    id: number;
    category_id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    is_active: boolean;

    category?: Category;

    [key: string]: unknown;
}

export interface Patient {
    id: number;
    name: string;
    cpf: string;
    birth: string;
    phone: string;
    email: string;
    notes: string | undefined;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}


export interface AppointmentItem {
    id: number;
    value: number;
    appointment_id: number;
    procedure: Procedure;
    professional: User;
}

export interface Appointment {
    id: number;
    date: string;
    total: number;
    status: 'pending' | 'paid' | 'canceled' | 'completed';
    status_label: string;
    patient: Patient;
    items: AppointmentItem[];
    created_at: string;
    updated_at: string;
}
