"use client";

import { useActivities } from '@/hooks/use-activities';
import { useEmployees } from '@/hooks/use-employees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Loader2,
    ArrowLeft,
    CalendarDays,
    Users,
    TrendingUp,
    Filter,
    Briefcase,
    Coffee,
    HeartPulse,
    FileCheck,
    HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { ActivityStatus } from '@/types/employee';

const statusConfig: Record<ActivityStatus, { label: string; color: string; barColor: string; icon: React.ElementType; gradient: string }> = {
    perjalanan_dinas: {
        label: 'Perjalanan Dinas',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        barColor: 'bg-blue-500',
        icon: Briefcase,
        gradient: 'from-blue-500 to-blue-600'
    },
    cuti: {
        label: 'Cuti',
        color: 'bg-sky-100 text-sky-700 border-sky-200',
        barColor: 'bg-sky-500',
        icon: Coffee,
        gradient: 'from-sky-500 to-sky-600'
    },
    sakit: {
        label: 'Sakit',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        barColor: 'bg-indigo-500',
        icon: HeartPulse,
        gradient: 'from-indigo-500 to-indigo-600'
    },
    izin: {
        label: 'Izin',
        color: 'bg-violet-100 text-violet-700 border-violet-200',
        barColor: 'bg-violet-500',
        icon: FileCheck,
        gradient: 'from-violet-500 to-violet-600'
    },
    tanpa_keterangan: {
        label: 'Tanpa Keterangan',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        barColor: 'bg-slate-500',
        icon: HelpCircle,
        gradient: 'from-slate-500 to-slate-600'
    },
};

export default function DashboardPage() {
    const { activities, loading: loadingActivities } = useActivities();
    const { employees, loading: loadingEmployees } = useEmployees();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredActivities = useMemo(() => {
        if (!startDate && !endDate) return activities;

        return activities.filter(activity => {
            const activityStart = new Date(activity.tanggalDari);
            const activityEnd = new Date(activity.tanggalSampai);
            const filterStart = startDate ? new Date(startDate) : null;
            const filterEnd = endDate ? new Date(endDate) : null;

            if (filterStart && filterEnd) {
                return activityStart <= filterEnd && activityEnd >= filterStart;
            } else if (filterStart) {
                return activityEnd >= filterStart;
            } else if (filterEnd) {
                return activityStart <= filterEnd;
            }
            return true;
        });
    }, [activities, startDate, endDate]);

    const stats = useMemo(() => {
        const statusCounts = filteredActivities.reduce((acc, activity) => {
            acc[activity.status] = (acc[activity.status] || 0) + 1;
            return acc;
        }, {} as Record<ActivityStatus, number>);

        const totalActivities = filteredActivities.length;

        return {
            statusCounts,
            totalActivities,
            activeEmployees: employees.length - new Set(filteredActivities.map(a => a.employeeId)).size,
        };
    }, [filteredActivities]);

    const recentActivities = useMemo(() => {
        return [...filteredActivities]
            .sort((a, b) => new Date(b.tanggalDari).getTime() - new Date(a.tanggalDari).getTime())
    }, [filteredActivities]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateRange = (dari: string, sampai: string) => {
        if (dari === sampai) {
            return formatDate(dari);
        }
        return `${formatDate(dari)} - ${formatDate(sampai)}`;
    };

    const resetFilter = () => {
        setStartDate('');
        setEndDate('');
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100">
            <div className="container mx-auto py-12 px-8 max-w-[1600px]">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Dashboard Aktivitas Pegawai Puslat KP
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-16 text-lg">Analisis dan statistik aktivitas pegawai</p>
                </div>

                {/* Filter Section */}
                <Card className="mb-10 shadow-xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            <CardTitle className="text-xl">Filter Berdasarkan Tanggal</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8 px-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div className="space-y-3">
                                <Label htmlFor="startDate" className="text-base font-medium text-gray-700">Tanggal</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500 h-11"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={resetFilter}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 h-11"
                            >
                                Reset Filter
                            </Button>
                        </div>
                        {startDate && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">
                                    <strong>Filter Aktif:</strong> {formatDate(startDate)}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats - Modern Glass Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                        <Card className="relative bg-white/90 backdrop-blur border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                        <CalendarDays className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Total</p>
                                        <p className="text-3xl font-bold text-blue-600">{stats.totalActivities}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Pegawai Di Luar Kantor</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                        <Card className="relative bg-white/90 backdrop-blur border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-linear-to-br from-sky-500 to-sky-600 rounded-xl">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Total</p>
                                        <p className="text-3xl font-bold text-sky-600">{stats.activeEmployees}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Pegawai Di  Kantor</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                        <Card className="relative bg-white/90 backdrop-blur border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Total</p>
                                        <p className="text-3xl font-bold text-indigo-600">{employees.length}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Seluruh Pegawai</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Status Cards - Modern Minimal Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    {(Object.entries(statusConfig) as [ActivityStatus, typeof statusConfig[ActivityStatus]][]).map(([key, config]) => {
                        const count = stats.statusCounts[key] || 0;
                        const percentage = stats.totalActivities > 0
                            ? ((count / stats.totalActivities) * 100).toFixed(0)
                            : 0;
                        const IconComponent = config.icon;

                        return (
                            <Card key={key} className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all group">
                                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                                <CardContent className="p-5 relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                                            <IconComponent className="h-4 w-4 text-white" />
                                        </div>
                                        <Badge variant="outline" className="text-xs font-semibold border-0 bg-white shadow-sm">
                                            {percentage}%
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                                        <p className="text-xs text-gray-600 font-medium line-clamp-1">{config.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Status Chart */}
                    <Card className="shadow-xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8">
                            <CardTitle className="text-xl">Statistik Status</CardTitle>
                            <CardDescription className="text-blue-100">
                                Distribusi status aktivitas pegawai
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 pb-8 px-8 bg-white">
                            <div className="space-y-5">
                                {(Object.entries(statusConfig) as [ActivityStatus, typeof statusConfig[ActivityStatus]][]).map(([key, config]) => {
                                    const count = stats.statusCounts[key] || 0;
                                    const percentage = stats.totalActivities > 0
                                        ? (count / stats.totalActivities * 100).toFixed(1)
                                        : 0;
                                    const IconComponent = config.icon;

                                    return (
                                        <div key={key} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded bg-gradient-to-br ${config.gradient}`}>
                                                        <IconComponent className="h-3.5 w-3.5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-gray-700 text-sm">{config.label}</span>
                                                </div>
                                                <span className="text-sm text-gray-600 font-semibold">{count} <span className="text-gray-400">({percentage}%)</span></span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500 rounded-full`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="shadow-xl border-0 overflow-scroll">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8">
                            <CardTitle className="text-xl">Aktivitas Pegawai</CardTitle>
                            <CardDescription className="text-blue-100">
                                Daftar Aktivitas terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6 px-6 bg-white">
                            {recentActivities.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    Tidak ada aktivitas
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                                    {recentActivities.map((activity) => {
                                        const IconComponent = statusConfig[activity.status].icon;
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                                            >
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${statusConfig[activity.status].gradient} flex-shrink-0`}>
                                                    <IconComponent className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">{activity.employeeName}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {formatDateRange(activity.tanggalDari, activity.tanggalSampai)}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className={`${statusConfig[activity.status].color} text-xs whitespace-nowrap`}>
                                                    {statusConfig[activity.status].label}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}