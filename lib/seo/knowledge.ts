/**
 * SEO Tri thức页 — 数据 helper
 *
 * 14 Chính Tinh × 13 topic = 182 个độc lập SEO URL
 * 每页都是 STAR_DB 中对应字段的 4 段 markers（Nhất句话定调/核心论断/Lá số依据/经典出处）
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

export const ALL_STARS = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ',
  'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân',
];

// Chính Tinh名 ↔ 拼音 slug 映射（URL 用 slug，避免Tiếng Việt URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  'Tử Vi': 'ziwei',
  'Thiên Cơ': 'tianji',
  'Thái Dương': 'taiyang',
  'Vũ Khúc': 'wuqu',
  'Thiên Đồng': 'tiantong',
  'Liêm Trinh': 'lianzhen',
  'Thiên Phủ': 'tianfu',
  'Thái Âm': 'taiyin',
  'Tham Lang': 'tanlang',
  'Cự Môn': 'jumen',
  'Thiên Tướng': 'tianxiang',
  'Thiên Lương': 'tianliang',
  'Thất Sát': 'qisha',
  'Phá Quân': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  mingGong: string;
  personality: string;
  xiongDi?: string;
  fuQi: string;
  ziNv?: string;
  caiBo: string;
  jiE: string;
  qianYi?: string;
  jiaoYou?: string;
  guanLu: string;
  tianZhai?: string;
  fuDe?: string;
  fuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'mingGong',
  personality: 'personality',
  love:        'fuQi',
  career:      'guanLu',
  wealth:      'caiBo',
  health:      'jiE',
  family:      'xiongDi' as keyof StarContent,
  children:    'ziNv' as keyof StarContent,
  move:        'qianYi' as keyof StarContent,
  friends:     'jiaoYou' as keyof StarContent,
  home:        'tianZhai' as keyof StarContent,
  spirit:      'fuDe' as keyof StarContent,
  parents:     'fuMu' as keyof StarContent,
};

interface ParsedContent {
  dingdiao: string;
  lundian: string;
  yiju: string;
  chuchu: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dingdiao: '', lundian: '', yiju: '', chuchu: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【Nhất句话定调】**') && !content.includes('**【核心论断】**')) {
    out.lundian = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    if (p.name === 'Nhất句话定调') out.dingdiao = text;
    else if (p.name === '核心论断') out.lundian = text;
    else if (p.name === 'Lá số依据') out.yiju = text;
    else if (p.name === '经典出处') out.chuchu = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** Chính Tinh属性简介（用于 SEO 页"了解 XX Sao"section） */
export const STAR_BRIEF_SEO: Record<string, string> = {
  'Tử Vi': 'Tử Vi为帝Sao，主tôn quý，化气为尊。落Mệnh Chủ有领导气场、宜大Bình台高位。',
  'Thiên Cơ': 'Thiên Cơ为trí tuệSao，主善变机灵，化气为善。落Mệnh Chủ聪明cơ biến、宜phù tá策划。',
  'Thái Dương': 'Thái Dương为Nam贵Sao，主名誉公务，化气为贵。落Mệnh Chủ光明磊落、宜公职名声。',
  'Vũ Khúc': 'Vũ Khúc为财Sao，主cương nghịquả quyết，化气为财。落Mệnh Chủ理财能力强、宜实业金融。',
  'Thiên Đồng': 'Thiên Đồng为福Sao，主ôn hòa享乐，化气为福。落Mệnh Chủ性情ôn hòa、有福气。',
  'Liêm Trinh': 'Liêm Trinh为次đào hoaSao，文武兼备，化气为囚。落Mệnh Chủđa tài多艺、感情丰富。',
  'Thiên Phủ': 'Thiên Phủ为南帝守财Sao，主ổn trọngbảo thủ，化气为令。落Mệnh Chủ品行端正、善守tài khố。',
  'Thái Âm': 'Thái Âm为tháng亮富贵Sao，主Điền Trạch富贵，化气为富。落Mệnh Chủ感情细腻、NữMệnh最Cát。',
  'Tham Lang': 'Tham Lang为đào hoadục vọngSao，đa tài多社交，化气为đào hoa。落Mệnh Chủ多tài nghệ、社交广。',
  'Cự Môn': 'Cự Môn为thị phi口才Sao，主辩论传媒，化气为暗。落Mệnh Chủ口才好、宜律师教师。',
  'Thiên Tướng': 'Thiên Tướng为印Saophù tá，主忠厚老实，化气为印。落Mệnh Chủ品行端正、宜hành chính法务。',
  'Thiên Lương': 'Thiên Lương为老人Sao荫Sao，善逢Hung化Cát，化气为荫。落Mệnh Chủ慈悲善良、宜法律医学。',
  'Thất Sát': 'Thất Sát为tướng tinh，主孤独quả quyết冒险，化气为肃杀。落Mệnh Chủcương nghịquả quyết、宜军警创业。',
  'Phá Quân': 'Phá Quân为phá hoại创新Sao，主lục thân缘薄，化气为耗。落Mệnh Chủkhai sángbiến động、宜技术专长。',
};
