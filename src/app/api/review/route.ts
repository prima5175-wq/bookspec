import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { bookTitle, author, review, rating } = await req.json();

    if (!review || review.trim().length < 5) {
      return NextResponse.json(
        { error: "독서록 내용이 너무 짧아요!" },
        { status: 400 }
      );
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      thinking: { type: "adaptive" },
      system: `당신은 초등학생 어린이의 독서록을 첨삭해주는 따뜻한 선생님입니다.

규칙:
- 반드시 한국어로 답변하세요
- 아이가 이해할 수 있는 쉬운 말로 써주세요
- 먼저 잘 쓴 점을 칭찬해주세요 (구체적으로)
- 개선할 점은 부드럽게 제안해주세요
- 이모지를 적절히 사용해주세요
- 총 300자 내외로 간결하게 써주세요

응답 형식:
✨ 잘한 점
(칭찬 2-3개)

💡 이렇게 하면 더 좋아요
(제안 1-2개)

⭐ 선생님 한마디
(격려 메시지)

📊 독서력 점수: X/100`,
      messages: [
        {
          role: "user",
          content: `책 제목: ${bookTitle || "미입력"}
저자: ${author || "미입력"}
별점: ${rating || 0}/5

아이의 독서록:
${review}`,
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
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
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
    console.error("AI Review error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "API 키가 설정되지 않았어요. ANTHROPIC_API_KEY를 확인해주세요." },
        { status: 401 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "AI 첨삭 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
