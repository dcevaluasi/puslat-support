"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit } from 'lucide-react';
import { Team } from '@/hooks/use-teams';

interface TeamFormProps {
    onSubmit: (data: Omit<Team, 'id' | 'createdAt'>) => void;
    defaultValues?: Team;
    trigger?: React.ReactNode;
}

export function TeamForm({ onSubmit, defaultValues, trigger }: TeamFormProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        nama: defaultValues?.nama || '',
        deskripsi: defaultValues?.deskripsi || ''
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && defaultValues) {
            setFormData({
                nama: defaultValues.nama,
                deskripsi: defaultValues.deskripsi
            });
        } else if (!isOpen && !defaultValues) {
            setFormData({ nama: '', deskripsi: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setOpen(false);
        if (!defaultValues) {
            setFormData({ nama: '', deskripsi: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all">
                        <Plus className="h-4 w-4" />
                        Tambah Tim
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {defaultValues ? (
                            <>
                                <Edit className="h-5 w-5 text-cyan-600" />
                                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    Edit Tim Kerja
                                </span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 text-cyan-600" />
                                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    Tambah Tim Baru
                                </span>
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama" className="text-gray-700 font-medium">
                            Nama Tim <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nama"
                            placeholder="Masukkan nama tim"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deskripsi" className="text-gray-700 font-medium">
                            Deskripsi <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="deskripsi"
                            placeholder="Masukkan deskripsi tim"
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            rows={4}
                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
                        >
                            {defaultValues ? 'Perbarui' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}