"use client";

import { useState } from 'react';
import { Employee } from '@/types/employee';
import { Team } from '@/hooks/use-teams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeFormProps {
    onSubmit: (data: Omit<Employee, 'id'>) => Promise<void>;
    employee?: Employee;
    trigger?: React.ReactNode;
    teams: Team[];
}

export function EmployeeForm({ onSubmit, employee, trigger, teams }: EmployeeFormProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
        nama: employee?.nama || '',
        pegawai: employee?.pegawai || '',
        nip: employee?.nip || '',
        golongan: employee?.golongan || '',
        pangkat: employee?.pangkat || '',
        timKerjaId: employee?.timKerjaId || undefined,
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && employee) {
            setFormData({
                nama: employee.nama,
                pegawai: employee.pegawai,
                nip: employee.nip,
                golongan: employee.golongan,
                pangkat: employee.pangkat,
                timKerjaId: employee.timKerjaId || undefined,
            });
        } else if (!isOpen && !employee) {
            setFormData({ nama: '', pegawai: '', nip: '', golongan: '', pangkat: '', timKerjaId: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            toast.success(employee ? 'Data berhasil diupdate!' : 'Pegawai berhasil ditambahkan!');
            setOpen(false);
            if (!employee) {
                setFormData({ nama: '', pegawai: '', nip: '', golongan: '', pangkat: '', timKerjaId: undefined });
            }
        } catch (error) {
            toast.error('Gagal menyimpan data!');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-white text-cyan-600 hover:bg-cyan-50 gap-2 shadow-md border border-cyan-200">
                        <UserPlus className="h-4 w-4" />
                        Tambah Pegawai
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${employee ? 'bg-teal-100' : 'bg-cyan-100'}`}>
                            {employee ? (
                                <Pencil className="h-5 w-5 text-teal-600" />
                            ) : (
                                <UserPlus className="h-5 w-5 text-cyan-600" />
                            )}
                        </div>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            {employee ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama" className="text-gray-700 font-medium">Nama Lengkap</Label>
                        <Input
                            id="nama"
                            placeholder="Contoh: Ahmad Fauzi"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pegawai" className="text-gray-700 font-medium">Jenis Pegawai</Label>
                        <Input
                            id="pegawai"
                            placeholder="Contoh: PNS, PPPK"
                            value={formData.pegawai}
                            onChange={(e) => setFormData({ ...formData, pegawai: e.target.value })}
                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nip" className="text-gray-700 font-medium">NIP</Label>
                        <Input
                            id="nip"
                            placeholder="Contoh: 198901012010011001"
                            value={formData.nip}
                            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="golongan" className="text-gray-700 font-medium">Golongan</Label>
                            <Input
                                id="golongan"
                                placeholder="Contoh: III/d"
                                value={formData.golongan}
                                onChange={(e) => setFormData({ ...formData, golongan: e.target.value })}
                                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pangkat" className="text-gray-700 font-medium">Pangkat</Label>
                            <Input
                                id="pangkat"
                                placeholder="Contoh: Penata Tk. I"
                                value={formData.pangkat}
                                onChange={(e) => setFormData({ ...formData, pangkat: e.target.value })}
                                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timKerja" className="text-gray-700 font-medium">Tim Kerja</Label>
                        <Select
                            value={formData.timKerjaId || "none"}
                            onValueChange={(value) => setFormData({ ...formData, timKerjaId: value === "none" ? undefined : value })}
                        >
                            <SelectTrigger className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 w-full">
                                <SelectValue placeholder="Pilih Tim Kerja (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tidak ada tim</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        className={`w-full gap-2 ${employee
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                            : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700'
                            }`}
                    >
                        <Save className="h-4 w-4" />
                        {employee ? 'Simpan Perubahan' : 'Tambah Pegawai'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}