import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Employee } from '@/types/employee'
import { useState, useEffect, useCallback } from 'react'

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const collectionName = 'employees'

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(collection(db, collectionName), orderBy('nama'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Employee),
      )
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = async (data: Omit<Employee, 'id'>) => {
    await addDoc(collection(db, collectionName), data)
    await fetchEmployees()
  }

  const update = async (id: string, data: Partial<Employee>) => {
    await updateDoc(doc(db, collectionName, id), data)
    await fetchEmployees()
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id))
    await fetchEmployees()
  }

  const bulkImport = async (data: Omit<Employee, 'id'>[]) => {
    const batch = writeBatch(db)
    data.forEach((item) => {
      const docRef = doc(collection(db, collectionName))
      batch.set(docRef, item)
    })
    await batch.commit()
    await fetchEmployees()
  }

  const deleteAll = async () => {
    const snapshot = await getDocs(collection(db, collectionName))
    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    await fetchEmployees()
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    employees,
    loading,
    create,
    update,
    remove,
    bulkImport,
    deleteAll,
    refresh: fetchEmployees,
  }
}
