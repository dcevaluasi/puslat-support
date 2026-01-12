import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

export interface Team {
  id: string
  nama: string
  deskripsi: string
  createdAt: Date
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teams'))
      const teamsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Team[]
      setTeams(teamsData)
    } catch (error) {
      toast.error('Gagal memuat data tim')
    } finally {
      setLoading(false)
    }
  }

  const create = async (data: Omit<Team, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'teams'), {
        ...data,
        createdAt: new Date(),
      })
      toast.success('Tim berhasil ditambahkan')
      fetchTeams()
    } catch (error) {
      toast.error('Gagal menambahkan tim')
    }
  }

  const update = async (id: string, data: Partial<Team>) => {
    try {
      await updateDoc(doc(db, 'teams', id), data)
      toast.success('Tim berhasil diperbarui')
      fetchTeams()
    } catch (error) {
      toast.error('Gagal memperbarui tim')
    }
  }

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'teams', id))
      toast.success('Tim berhasil dihapus')
      fetchTeams()
    } catch (error) {
      toast.error('Gagal menghapus tim')
    }
  }

  return { teams, loading, create, update, remove }
}
