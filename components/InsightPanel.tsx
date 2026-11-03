'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Tổng quan' },
  { key: 'love',        label: 'Tình cảm' },
  { key: 'career',      label: 'Sự nghiệp' },
  { key: 'wealth',      label: 'Tài vận' },
  { key: 'health',      label: 'Sức khỏe' },
  { key: 'personality', label: 'Tính cách' },
] as const;

const PALACE_ROLES: Record<string, string> = {
  'Mệnh': 'tính cách và xu hướng cá nhân',
  'Huynh Đệ': 'anh chị em và quan hệ hợp tác',
  'Phu Thê': 'tình cảm và hôn nhân',
  'Tử Nữ': 'con cái và người trẻ hơn',
  'Tài Bạch': 'tài chính và thu nhập',
  'Tật Ách': 'sức khỏe theo quan niệm truyền thống',
  'Thiên Di': 'môi trường bên ngoài và các mối quan hệ',
  'Nô Bộc': 'bạn bè và người hỗ trợ',
  'Quan Lộc': 'công việc và sự nghiệp',
  'Điền Trạch': 'nhà cửa và môi trường gia đình',
  'Phúc Đức': 'đời sống tinh thần',
  'Phụ Mẫu': 'cha mẹ và người lớn tuổi',
};

const VI_PROMPTS: Record<string, string> = {
  overview: 'Hãy luận giải tổng quan lá số bằng tiếng Việt: cung Mệnh, cung Thân, chính tinh, Tam Phương Tứ Chính và đại hạn hiện tại. Nêu điểm mạnh, điều cần lưu ý và giới hạn của cách luận giải.',
  love: 'Hãy luận giải tình cảm và hôn nhân dựa trên cung Phu Thê, các sao liên quan và đại hạn hiện tại. Trình bày cân bằng, tránh khẳng định chắc chắn.',
  career: 'Hãy luận giải xu hướng công việc dựa trên cung Quan Lộc, Tài Bạch, Thiên Di và đại hạn hiện tại. Nêu thế mạnh và điểm cần cân nhắc.',
  wealth: 'Hãy luận giải cách quản lý tài chính theo cung Tài Bạch và Điền Trạch. Chỉ giải thích ý nghĩa truyền thống của lá số, không đưa khuyến nghị đầu tư.',
  health: 'Hãy giải thích ý nghĩa truyền thống của cung Tật Ách và đại hạn hiện tại. Không chẩn đoán bệnh hoặc thay thế tư vấn y tế.',
  personality: 'Hãy luận giải tính cách và cách ứng xử dựa trên cung Mệnh, cung Thân và Tam Phương Tứ Chính. Nêu cả điểm mạnh lẫn hạn chế.',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || '/api/interpret';
const IS_GITHUB_PAGES = Boolean(process.env.NEXT_PUBLIC_BASE_PATH) && !process.env.NEXT_PUBLIC_AI_API_URL;
const AI_UNAVAILABLE = 'Trang GitHub Pages chưa có máy chủ luận giải AI. Bạn vẫn có thể lập lá số, xem các cung, đại hạn và lưu niên.';

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>(
    IS_GITHUB_PAGES ? [{ role: 'assistant', content: AI_UNAVAILABLE }] : []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(IS_GITHUB_PAGES);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate Mệnh格Tổng quan on mount
  useEffect(() => {
    if (autoLoaded.current || apiUnavailable) return;
    autoLoaded.current = true;
    sendMessage(VI_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (apiUnavailable || !selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? ` hóa ${s.siHua}` : ''}`).join(', ')
      : 'cung Vô Chính Diệu';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `Hãy luận giải cung ${selectedPalace.name} bằng tiếng Việt. Cung này liên quan đến ${role}; chính tinh: ${starDesc}. Giải thích ý nghĩa truyền thống, ảnh hưởng của Tam Phương Tứ Chính, điểm mạnh và điều cần lưu ý. Không khẳng định chắc chắn tương lai.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入Tứ Hóa飞化Phân tích
  useEffect(() => {
    if (apiUnavailable || !selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该Sao所在Cung Vị
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'cung chưa xác định';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

    const prompt = `Hãy luận giải ${selectedSiHua.starName} hóa ${selectedSiHua.siHua} trong ${viewLabel}, ở cung ${palaceName}. Giải thích ý nghĩa truyền thống của Tứ Hóa, ảnh hưởng đến cung này và Tam Phương Tứ Chính, cùng những điều cần lưu ý. Trả lời bằng tiếng Việt, tránh khẳng định chắc chắn.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có dữ liệu phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let pending = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        const lines = pending.split('\n');
        pending = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const event = JSON.parse(data);
            if (event.error) throw new Error(event.error);
            const delta = event.delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      if (missing) setApiUnavailable(true);
      setMessages(prev => [...prev, { role: 'assistant', content: missing ? AI_UNAVAILABLE : 'Không thể tạo luận giải lúc này. Vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current || apiUnavailable) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current || apiUnavailable) return;
    setActiveTopic(topicKey);
    sendMessage(VI_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading || apiUnavailable}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang tạo luận giải…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  Luận giải AI
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={apiUnavailable ? 'Luận giải AI chưa khả dụng trên GitHub Pages' : 'Đặt câu hỏi về lá số của bạn…'}
            disabled={loading || apiUnavailable}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || apiUnavailable || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Gửi'}
          </button>
        </div>
      </div>

    </div>
  );
}
