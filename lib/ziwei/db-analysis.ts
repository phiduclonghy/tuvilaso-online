/**
 * lib/ziwei/db-analysis —— 开源占位版（论断内容库Bất在开源范围）
 *
 * 线上完整版包含 14 Chính Tinh × 13 Cung Vị语境的详细Mệnh Lý论断（Nhất句话定调 / 核心论断 /
 * Lá số依据 / 经典出处），属于核心内容、Bất随Lập lá số引擎开源。此文件仅保留 SEO
 * Tri thức页框架所需的「类型 + Cung Vị/主题标签」（Tử Vi Đẩu Số通用术语，非独有内容），
 * 论断内容库 STAR_DB 置空 —— 因此Tri thức库详情页会生成 0 条静态路由。
 *
 * Lập lá số内核（An Sao算法、Tứ Hóa、Cách Cục识别、Cổ thư原文）完全开放，
 * 见 lib/ziwei 下的 algorithm.ts / patterns.ts / sihua.ts 等。
 */

export type TopicKey =
  | 'overview' | 'personality' | 'love' | 'career' | 'wealth' | 'health'
  | 'family' | 'children' | 'move' | 'friends' | 'home' | 'spirit' | 'parents';

// iztro zh-CN Cung Vị名：Mệnh保留「Cung」字，其余无「Cung」字，「交友」在 iztro 里叫「Nô Bộc」
export const TOPIC_PALACE_NAME: Record<TopicKey, string> = {
  overview:    'Mệnh',
  personality: 'Mệnh',
  love:        'Phu Thê',
  career:      'Quan Lộc',
  wealth:      'Tài Bạch',
  health:      'Tật Ách',
  family:      'Huynh Đệ',
  children:    'tử nữ',
  move:        'Thiên Di',
  friends:     'Nô Bộc',
  home:        'Điền Trạch',
  spirit:      'Phúc Đức',
  parents:     'Phụ Mẫu',
};

export const TOPIC_LABEL: Record<TopicKey, string> = {
  overview:    'Mệnh格总览',
  personality: 'tính cách特质',
  love:        '感情hôn nhân',
  career:      'sự nghiệp职业',
  wealth:      'tài phú运势',
  health:      'sức khỏe状况',
  family:      'Huynh Đệ合伙',
  children:    'tử nữ缘分',
  move:        'Thiên Di外出',
  friends:     '人际贵人',
  home:        'Điền TrạchBất动产',
  spirit:      '精神Phúc Đức',
  parents:     'Phụ Mẫutrưởng bối',
};

/**
 * 论断内容库（14 Chính Tinh × 各Cung Vị语境的详细断语）——核心内容，Bất在开源范围。
 * 此处置空；Tri thức库 SEO 页因 `exists=false` 生成 0 条静态详情路由，但列表框架仍可运行。
 */
export const STAR_DB: Record<string, unknown> = {};
