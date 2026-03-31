import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { bookTitle, author, pages, quote, thoughts, emotion, question } =
      await req.json();

    if (!question || question.trim().length < 2) {
      return NextResponse.json(
        { error: "질문을 입력해주세요!" },
        { status: 400 }
      );
    }

    const context = [
      bookTitle && `책 제목: ${bookTitle}`,
      author && `저자: ${author}`,
      pages && `오늘 읽은 페이지: ${pages}p`,
      quote && `기억하고 싶은 문장: "${quote}"`,
      thoughts && `아이의 생각: ${thoughts}`,
      emotion && `오늘의 감정: ${emotion}`,
    ]
      .filter(Boolean)
      .join("\n");

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      system: `당신은 어린이와 책에 대해 대화하는 따뜻한 우주 친구입니다.

규칙:
- 반드시 한국어로 답변하세요
- 아이가 이해할 수 있는 쉬운 말을 쓰세요
- 아이의 생각을 존중하고 공감해주세요
- 더 깊이 생각해볼 질문을 하나 던져주세요
- 이모지를 자연스럽게 사용하세요
- 200자 내외로 간결하게 답변하세요
- 우주/행성/별 관련 비유를 가끔 섞어주세요`,
      messages: [
        {
          role: "user",
          content: `${context}\n\n아이의 질문/대화: ${question}`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "API 키를 확인해주세요." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "AI 대화 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
