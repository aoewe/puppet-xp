import axios from 'axios';

// Chat state management
const userChatStates = new Map<string, boolean>();

export function activateChat(userId: string): void {
  userChatStates.set(userId, true);
}

export function deactivateChat(userId: string): void {
  userChatStates.set(userId, false);
}

export function isChatActive(userId: string): boolean {
  return userChatStates.get(userId) || false;
}

interface QwenResponse {
  output: {
    text: string;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  request_id: string;
}

interface QwenRequest {
  model: string;
  input: {
    messages: {
      role: string;
      content: string;
    }[];
  };
}

export async function getQwenReply(userMessage: string): Promise<string> {
  const API_KEY = 'sk-dc2a6d4b8fd0415092357058c9d63729';
  const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  try {
    const requestData: QwenRequest = {
      model: 'qwen-plus',
      input: {
        messages: [
          {
            role: 'system',
            content: '请将回复内容控制在300字以内，如果内容超过300字，请优化并精简到300字以内，同时保持回复的完整性和关键信息。',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
    };

    const response = await axios.post<QwenResponse>(
      API_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let reply = response.data.output.text;

    // Double check the length and truncate if necessary
    if (reply.length > 300) {
      reply = reply.substring(0, 297) + '...';
    }

    return reply;
  } catch (error) {
    console.error('Error calling Qwen API:', error);
    return 'Sorry, I encountered an error while processing your message.';
  }
}
