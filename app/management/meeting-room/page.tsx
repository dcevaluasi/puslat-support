"use client";

import { useRuangRapat } from '@/hooks/use-meeting-room';
import { MeetingRoomForm } from '@/components/meeting-room/meeting-room-form';
import { MeetingRoomCard } from '@/components/meeting-room/meeting-room-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorOpen, Loader2, ArrowLeft, Calendar, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function MeetingRoomPage() {
    const { ruangRapats, loading, create, update, remove } = useRuangRapat();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-sky-100">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    const stats = {
        total: ruangRapats.length,
        tersedia: ruangRapats.filter(r => r.status === 'Tersedia').length,
        tidakTersedia: ruangRapats.filter(r => r.status === 'Tidak Tersedia').length,
        dalamPerbaikan: ruangRapats.filter(r => r.status === 'Dalam Perbaikan').length,
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-sky-100">
            <div className="container mx-auto py-12 px-8 max-w-[1600px]">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <DoorOpen className="h-7 w-7 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                    Ruang Rapat
                                </h1>
                            </div>
                            <p className="text-gray-600 ml-16 text-lg">Kelola ruang rapat Puslat KP</p>
                        </div>
                        <MeetingRoomForm onSubmit={create} />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 pt-6 px-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-blue-700">Total Ruang</CardDescription>
                                <Calendar className="h-5 w-5 text-blue-700" />
                            </div>
                            <CardTitle className="text-3xl text-blue-600">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 pt-6 px-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-green-700">Tersedia</CardDescription>
                                <CheckCircle className="h-5 w-5 text-green-700" />
                            </div>
                            <CardTitle className="text-3xl text-green-600">{stats.tersedia}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 pt-6 px-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-red-700">Tidak Tersedia</CardDescription>
                                <AlertCircle className="h-5 w-5 text-red-700" />
                            </div>
                            <CardTitle className="text-3xl text-red-600">{stats.tidakTersedia}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 pt-6 px-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-yellow-700">Dalam Perbaikan</CardDescription>
                                <Wrench className="h-5 w-5 text-yellow-700" />
                            </div>
                            <CardTitle className="text-3xl text-yellow-600">{stats.dalamPerbaikan}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Cards Grid */}
                {ruangRapats.length === 0 ? (
                    <Card className="shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <DoorOpen className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada ruang rapat</h3>
                            <p className="text-gray-500 mb-4">Klik tombol Tambah Ruang Rapat untuk menambahkan data baru</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ruangRapats.map((ruangRapat) => (
                            <MeetingRoomCard
                                key={ruangRapat.id}
                                ruangRapat={ruangRapat}
                                onUpdate={update}
                                onDelete={remove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}