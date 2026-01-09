"use client";

import { Button } from '@/components/ui/button';
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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteAllProps {
    onDeleteAll: () => Promise<void>;
    count: number;
}

export function DeleteAll({ onDeleteAll, count }: DeleteAllProps) {
    const handleDelete = async () => {
        try {
            await onDeleteAll();
            toast.success('Berhasil!', {
                description: `Semua ${count} data pegawai berhasil dihapus.`,
            });
        } catch (error) {
            toast.error('Gagal!', {
                description: 'Terjadi kesalahan saat menghapus data.',
            });
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Hapus Semua
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Semua Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda yakin ingin menghapus <strong>semua {count} data pegawai</strong>?
                        Tindakan ini tidak dapat dibatalkan dan semua data akan hilang permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Ya, Hapus Semua
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}