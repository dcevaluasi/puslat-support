export interface Employee {
  id?: string
  nama: string
  pegawai: string
  nip: string
  golongan: string
  pangkat: string
}

export type ActivityStatus =
  | 'perjalanan_dinas'
  | 'cuti'
  | 'sakit'
  | 'izin'
  | 'tanpa_keterangan'

export interface Activity {
  id?: string
  employeeId: string
  employeeName?: string
  status: ActivityStatus
  tanggalDari: string
  tanggalSampai: string
  createdAt?: string
}
