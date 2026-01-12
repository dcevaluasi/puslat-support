"use client";

import { useEmployees } from '@/hooks/use-employees';
import { useTeams } from '@/hooks/use-teams';
import { EmployeeForm } from '@/components/employee/employee-form';
import { EmployeeTable } from '@/components/employee/employee-table';
import { ImportExcel } from '@/components/employee/import-excel';
import { DeleteAll } from '@/components/employee/delete-all';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader2, ClipboardList, Users2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const { employees, loading, create, update, remove, bulkImport, deleteAll } = useEmployees();
    const { teams, loading: teamsLoading } = useTeams();

    if (loading || teamsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto" />
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg shadow-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                Data Pegawai
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-14">Kelola informasi pegawai dengan mudah</p>
                    </div>
                    <Link href="/management/employee/activity">
                        <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                            <ClipboardList className="h-4 w-4" />
                            Kelola Aktivitas
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-cyan-700">Total Pegawai</CardDescription>
                            <CardTitle className="text-3xl text-cyan-600">
                                {employees.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-teal-700">Golongan Unik</CardDescription>
                            <CardTitle className="text-3xl text-teal-600">
                                {new Set(employees.map(e => e.golongan)).size}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-blue-700">Pangkat Unik</CardDescription>
                            <CardTitle className="text-3xl text-blue-600">
                                {new Set(employees.map(e => e.pangkat)).size}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-purple-700 flex items-center gap-2">
                                <Users2 className="h-4 w-4" />
                                Total Tim Kerja
                            </CardDescription>
                            <CardTitle className="text-3xl text-purple-600">
                                {teams.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-t-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-4">
                            <div>
                                <CardTitle className="text-2xl">Daftar Pegawai</CardTitle>
                                <CardDescription className="text-cyan-100 mt-1">
                                    Kelola data pegawai Anda
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <ImportExcel onImport={bulkImport} teams={teams} />
                                <DeleteAll onDeleteAll={deleteAll} count={employees.length} />
                                <EmployeeForm onSubmit={create} teams={teams} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <EmployeeTable employees={employees} onUpdate={update} onDelete={remove} teams={teams} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}