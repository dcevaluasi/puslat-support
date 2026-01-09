"use client";

import { Activity, ActivityStatus } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ActivityForm } from './activity-form';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Employee } from '@/types/employee';

interface ActivityTableProps {
    activities: Activity[];
    employees: Employee[];
    onUpdate: (id: string, data: Partial<Activity>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const statusConfig: Record<ActivityStatus, { label: string; color: string }> = {
    perjalanan_dinas: { label: 'Perjalanan Dinas', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    cuti: { label: 'Cuti', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    sakit: { label: 'Sakit', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    izin: { label: 'Izin', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    tanpa_keterangan: { label: 'Tanpa Keterangan', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export function ActivityTable({ activities, employees, onUpdate, onDelete }: ActivityTableProps) {
    const handleDelete = async (id: string, employeeName: string) => {
        try {
            await onDelete(id);
            toast.success('Berhasil!', {
                description: `Aktivitas ${employeeName} berhasil dihapus.`,
            });
        } catch (error) {
            toast.error('Gagal menghapus aktivitas!');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
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

    if (activities.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-sky-100 mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada aktivitas</h3>
                <p className="text-gray-500">Klik tombol Tambah Aktivitas untuk menambahkan data baru</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-sky-50">
                        <TableHead className="font-semibold text-gray-700">Nama Pegawai</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Periode</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium text-gray-900">{activity.employeeName}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={statusConfig[activity.status].color}>
                                    {statusConfig[activity.status].label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700">
                                {formatDateRange(activity.tanggalDari, activity.tanggalSampai)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <ActivityForm
                                        activity={activity}
                                        employees={employees}
                                        onSubmit={(data) => onUpdate(activity.id!, data)}
                                        trigger={
                                            <Button variant="outline" size="icon" className="border-sky-200 text-sky-600 hover:bg-sky-50">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="border-red-200 text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Aktivitas?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Anda yakin ingin menghapus aktivitas <strong>{activity.employeeName}</strong>?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(activity.id!, activity.employeeName || '')}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}