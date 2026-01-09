import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Activity } from '@/types/employee'
import { useState, useEffect, useCallback } from 'react'

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const collectionName = 'activities'

  const fetchActivities = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, collectionName),
        orderBy('tanggalDari', 'desc'),
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Activity),
      )
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = async (data: Omit<Activity, 'id'>) => {
    await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await fetchActivities()
  }

  const update = async (id: string, data: Partial<Activity>) => {
    await updateDoc(doc(db, collectionName, id), data)
    await fetchActivities()
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id))
    await fetchActivities()
  }

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    create,
    update,
    remove,
    refresh: fetchActivities,
  }
}
