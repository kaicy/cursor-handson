import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '메모 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `다음 메모의 핵심 내용을 3-5개의 간결한 요점으로 요약해주세요. 각 요점은 한 문장으로 작성하고, 불릿 포인트 형식으로 작성해주세요.\n\n메모 내용:\n${content}`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.3,
      },
    })

    const summary = response.text

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: '요약 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

