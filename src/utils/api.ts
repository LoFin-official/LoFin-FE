import { backendUrl } from "@/config/config";

function getAuthToken() {
  return localStorage.getItem("token");
}

// ✅ 메시지 조회 API
export async function getChatMessages(senderId: string, receiverId: string) {
  const token = getAuthToken();

  const response = await fetch(`${backendUrl}/message/${senderId}/${receiverId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("메시지 불러오기 실패");
  }

  const resJson = await response.json();
  console.log("📦 getChatMessages 응답 확인:", resJson);

  if (!resJson || !Array.isArray(resJson.data)) {
    throw new Error("서버 응답 형식이 잘못되었습니다.");
  }

  return resJson.data; // 메시지 배열만 반환
}

// ✅ 메시지 전송 API
export async function sendChatMessage(message: {
  text: string;
  type: "sent" | "received";
  receiverId: string;
  imageUrl?: string;
}) {
  console.log("📨 sendChatMessage 호출됨:", message);

  const token = getAuthToken();
  console.log("🔐 토큰 확인:", token);

  if (!message.receiverId) {
    throw new Error("❌ receiverId가 없습니다.");
  }

  if (!message.text && !message.imageUrl) {
    throw new Error("❌ 텍스트 또는 이미지 중 하나는 필수입니다.");
  }

  const body = {
    receiver: message.receiverId,
    content: message.text || "",
    imageUrl: message.imageUrl || "",
  };

  console.log("📦 서버에 전송할 body:", body);

  const response = await fetch(`${backendUrl}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const resJson = await response.json();

  if (!response.ok) {
    console.error("❗ 서버 응답 오류:", resJson);
    throw new Error(resJson.message || "메시지 전송 실패");
  }

  return resJson;
}
