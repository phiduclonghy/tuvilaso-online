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

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `请TạoMệnh格Tổng quan，按以下Cấu trúcXuất ra：

**【Mệnh格定性】**
用Nhất句话概括这个Lá số的核心Cách Cục与Mệnh Chủ气质。

**【Chính TinhLuận giải】**
MệnhChính Tinh的核心Đặc điểm，引用Nghê Hải Hạ原话或观点。

**【Tam Phương Tứ Chính】**
财、官、迁TamCung的联动Phân tích及整体Cách Cục。

**【Hiện tạiĐại Hạn】**
Hiện tạiĐại HạnVận thế方向与最值Đắc关注的事项。

**【优势与Lưu ý】**
Lá sốThiên赋优势，以及CầnLưu ý的风险或功课。`,

  love: `请SâuPhân tíchTình cảmhôn nhân运，按以下Cấu trúcXuất ra：

**【Tình cảmCách Cục】**
Nhất句话定性Tình cảmMệnh格。

**【Phu ThêCungPhân tích】**
Phu ThêCungChính Tinh、Tứ Hóa，以及Nghê Hải Hạ体系的具体Luận giải。

**【Tam Phương联动】**
相关Cung Vị对Tình cảm的影响。

**【Hiện tạiĐại HạnTình cảm运】**
Hiện tại10nămTình cảm走向与关键节点。

**【实际建议】**
具体可行的Tình cảm建议。`,

  career: `请SâuPhân tíchsự nghiệp运，按以下Cấu trúcXuất ra：

**【sự nghiệpCách Cục】**
Nhất句话定性sự nghiệpMệnh格，宜任职或宜创业。

**【Quan LộcCungPhân tích】**
Quan LộcCungChính Tinh、Tứ Hóa，以及Nghê sư对这种配置的判断。

**【Tài BạchCung联动】**
tài vận与sự nghiệp的关系，财路来源Phân tích。

**【Hiện tạiĐại Hạnsự nghiệp运】**
Hiện tại10nămsự nghiệp走向。

**【实际建议】**
适合的方向、行业与策略。`,

  wealth: `请SâuPhân tíchtài vận，按以下Cấu trúcXuất ra：

**【tài vậnCách Cục】**
Nhất句话定性tài vận模式，是主动财还是被动财。

**【Tài BạchCungPhân tích】**
Tài BạchCungChính Tinh、Tứ Hóa，tài phú来源与流动模式。

**【Điền TrạchCung（tài khố）】**
积蓄能力与Bất动产Vận thếPhân tích。

**【Hiện tạiĐại Hạntài vận】**
Hiện tạitài vận走向与Lưu ý事项。

**【理财建议】**
具体的财务建议。`,

  health: `请Phân tíchsức khỏeVận thế，按以下Cấu trúcXuất ra：

**【Tật ÁchCungChính Tinh】**
Tật ÁchCungTinh Diệu与sức khỏe含义。

**【主要风险】**
结合Nghê Hải HạTýNgọ流注理论，Phân tích主要sức khỏe隐患与需关注的部位。

**【Đại Hạnsức khỏe走势】**
Hiện tạisức khỏe趋势与关键giờ间段。

**【预防建议】**
具体Lưu ý事项与Dưỡng生方向。`,

  personality: `请Sâu解析tính cáchĐặc điểm，按以下Cấu trúcXuất ra：

**【MệnhChính Tinhtính cách】**
MệnhChính Tinh的核心tính cáchĐặc điểm，引用Nghê sư原话。

**【Tam Phươngtính cách综合】**
财、官、迁TamCung对tính cách的影响，全貌描绘。

**【人际关系模式】**
与他人互动方式、待人处世风格。

**【优势与人生课题】**
Thiên赋优势，以及Cần面对的人生功课。`,
};

const PALACE_ROLES: Record<string, string> = {
  'Mệnh':   '自我、tính cách、先ThiênCách Cục',
  'Huynh ĐệCung': 'Huynh Đệ关系、合伙人',
  'Phu ThêCung': 'Tình cảm关系、hôn nhân状态',
  'tử nữCung': 'tử nữ缘分、下属关系',
  'Tài BạchCung': 'tài vận来源、收入方式',
  'Tật ÁchCung': 'Thân体sức khỏe、意外',
  'Thiên DiCung': '外出机遇、人际Cách Cục',
  'Nô BộcCung': '朋友圈、贵人、小人',
  'Quan LộcCung': 'sự nghiệp成就、社会Địa位',
  'Điền TrạchCung': 'Bất动产、家庭环境',
  'Phúc ĐứcCung': '精神享受、内心福分',
  'Phụ MẫuCung': 'Phụ Mẫu关系、文书契约',
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

const IS_GITHUB_PAGES = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
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
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (apiUnavailable || !selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join('、')
      : 'Cung Vô Chính Diệu（借Đối Cung）';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `请重点Phân tích【${selectedPalace.name}】（主管：${role}），该CungChính Tinh为${starDesc}，按以下Cấu trúcXuất ra：

**【Cung Vị定性】**
${selectedPalace.name}在Lá số中的意义，以及这种Tinh Diệu配置的整体判断。

**【Chính TinhLuận giải】**
Chính Tinh在此Cung的Nghê Hải Hạ体系Luận giải，引用具体观点。

**【Tam Phương Tứ Chính联动】**
Tam Phương Tứ ChínhCung Vị对此Cung的影响。

**【实际建议】**
基于此Cung的具体建议。`;

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
    const palaceName = palaceOfStar?.name ?? 'Mùi知Cung Vị';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

    const prompt = `请Phân tích【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】的飞化影响，按以下Cấu trúcXuất ra：

**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在Nghê Hải Hạ体系中的核心含义，以及${selectedSiHua.starName}化${selectedSiHua.siHua}的特殊含义。

**【落Cung影响】**
${selectedSiHua.starName}化${selectedSiHua.siHua}落在【${palaceName}】，该Cung主管的领域受到何种影响，Nghê sư如何Luận giải。

**【Tam Phương Tứ Chính飞化路径】**
化${selectedSiHua.siHua}入${palaceName}后，对其Tam Phương Tứ Chính（Đối Cung、两个Tam HợpCung）的联动影响。

**【Hiện tạiVận thế影响】**
在${viewLabel}giờ间维度下，此化${selectedSiHua.siHua}对Mệnh Chủ近期Vận thế的具体影响。

**【实际建议】**
基于此Tứ Hóa的具体可操作建议。`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
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

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
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
    sendMessage(TOPIC_PROMPTS[topicKey], true);
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
