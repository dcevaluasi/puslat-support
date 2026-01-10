import { useState, useEffect, useCallback } from 'react'
import { MeetingRoom } from '@/types/meeting-room'
import { meetingRoomApi } from '@/lib/meeting-room-api'
import { toast } from 'sonner'

export const useRuangRapat = () => {
  const [ruangRapats, setRuangRapats] = useState<MeetingRoom[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRuangRapats = useCallback(async () => {
    setLoading(true)
    try {
      const result = await meetingRoomApi.getAll()
      setRuangRapats(result.data || [])
    } catch (error) {
      toast.error('Gagal memuat data ruang rapat')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = async (data: FormData) => {
    try {
      await meetingRoomApi.create(data)
      toast.success('Ruang rapat berhasil ditambahkan!')
      await fetchRuangRapats()
    } catch (error) {
      toast.error('Gagal menambahkan ruang rapat')
      throw error
    }
  }

  const update = async (id: string, data: FormData) => {
    try {
      await meetingRoomApi.update(id, data)
      toast.success('Ruang rapat berhasil diupdate!')
      await fetchRuangRapats()
    } catch (error) {
      toast.error('Gagal mengupdate ruang rapat')
      throw error
    }
  }

  const remove = async (id: string) => {
    try {
      await meetingRoomApi.delete(id)
      toast.success('Ruang rapat berhasil dihapus!')
      await fetchRuangRapats()
    } catch (error) {
      toast.error('Gagal menghapus ruang rapat')
      throw error
    }
  }

  useEffect(() => {
    fetchRuangRapats()
  }, [fetchRuangRapats])

  return {
    ruangRapats,
    loading,
    create,
    update,
    remove,
    refresh: fetchRuangRapats,
  }
}
