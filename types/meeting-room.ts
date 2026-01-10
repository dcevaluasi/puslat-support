export interface MeetingRoom {
  id: string
  nama: string
  foto: string
  status: 'Tersedia' | 'Tidak Tersedia' | 'Dalam Perbaikan'
  kapasitas: number
  keterangan: string
}

export type MeetingRoomFormData = Omit<MeetingRoom, 'id'> & {
  foto?: File | string
}
