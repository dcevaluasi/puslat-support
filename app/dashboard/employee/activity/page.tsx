"use client";

import { useActivities } from '@/hooks/use-activities';
import { useEmployees } from '@/hooks/use-employees';
import { useTeams } from '@/hooks/use-teams';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    HelpCircle,
    Users2
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
        color: 'bg-rose-100 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        icon: HeartPulse,
        gradient: 'from-rose-500 to-rose-600'
    },
    izin: {
        label: 'Izin',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        barColor: 'bg-amber-500',
        icon: FileCheck,
        gradient: 'from-amber-500 to-amber-600'
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
    const { teams, loading: loadingTeams } = useTeams();
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [selectedTeam, setSelectedTeam] = useState<string>("all");

    const filteredActivities = useMemo(() => {
        let filtered = activities;

        // Filter by date
        if (startDate) {
            const filterDate = new Date(startDate);
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(activity => {
                const activityStart = new Date(activity.tanggalDari);
                const activityEnd = new Date(activity.tanggalSampai);
                activityStart.setHours(0, 0, 0, 0);
                activityEnd.setHours(0, 0, 0, 0);
                return filterDate >= activityStart && filterDate <= activityEnd;
            });
        }

        // Filter by team
        if (selectedTeam !== "all") {
            const teamEmployeeIds = employees
                .filter(emp => emp.timKerjaId === selectedTeam)
                .map(emp => emp.id);
            filtered = filtered.filter(activity => teamEmployeeIds.includes(activity.employeeId));
        }

        return filtered;
    }, [activities, startDate, selectedTeam, employees]);

    const stats = useMemo(() => {
        const statusCounts = filteredActivities.reduce((acc, activity) => {
            acc[activity.status] = (acc[activity.status] || 0) + 1;
            return acc;
        }, {} as Record<ActivityStatus, number>);

        const totalActivities = filteredActivities.length;
        const activeEmployeeIds = new Set(filteredActivities.map(a => a.employeeId));

        // Calculate team stats
        const teamStats = teams.map(team => {
            const teamEmployees = employees.filter(emp => emp.timKerjaId === team.id);
            const teamEmployeeIds = teamEmployees.map(emp => emp.id);
            const teamActivities = filteredActivities.filter(act => teamEmployeeIds.includes(act.employeeId));
            const activeInTeam = teamActivities.length;
            const totalInTeam = teamEmployees.length;

            return {
                teamId: team.id,
                teamName: team.nama,
                total: totalInTeam,
                active: activeInTeam,
                available: totalInTeam - activeInTeam
            };
        });

        let relevantEmployees = employees;
        if (selectedTeam !== "all") {
            relevantEmployees = employees.filter(emp => emp.timKerjaId === selectedTeam);
        }

        return {
            statusCounts,
            totalActivities,
            activeEmployees: relevantEmployees.length - activeEmployeeIds.size,
            totalEmployees: relevantEmployees.length,
            teamStats
        };
    }, [filteredActivities, employees, teams, selectedTeam]);

    const recentActivities = useMemo(() => {
        return [...filteredActivities]
            .sort((a, b) => new Date(b.tanggalDari).getTime() - new Date(a.tanggalDari).getTime());
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
        setSelectedTeam("all");
    };

    if (loadingActivities || loadingEmployees || loadingTeams) {
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
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
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
                            <CardTitle className="text-xl">Filter Data</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8 px-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                            <div className="space-y-3">
                                <Label htmlFor="team" className="text-base font-medium text-gray-700">Tim Kerja</Label>
                                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                                    <SelectTrigger className="border-gray-300 w-full focus:border-blue-500 py-5">
                                        <SelectValue placeholder="Semua Tim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tim</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id}>
                                                {team.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={resetFilter}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 h-11"
                            >
                                Reset Filter
                            </Button>
                        </div>
                        {(startDate || selectedTeam !== "all") && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">
                                    <strong>Filter Aktif:</strong>{' '}
                                    {startDate && `Tanggal: ${formatDate(startDate)}`}
                                    {startDate && selectedTeam !== "all" && ' | '}
                                    {selectedTeam !== "all" && `Tim: ${teams.find(t => t.id === selectedTeam)?.nama}`}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
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
                                    <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Total</p>
                                        <p className="text-3xl font-bold text-sky-600">{stats.activeEmployees}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Pegawai Di Kantor</p>
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
                                        <p className="text-3xl font-bold text-indigo-600">{stats.totalEmployees}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Seluruh Pegawai</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>



                {/* Status Cards */}
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

                {/* Team Stats */}
                <Card className="mb-10 shadow-xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8">
                        <div className="flex items-center gap-2">
                            <Users2 className="h-5 w-5" />
                            <CardTitle className="text-xl">Statistik Per Tim Kerja</CardTitle>
                        </div>
                        <CardDescription className="text-blue-100">
                            Status ketersediaan pegawai di setiap tim
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8 px-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.teamStats.map((team) => (
                                <div key={team.teamId} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {team.total} Pegawai
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Di Kantor</span>
                                            <span className="font-semibold text-green-600">{team.available}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Di Luar Kantor</span>
                                            <span className="font-semibold text-orange-600">{team.active}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                                                style={{ width: `${team.total > 0 ? (team.available / team.total * 100) : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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
                    <Card className="shadow-xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8">
                            <CardTitle className="text-xl">Aktivitas Pegawai</CardTitle>
                            <CardDescription className="text-blue-100">
                                Daftar aktivitas terbaru
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
                                        const employee = employees.find(e => e.id === activity.employeeId);
                                        const team = employee?.timKerjaId ? teams.find(t => t.id === employee.timKerjaId) : null;
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
                                                    {team && (
                                                        <p className="text-xs text-purple-600 font-medium">{team.nama}</p>
                                                    )}
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