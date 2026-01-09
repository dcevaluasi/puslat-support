"use client";

import { useActivities } from '@/hooks/use-activities';
import { useEmployees } from '@/hooks/use-employees';
import { ActivityForm } from '@/components/employee/activity-form';
import { ActivityTable } from '@/components/employee/activity-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ClipboardList,
    Loader2,
    ArrowLeft,
    BarChart3,
    Briefcase,
    Coffee,
    HeartPulse,
    FileCheck,
    HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { ActivityStatus } from '@/types/employee';

const statusConfig: Record<ActivityStatus, { label: string; textColor: string; borderColor: string; icon: React.ElementType }> = {
    perjalanan_dinas: {
        label: 'Perjalanan Dinas',
        textColor: 'text-blue-700',
        borderColor: 'border-l-blue-500',
        icon: Briefcase,
    },
    cuti: {
        label: 'Cuti',
        textColor: 'text-sky-700',
        borderColor: 'border-l-sky-500',
        icon: Coffee,
    },
    sakit: {
        label: 'Sakit',
        textColor: 'text-indigo-700',
        borderColor: 'border-l-indigo-500',
        icon: HeartPulse,
    },
    izin: {
        label: 'Izin',
        textColor: 'text-violet-700',
        borderColor: 'border-l-violet-500',
        icon: FileCheck,
    },
    tanpa_keterangan: {
        label: 'Tanpa Keterangan',
        textColor: 'text-slate-700',
        borderColor: 'border-l-slate-500',
        icon: HelpCircle,
    },
};

export default function ActivitiesPage() {
    const { activities, loading: loadingActivities, create, update, remove } = useActivities();
    const { employees, loading: loadingEmployees } = useEmployees();

    if (loadingActivities || loadingEmployees) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    const statusCounts = activities.reduce((acc, activity) => {
        acc[activity.status] = (acc[activity.status] || 0) + 1;
        return acc;
    }, {} as Record<ActivityStatus, number>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100">
            <div className="container mx-auto py-12 px-8 max-w-[1600px]">
                <div className="mb-10">
                    <div className="flex gap-2 mb-6">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>

                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <ClipboardList className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Aktivitas Pegawai
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-16 text-lg">Kelola aktivitas dan status pegawai</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
                    {(Object.entries(statusConfig) as [ActivityStatus, typeof statusConfig[ActivityStatus]][]).map(([key, config]) => {
                        const count = statusCounts[key] || 0;
                        const IconComponent = config.icon;

                        return (
                            <Card key={key} className={`border-l-4 ${config.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                                <CardHeader className="pb-3 pt-6 px-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardDescription className={config.textColor}>{config.label}</CardDescription>
                                        <IconComponent className={`h-5 w-5 ${config.textColor}`} />
                                    </div>
                                    <CardTitle className={`text-3xl ${config.textColor}`}>{count}</CardTitle>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                {/* Activity Table */}
                <Card className="shadow-xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl">Daftar Aktivitas</CardTitle>
                                <CardDescription className="text-blue-100 mt-1">
                                    Kelola aktivitas pegawai Anda
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/dashboard/employee/activity">
                                    <Button
                                        type="submit"
                                        className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                        Lihat Dashboard
                                    </Button>
                                </Link>
                                <ActivityForm onSubmit={create} employees={employees} />
                            </div>
                        </div>

                    </CardHeader>
                    <CardContent className="p-6">
                        <ActivityTable
                            activities={activities}
                            employees={employees}
                            onUpdate={update}
                            onDelete={remove}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}