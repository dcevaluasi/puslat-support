"use client";

import { useState } from 'react';
import { MeetingRoom } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DoorOpen, Pencil, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface RuangRapatFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    ruangRapat?: MeetingRoom;
    trigger?: React.ReactNode;
}

const statusOptions = [
    { value: 'Tersedia', label: 'Tersedia' },
    { value: 'Tidak Tersedia', label: 'Tidak Tersedia' },
    { value: 'Dalam Perbaikan', label: 'Dalam Perbaikan' },
];

export function MeetingRoomForm({ onSubmit, ruangRapat, trigger }: RuangRapatFormProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        nama: ruangRapat?.nama || '',
        status: ruangRapat?.status || 'Tersedia',
        kapasitas: ruangRapat?.kapasitas || 0,
        keterangan: ruangRapat?.keterangan || '',
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(ruangRapat?.foto || '');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFoto(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('nama', formData.nama);
        data.append('status', formData.status);
        data.append('kapasitas', formData.kapasitas.toString());
        data.append('keterangan', formData.keterangan);

        if (foto) {
            data.append('foto', foto);
        }

        try {
            await onSubmit(data);
            setOpen(false);
            if (!ruangRapat) {
                setFormData({ nama: '', status: 'Tersedia', kapasitas: 0, keterangan: '' });
                setFoto(null);
                setPreviewUrl('');
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2">
                        <DoorOpen className="h-4 w-4" />
                        Tambah Ruang Rapat
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${ruangRapat ? 'bg-sky-100' : 'bg-blue-100'}`}>
                            {ruangRapat ? (
                                <Pencil className="h-5 w-5 text-sky-600" />
                            ) : (
                                <DoorOpen className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                            {ruangRapat ? 'Edit Ruang Rapat' : 'Tambah Ruang Rapat Baru'}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama" className="text-gray-700 font-medium">Nama Ruang Rapat</Label>
                        <Input
                            id="nama"
                            placeholder="Contoh: Ruang Rapat 1 Puslat KP"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="border-gray-300 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="foto" className="text-gray-700 font-medium">Foto Ruang Rapat</Label>
                        <div className="space-y-3">
                            <Input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border-gray-300 focus:border-blue-500"
                            />
                            {previewUrl && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        status: value as "Tersedia" | "Tidak Tersedia" | "Dalam Perbaikan"
                                    })
                                }
                            >
                                <SelectTrigger className="border-gray-300 focus:border-blue-500 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="kapasitas" className="text-gray-700 font-medium">Kapasitas</Label>
                            <Input
                                id="kapasitas"
                                type="number"
                                min="0"
                                placeholder="Contoh: 20"
                                value={formData.kapasitas}
                                onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })}
                                className="border-gray-300 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keterangan" className="text-gray-700 font-medium">Keterangan</Label>
                        <Textarea
                            id="keterangan"
                            placeholder="Contoh: Ruang Rapat 1 berlokasi pada Wings Kanan Pusat Pelatihan KP GMB 3 Lt 5"
                            value={formData.keterangan}
                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                            className="border-gray-300 focus:border-blue-500 min-h-[100px]"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        <Save className="h-4 w-4" />
                        {ruangRapat ? 'Simpan Perubahan' : 'Tambah Ruang Rapat'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}