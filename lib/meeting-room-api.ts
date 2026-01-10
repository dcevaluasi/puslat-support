const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export const meetingRoomApi = {
  getAll: async (id?: string) => {
    const url = id
      ? `${API_BASE_URL}/support/ruang-rapat?id=${id}`
      : `${API_BASE_URL}/support/ruang-rapat`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    return response.json()
  },

  create: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/support/ruang-rapat`, {
      method: 'POST',
      body: data,
    })
    if (!response.ok) {
      throw new Error('Failed to create data')
    }
    return response.json()
  },

  // PUT - Update ruang rapat
  update: async (id: string, data: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/support/ruang-rapat?id=${id}`,
      {
        method: 'PUT',
        body: data,
      },
    )
    if (!response.ok) {
      throw new Error('Failed to update data')
    }
    return response.json()
  },

  // DELETE - Delete ruang rapat
  delete: async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}/support/ruang-rapat?id=${id}`,
      {
        method: 'DELETE',
      },
    )
    if (!response.ok) {
      throw new Error('Failed to delete data')
    }
    return response.json()
  },
}
