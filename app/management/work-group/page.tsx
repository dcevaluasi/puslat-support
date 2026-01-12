"use client";

import { TeamForm } from '@/components/team/team-form';
import { TeamTable } from '@/components/team/team-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeams } from '@/hooks/use-teams';
import { Users2, Loader2 } from 'lucide-react';

export default function TeamPage() {
    const { teams, loading, create, update, remove } = useTeams();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto" />
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50">
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-linear-to-br from-cyan-500 to-teal-600 rounded-lg shadow-lg">
                            <Users2 className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            Data Tim Kerja
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-14">Kelola informasi tim kerja dengan mudah</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-cyan-700">Total Tim</CardDescription>
                            <CardTitle className="text-3xl text-cyan-600">
                                {teams.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-teal-700">Tim Aktif</CardDescription>
                            <CardTitle className="text-3xl text-teal-600">
                                {teams.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader className="bg-linear-to-r from-cyan-500 to-teal-600 text-white rounded-t-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-3">
                            <div>
                                <CardTitle className="text-2xl">Daftar Tim Kerja</CardTitle>
                                <CardDescription className="text-cyan-100 mt-1">
                                    Kelola data tim kerja Anda
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <TeamForm onSubmit={create} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2">
                        <TeamTable teams={teams} onUpdate={update} onDelete={remove} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}