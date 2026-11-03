/**
 * 倪海厦 Thiên纪 / Địa纪 / 人纪 — 共享类型定义
 */

/** Tam纪分类 */
export type SanJiCategory = 'tianji' | 'diji' | 'renji';

/** 课程/模块 */
export interface NiModule {
  id: string;
  category: SanJiCategory;
  /** Tiếng Việt名 */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 简短副标题 */
  subtitle: string;
  /** 简要描述 */
  description: string;
  /** 详细介绍（多段） */
  details: string[];
  /** 学派归属 */
  school?: string;
  /** 课giờ信息 */
  lessons?: string;
  /** 参考书目 */
  references: string[];
  /** 核心概念/关键词 */
  keywords: string[];
  /** 图标字符 */
  icon: string;
  /** 状态 */
  status: 'active' | 'preview' | 'coming';
  /** 排序Quyền重 */
  order: number;
  /** 路由 slug */
  slug: string;
  /** Tý章节 */
  chapters: NiChapter[];
}

/** 章节 */
export interface NiChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** 核心要点 */
  keyPoints: string[];
  /** 倪师语录 */
  quotes?: string[];
  /** 排序 */
  order: number;
}

/** 易经LụcThậpTứ卦 */
export interface Hexagram {
  number: number;
  name: string;
  /** 卦象描述 如「Thiên泽履」 */
  composition: string;
  /** 上卦 */
  upper: string;
  /** 下卦 */
  lower: string;
  /** 卦辞要点 */
  meaning: string;
  /** 倪师讲解要点 */
  niInterpretation: string;
  /** 断事要诀 */
  divination: string;
}

/** 堪舆条目 */
export interface FengShuiEntry {
  id: string;
  title: string;
  category: 'yangzhai' | 'yinzhai' | 'theory';
  description: string;
  keyPoints: string[];
}

/** 人纪中医条目 */
export interface MedicalEntry {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  keyPoints: string[];
  relatedHerbs?: string[];
  relatedAcupoints?: string[];
}

/** 针灸经验穴位 */
export interface AcuExperience {
  id: number;
  /** 适应症/疾Bệnh */
  condition: string;
  /** 穴位组合 */
  acupoints: string;
  /** 分类 */
  category: string;
  /** 补充说明 */
  note?: string;
}

/** 透针透穴法 */
export interface TransNeedling {
  id: number;
  /** 透穴组合：A透B */
  combo: string;
  /** 治疗症状 */
  indication: string;
  /** 配穴 */
  supporting?: string;
  /** 来源 */
  source: string;
}

/** 汉唐方剂 */
export interface HantangFormula {
  id: number;
  /** 方名（如「白带丸」、「大禹丸」） */
  name: string;
  /** 主治疾Bệnh */
  indication: string;
  /** 核心理论（Nhất句话） */
  theory?: string;
  /** 主要成分（公开部分） */
  ingredients?: string;
}

/** 经典经方 */
export interface ClassicFormula {
  id: string;
  /** 方名 */
  name: string;
  /** 出处 */
  source: string;
  /** 组成药物 */
  composition: string;
  /** 主治 */
  indication: string;
  /** 倪师用法要点 */
  niUsage?: string;
}

/** Thiên纪课程集数结构 */
export interface TianjiEpisode {
  /** DVD编号 1-24 */
  dvd: number;
  /** 前半段主题 */
  firstHalf: string;
  /** 后半段主题 */
  secondHalf: string;
  /** 关键内容 */
  highlights: string[];
}
