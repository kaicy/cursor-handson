'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'
import { saveMemoSummary } from '@/actions/memos'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

interface MemoDetailModalProps {
  memo: Memo | null
  isOpen: boolean
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
}

export default function MemoDetailModal({
  memo,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: MemoDetailModalProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isSavingSummary, setIsSavingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [isSummarySaved, setIsSummarySaved] = useState(false)

  // 모달이 열릴 때 저장된 요약 로드
  useEffect(() => {
    if (isOpen && memo?.summary) {
      setSummary(memo.summary)
      setIsSummarySaved(true)
    } else if (!isOpen) {
      setSummary(null)
      setSummaryError(null)
      setIsSummarySaved(false)
    }
  }, [isOpen, memo])

  // 요약 생성 함수
  const handleGenerateSummary = async () => {
    if (!memo) return

    setIsGeneratingSummary(true)
    setSummaryError(null)
    setIsSummarySaved(false)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: memo.content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '요약 생성에 실패했습니다.')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Summary generation error:', error)
      setSummaryError(
        error instanceof Error ? error.message : '요약 생성 중 오류가 발생했습니다.'
      )
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  // 요약 저장 함수
  const handleSaveSummary = async () => {
    if (!memo || !summary) return

    setIsSavingSummary(true)
    setSummaryError(null)

    try {
      await saveMemoSummary(memo.id, summary)
      setIsSummarySaved(true)
    } catch (error) {
      console.error('Summary save error:', error)
      setSummaryError(
        error instanceof Error ? error.message : '요약 저장 중 오류가 발생했습니다.'
      )
    } finally {
      setIsSavingSummary(false)
    }
  }

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !memo) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const handleDelete = () => {
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id)
      onClose()
    }
  }

  const handleEdit = () => {
    onEdit(memo)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-gray-900/20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {memo.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(memo.category)}`}
              >
                {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                  memo.category}
              </span>
              <span className="text-sm text-gray-500">
                생성: {formatDate(memo.createdAt)}
              </span>
              {memo.createdAt !== memo.updatedAt && (
                <span className="text-sm text-gray-500">
                  수정: {formatDate(memo.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="px-6 py-6">
          <div className="prose max-w-none" data-color-mode="light">
            <MarkdownPreview 
              source={memo.content}
              style={{ 
                fontSize: '1rem',
                lineHeight: '1.75'
              }}
              wrapperElement={{
                'data-color-mode': 'light'
              }}
            />
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">태그</h3>
              <div className="flex gap-2 flex-wrap">
                {memo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI 요약 섹션 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">AI 요약</h3>
              {!summary && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingSummary ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      요약 생성 중...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      요약 생성
                    </>
                  )}
                </button>
              )}
            </div>

            {summaryError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{summaryError}</p>
                  </div>
                </div>
              </div>
            )}

            {summary ? (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="prose prose-sm max-w-none" data-color-mode="light">
                  <MarkdownPreview
                    source={summary}
                    style={{
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      backgroundColor: 'transparent',
                    }}
                    wrapperElement={{
                      'data-color-mode': 'light',
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {isSummarySaved ? (
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      저장됨
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveSummary}
                      disabled={isSavingSummary}
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingSummary ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4 mr-1.5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          저장 중...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          저장
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSummary(null)
                      setIsSummarySaved(false)
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    다시 생성
                  </button>
                </div>
              </div>
            ) : (
              !isGeneratingSummary &&
              !summaryError && (
                <p className="text-sm text-gray-500">
                  AI를 사용하여 메모의 핵심 내용을 요약할 수 있습니다.
                </p>
              )
            )}
          </div>
        </div>

        {/* 푸터 - 액션 버튼 */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            편집
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

