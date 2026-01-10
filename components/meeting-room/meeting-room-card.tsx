"use client";

import { MeetingRoom } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MeetingRoomForm } from './meeting-room-form';
import { Pencil, Trash2, Users, MapPin } from 'lucide-react';
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

interface MeetingRoomCardProps {
    ruangRapat: MeetingRoom;
    onUpdate: (id: string, data: FormData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

type StatusType = 'Tersedia' | 'Tidak Tersedia' | 'Dalam Perbaikan';

const statusConfig: Record<StatusType, { color: string; badge: string }> = {
    'Tersedia': { color: 'bg-green-100 text-green-700 border-green-200', badge: 'bg-green-500' },
    'Tidak Tersedia': { color: 'bg-red-100 text-red-700 border-red-200', badge: 'bg-red-500' },
    'Dalam Perbaikan': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', badge: 'bg-yellow-500' },
};

export function MeetingRoomCard({ ruangRapat, onUpdate, onDelete }: MeetingRoomCardProps) {
    const handleDelete = async () => {
        await onDelete(ruangRapat.id);
    };

    const status = ruangRapat.status as StatusType;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md">
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
                {ruangRapat.foto ? (
                    <img
                        src={ruangRapat.foto}
                        alt={ruangRapat.nama}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100">
                        <MapPin className="h-16 w-16 text-blue-300" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${statusConfig[status].badge} animate-pulse`}></div>
                </div>
            </div>

            <CardContent className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{ruangRapat.nama}</h3>
                    <Badge variant="outline" className={statusConfig[status].color}>
                        {ruangRapat.status}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Users className="h-4 w-4" />
                    <span>Kapasitas: <strong>{ruangRapat.kapasitas} orang</strong></span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{ruangRapat.keterangan}</p>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex gap-2">
                <MeetingRoomForm
                    ruangRapat={ruangRapat}
                    onSubmit={(data) => onUpdate(ruangRapat.id, data)}
                    trigger={
                        <Button variant="outline" size="sm" className="flex-1 border-sky-200 text-sky-600 hover:bg-sky-50">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    }
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Ruang Rapat?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda yakin ingin menghapus <strong>{ruangRapat.nama}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}