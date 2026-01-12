"use client";

import { Employee } from '@/types/employee';
import { Team } from '@/hooks/use-teams';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmployeeForm } from './employee-form';
import { Pencil, Trash2, User, FileText, Award, Users2 } from 'lucide-react';
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

interface EmployeeTableProps {
    employees: Employee[];
    onUpdate: (id: string, data: Partial<Employee>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    teams: Team[];
}

export function EmployeeTable({ employees, onUpdate, onDelete, teams }: EmployeeTableProps) {
    const handleDelete = async (id: string, nama: string) => {
        try {
            await onDelete(id);
            toast.success('Berhasil!', {
                description: `Data ${nama} berhasil dihapus.`,
            });
        } catch (error) {
            toast.error('Gagal!', {
                description: 'Terjadi kesalahan saat menghapus data.',
            });
        }
    };

    const getTeamName = (timKerjaId?: string) => {
        if (!timKerjaId) return '-';
        const team = teams.find(t => t.id === timKerjaId);
        return team?.nama || '-';
    };

    if (employees.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 mb-4">
                    <User className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada data pegawai</h3>
                <p className="text-gray-500">Klik tombol Tambah Pegawai untuk menambahkan data baru</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-50 hover:to-teal-50">
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-cyan-600" />
                                Nama
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">Pegawai</TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-cyan-600" />
                                NIP
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">Golongan</TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-teal-600" />
                                Pangkat
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <Users2 className="h-4 w-4 text-purple-600" />
                                Tim Kerja
                            </div>
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id} className="hover:bg-cyan-50/50 transition-colors">
                            <TableCell className="font-medium text-gray-900">{employee.nama}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                                    {employee.pegawai}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 font-mono text-sm">{employee.nip}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                                    {employee.golongan}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700">{employee.pangkat}</TableCell>
                            <TableCell>
                                {employee.timKerjaId ? (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        {getTeamName(employee.timKerjaId)}
                                    </Badge>
                                ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <EmployeeForm
                                        employee={employee}
                                        onSubmit={(data) => onUpdate(employee.id!, data)}
                                        teams={teams}
                                        trigger={
                                            <Button variant="outline" size="icon" className="border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Data Pegawai?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Anda yakin ingin menghapus data <strong>{employee.nama}</strong>?
                                                    Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(employee.id!, employee.nama)}
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