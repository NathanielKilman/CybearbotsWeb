import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

// ---------------------------------------------------------------------
// Generic table hook: fetch all rows from a table, ordered by sort_order
// then created_at, with refetch support.
// ---------------------------------------------------------------------
export function useTable(table, { order = 'sort_order', ascending = true, secondaryOrder } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    let query = supabase.from(table).select('*').order(order, { ascending })
    if (secondaryOrder) {
      query = query.order(secondaryOrder, { ascending: false })
    }
    const { data, error } = await query
    if (error) {
      setError(error)
    } else {
      setData(data || [])
      setError(null)
    }
    setLoading(false)
  }, [table, order, ascending, secondaryOrder])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

// ---------------------------------------------------------------------
// site_content: key-value store for editable text snippets
// ---------------------------------------------------------------------
export function useSiteContent() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('site_content').select('*')
    if (!error && data) {
      const map = {}
      data.forEach((row) => {
        map[row.key] = row.value
      })
      setContent(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
  }, [refetch])

  const setValue = useCallback(async (key, value) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (!error) {
      setContent((prev) => ({ ...prev, [key]: value }))
    }
    return error
  }, [])

  return { content, loading, refetch, setValue }
}

// ---------------------------------------------------------------------
// site_images: named image slots (hero photos, logos, etc.)
// ---------------------------------------------------------------------
export function useSiteImages() {
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('site_images').select('*')
    if (!error && data) {
      const map = {}
      data.forEach((row) => {
        map[row.key] = row.url
      })
      setImages(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
  }, [refetch])

  const setImage = useCallback(async (key, url) => {
    const { error } = await supabase
      .from('site_images')
      .upsert({ key, url, updated_at: new Date().toISOString() })
    if (!error) {
      setImages((prev) => ({ ...prev, [key]: url }))
    }
    return error
  }, [])

  return { images, loading, refetch, setImage }
}
