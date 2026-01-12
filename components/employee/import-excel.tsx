"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';
import { Team } from '@/hooks/use-teams';
import { toast } from 'sonner';

interface ImportExcelProps {
    onImport: (data: Omit<Employee, 'id'>[]) => Promise<void>;
    teams: Team[];
}

interface ExcelRow {
    nama?: string;
    Nama?: string;
    pegawai?: string;
    Pegawai?: string;
    nip?: string | number;
    NIP?: string | number;
    golongan?: string;
    Golongan?: string;
    pangkat?: string;
    Pangkat?: string;
    timKerja?: string;
    'Tim Kerja'?: string;
}

export function ImportExcel({ onImport, teams }: ImportExcelProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const findTeamIdByName = (teamName?: string): string => {
        if (!teamName) return '';
        const team = teams.find(t => t.nama.toLowerCase() === teamName.toLowerCase());
        return team?.id || '';
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

            const employees: Omit<Employee, 'id'>[] = jsonData.map((row) => ({
                nama: row.nama || row.Nama || '',
                pegawai: row.pegawai || row.Pegawai || '',
                nip: String(row.nip || row.NIP || ''),
                golongan: row.golongan || row.Golongan || '',
                pangkat: row.pangkat || row.Pangkat || '',
                timKerjaId: findTeamIdByName(row.timKerja || row['Tim Kerja']),
            }));

            await onImport(employees);
            toast.success('Import Berhasil!', {
                description: `${employees.length} data pegawai berhasil diimport.`,
            });
            setOpen(false);
        } catch (error) {
            toast.error('Import Gagal!', {
                description: 'Pastikan format Excel sesuai.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                    <Upload className="h-4 w-4" />
                    Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-100">
                            <FileSpreadsheet className="h-5 w-5 text-cyan-600" />
                        </div>
                        <DialogTitle className="text-2xl">Import Data dari Excel</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4">
                        Format Excel harus memiliki kolom: <strong>nama, pegawai, nip, golongan, pangkat</strong>
                        <br />
                        <span className="text-sm text-gray-500">Opsional: <strong>timKerja</strong> (nama tim)</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-cyan-200 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            disabled={loading}
                            className="hidden"
                            id="excel-upload"
                        />
                        <label htmlFor="excel-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600">
                                {loading ? 'Mengupload...' : 'Klik untuk pilih file Excel'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">.xlsx atau .xls</p>
                        </label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}