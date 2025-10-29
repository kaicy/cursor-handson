'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'

// 모든 메모 가져오기
export async function getMemos(): Promise<Memo[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching memos:', error)
    throw new Error('Failed to fetch memos')
  }

  // DB의 created_at, updated_at을 createdAt, updatedAt으로 변환
  return (data || []).map(memo => ({
    id: memo.id,
    title: memo.title,
    content: memo.content,
    category: memo.category,
    tags: memo.tags || [],
    summary: memo.summary || null,
    createdAt: memo.created_at || new Date().toISOString(),
    updatedAt: memo.updated_at || new Date().toISOString(),
  }))
}

// 특정 메모 가져오기
export async function getMemoById(id: string): Promise<Memo | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching memo:', error)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    summary: data.summary || null,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}

// 메모 생성
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .insert({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating memo:', error)
    throw new Error('Failed to create memo')
  }

  revalidatePath('/')

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    summary: data.summary || null,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}

// 메모 업데이트
export async function updateMemo(id: string, formData: MemoFormData): Promise<Memo> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating memo:', error)
    throw new Error('Failed to update memo')
  }

  revalidatePath('/')

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    summary: data.summary || null,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('memos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting memo:', error)
    throw new Error('Failed to delete memo')
  }

  revalidatePath('/')
}

// 카테고리별 메모 가져오기
export async function getMemosByCategory(category: string): Promise<Memo[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching memos by category:', error)
    throw new Error('Failed to fetch memos by category')
  }

  return (data || []).map(memo => ({
    id: memo.id,
    title: memo.title,
    content: memo.content,
    category: memo.category,
    tags: memo.tags || [],
    summary: memo.summary || null,
    createdAt: memo.created_at || new Date().toISOString(),
    updatedAt: memo.updated_at || new Date().toISOString(),
  }))
}

// 메모 검색
export async function searchMemos(query: string): Promise<Memo[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching memos:', error)
    throw new Error('Failed to search memos')
  }

  // 태그 검색도 포함하기 위해 클라이언트 측에서 필터링
  return (data || []).map(memo => ({
    id: memo.id,
    title: memo.title,
    content: memo.content,
    category: memo.category,
    tags: memo.tags || [],
    summary: memo.summary || null,
    createdAt: memo.created_at || new Date().toISOString(),
    updatedAt: memo.updated_at || new Date().toISOString(),
  }))
}

// 메모 요약 저장
export async function saveMemoSummary(id: string, summary: string): Promise<Memo> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .update({ summary })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error saving memo summary:', error)
    throw new Error('Failed to save memo summary')
  }

  revalidatePath('/')

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    summary: data.summary || null,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}

// 모든 메모 삭제
export async function clearAllMemos(): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('memos')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 메모 삭제

  if (error) {
    console.error('Error clearing all memos:', error)
    throw new Error('Failed to clear all memos')
  }

  revalidatePath('/')
}

