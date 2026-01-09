"use client";

import { useState } from 'react';
import { Activity, ActivityStatus, Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityFormProps {
    onSubmit: (data: Omit<Activity, 'id'>) => Promise<void>;
    employees: Employee[];
    activity?: Activity;
    trigger?: React.ReactNode;
}

const statusOptions: { value: ActivityStatus; label: string; color: string }[] = [
    { value: 'perjalanan_dinas', label: 'Perjalanan Dinas', color: 'bg-blue-100 text-blue-700' },
    { value: 'cuti', label: 'Cuti', color: 'bg-sky-100 text-sky-700' },
    { value: 'sakit', label: 'Sakit', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'izin', label: 'Izin', color: 'bg-violet-100 text-violet-700' },
    { value: 'tanpa_keterangan', label: 'Tanpa Keterangan', color: 'bg-slate-100 text-slate-700' },
];

export function ActivityForm({ onSubmit, employees, activity, trigger }: ActivityFormProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
        employeeId: activity?.employeeId || '',
        employeeName: activity?.employeeName || '',
        status: activity?.status || 'tanpa_keterangan',
        tanggalDari: activity?.tanggalDari || new Date().toISOString().split('T')[0],
        tanggalSampai: activity?.tanggalSampai || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi tanggal
        if (new Date(formData.tanggalSampai) < new Date(formData.tanggalDari)) {
            toast.error('Tanggal sampai tidak boleh lebih kecil dari tanggal dari!');
            return;
        }

        try {
            const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
            await onSubmit({
                ...formData,
                employeeName: selectedEmployee?.nama || '',
            });
            toast.success(activity ? 'Aktivitas berhasil diupdate!' : 'Aktivitas berhasil ditambahkan!');
            setOpen(false);
            if (!activity) {
                setFormData({
                    employeeId: '',
                    employeeName: '',
                    status: 'tanpa_keterangan',
                    tanggalDari: new Date().toISOString().split('T')[0],
                    tanggalSampai: new Date().toISOString().split('T')[0],
                });
            }
        } catch (error) {
            toast.error('Gagal menyimpan data!');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Tambah Aktivitas
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activity ? 'bg-sky-100' : 'bg-blue-100'}`}>
                            {activity ? (
                                <Pencil className="h-5 w-5 text-sky-600" />
                            ) : (
                                <ClipboardList className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                            {activity ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-gray-700 font-medium">Pegawai</Label>
                        <Select
                            value={formData.employeeId}
                            onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                            required
                        >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 w-full">
                                <SelectValue placeholder="Pilih Pegawai" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id!}>
                                        {emp.nama} - {emp.nip}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: ActivityStatus) => setFormData({ ...formData, status: value })}
                            required
                        >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2 ">
                                            <div className={`px-2 py-1 rounded text-xs ${option.color}`}>
                                                {option.label}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tanggalDari" className="text-gray-700 font-medium">Tanggal Dari</Label>
                            <Input
                                id="tanggalDari"
                                type="date"
                                value={formData.tanggalDari}
                                onChange={(e) => setFormData({ ...formData, tanggalDari: e.target.value })}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggalSampai" className="text-gray-700 font-medium">Tanggal Sampai</Label>
                            <Input
                                id="tanggalSampai"
                                type="date"
                                value={formData.tanggalSampai}
                                onChange={(e) => setFormData({ ...formData, tanggalSampai: e.target.value })}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        <Save className="h-4 w-4" />
                        {activity ? 'Simpan Perubahan' : 'Tambah Aktivitas'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}