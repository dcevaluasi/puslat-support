"use client";

import { Team } from '@/hooks/use-teams';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TeamForm } from './team-form';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeamTableProps {
    teams: Team[];
    onUpdate: (id: string, data: Partial<Team>) => void;
    onDelete: (id: string) => void;
}

export function TeamTable({ teams, onUpdate, onDelete }: TeamTableProps) {
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    return (
        <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-12">No</TableHead>
                            <TableHead>Nama Tim</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="w-32 text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teams.map((team, index) => (
                            <TableRow key={team.id} className="hover:bg-gray-50">
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{team.nama}</TableCell>
                                <TableCell className="text-gray-600">{team.deskripsi}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingTeam(team)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeletingId(team.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {editingTeam && (
                <TeamForm
                    defaultValues={editingTeam}
                    onSubmit={(data) => {
                        onUpdate(editingTeam.id, data);
                        setEditingTeam(null);
                    }}
                />
            )}

            <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tim?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingId) onDelete(deletingId);
                            setDeletingId(null);
                        }}>
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}