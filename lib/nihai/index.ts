/**
 * 倪海厦 Thiên纪 / Địa纪 / 人纪 — 统Nhất导出
 *
 * 倪海厦（1954-2012），美国汉唐中医学院创办人，
 * 当代少见的「Mệnh、相、卜、山、医」Ngũ术兼备之旷世奇人。
 *
 * Tam纪体系：
 *   Thiên纪 —— 上知Thiên文（Tử Vi Đẩu Số、易经、堪舆、推Mệnh、面相、测字）
 *   Địa纪 —— 下知Địa理（国家Địa理志、风水与国运）
 *   人纪 —— 中知人事（针灸、黄帝内经、神农本草经、伤寒论、金匮要略）
 */

export * from './types';
export { TIANJI_MODULES, HEXAGRAMS, FENGSHUI_ENTRIES, TIANJI_EPISODES, TIANJI_QUOTES, TIANJI_STATS } from './tianji';
export { RENJI_MODULES, ACU_EXPERIENCES, TRANS_NEEDLING, HANTANG_FORMULAS, CLASSIC_FORMULAS, RENJI_STATS } from './renji';
export { DIJI_MODULES, DIJI_STATS } from './diji';

/** 倪海厦完整传记 */
export const NI_HAIXIA_BIO = {
  name: '倪海厦',
  nameVariant: '倪海夏',
  alias: '梵宇龙',
  birth: '1954năm1tháng1ngày',
  death: '2012năm1tháng31ngày',
  birthPlace: '台北市',
  ancestry: '浙江瑞安',
  family: 'Thất个Huynh Đệ姊妹，排行第Ngũ',
  education: '东吴大学政治系',
  title: '美国汉唐中医学院创办人',
  titles: [
    'Mệnh、相、卜、山、医 Ngũ术兼备之旷世奇人',
    '美国汉唐中医学院院长',
    '美国加州中y dược大学Bác Sỹ指导教授',
    '佛罗里达州卫生署中医委员会最高委员（2000-2003）',
    '佛州针灸委员会委员及副主席',
    '经方派现代继承者',
    'Thiên纪、人纪教学体系创立者',
    '海外优秀华人奖获Đắc者',
  ],
  /** 师承关系 */
  teachers: [
    { name: '周左宇', background: '北京Tứ代家传名医，1949năm后移居台湾', subject: '针灸', period: '1977-1981' },
    { name: '徐济民', background: '江苏籍上海名医', subject: '针灸', period: '1970s' },
    { name: '姜佐景传承', background: '师承曹颖甫的经方家', subject: '经方', period: '基隆中药行学徒期间' },
  ],
  /** 核心理念 */
  corePhilosophy: [
    '大道至简——飞Sao飞来飞去太复杂，Bất搞这个',
    'Mệnh为本，Tam Phương为用',
    '人事努力+Địa理调整 > 先ThiênMệnh运（2/3 > 1/3）',
    '中医是物理医学，从物理角度分析人体',
    '辨证Bất辨Bệnh——中医看的是证型而非Bệnh名',
    '经方Nhất剂知，Nhị剂已',
    'Bất希望中华文化失传，所以教了许多学生',
    '算Mệnh就是Nhất个讨论果的哲学',
    '文字只是船，真理才是彼岸',
  ],
  /** 人生大事记 */
  timeline: [
    { year: '1954', event: '出生于台北市，祖籍浙江瑞安' },
    { year: '1970s', event: '高中giờ以《医宗金鉴》治愈Nhị姐tháng经痛，立志习医' },
    { year: '1977-1981', event: '向周左宇医师学习针灸' },
    { year: '1978', event: '军旅服役马祖军医部，获"马祖神医"称号，giờnăm24岁' },
    { year: '1979', event: '退伍后以化名"梵宇龙"开始算Mệnh看相sự nghiệp' },
    { year: '1980', event: '移民美国' },
    { year: '1988', event: '在台北金山南路开办"Thiên文Địa理班"，传授Tử Vi Đẩu Số和Dương宅风水' },
    { year: '1991', event: '成为美国佛罗里达州Đăng ký针灸师' },
    { year: '1993', event: '在佛州Merritt Island选定汉唐中医学院Địa产' },
    { year: '1994', event: '完成《Thiên纪》系列著作录制，共24集' },
    { year: '1995', event: '创办汉唐中医学院' },
    { year: '2000-2003', event: '任佛州卫生署中医委员会最高委员' },
    { year: '2004', event: '在台北开设《人纪》中医教学班' },
    { year: '2005', event: '《人纪》系列教学DVD出版' },
    { year: '2007', event: '开始撰写《Địa纪》' },
    { year: '2010', event: '成立台北汉唐经方中医诊所；受邀第Tam届扶Dương论坛整Thiên演讲' },
    { year: '2011', event: '成立深圳汉唐经方中医馆' },
    { year: '2012', event: '1tháng31ngày因心肺Suy竭在台北辞世，享năm59岁' },
  ],
  /** 著作体系 */
  publications: {
    originalBooks8: ['黄帝内经素问', '黄帝内经', '神农本草经', '针灸', '伤寒论', '金匮', '人间道', 'Thiên Cơ道·Địa脉道'],
    totalBooks: '26-44册（含注解版教材、医案全集、穴位精解等）',
    hantangFormulas: '汉唐100方',
    classicFormulas: '259个经典配方',
    medicalCases: '医案全集7本',
    totalVideoHours: '200+小giờ',
  },
  /** Tam纪体系 */
  sanJi: {
    tianji: {
      name: 'Thiên纪',
      meaning: '上知Thiên文',
      content: 'Tử Vi Đẩu Số、易经64卦、堪舆学、推Mệnh学、面相学、测字术',
      recordYear: 1994,
      episodes: 24,
      hdEpisodes: 83,
      hoursPerEpisode: 2,
      totalHours: 48,
      books: ['Thiên Cơ道', '人间道', 'Địa脉道', '64卦易图'],
      schools: ['Tam Hợp派（Tử Vi Đẩu Số）', '象数派（易经）', 'CửuSao派（堪舆）', '河洛数理派（推Mệnh）'],
      structure: '前Nhất小giờ讲Mệnh学，后Nhất小giờ讲易经',
    },
    renji: {
      name: '人纪',
      meaning: '中知人事',
      content: '针灸大成(44集)、黄帝内经(20集)、神农本草经(46集)、伤寒论、金匮要略(20集)',
      completionYear: '2004-2005',
      totalLessons: '150+集',
      learningOrder: '针灸→黄帝内经→神农本草经→伤寒论→金匮要略',
      acuExperience: 215,
      transNeedling: 31,
      hantangFormulas: 100,
    },
    diji: {
      name: 'Địa纪',
      meaning: '下知Địa理',
      content: '国家Địa理志（Mùi完成）',
      status: '倪师Mùi竟之业',
      note: '原计划60岁后著述，2012năm辞世',
      startYear: 2007,
      existingContent: 'Thiên纪课程中堪舆学部分 + 后人整理遗稿',
    },
  },
  /** 人格特征 */
  personality: {
    算Mệnh风格: '铁口直断Bất留余Địa',
    音乐爱好: '最喜老鹰乐队《加州旅馆》',
    生活技能: '做饭洗衣样样精通，Nhất手面点功夫人人喊赞',
    工作态度: '床头经năm放纸笔，遭遇疑难杂症giờ向先师祝祷',
    睡眠: '多năm夜间睡眠Bất足Tam小giờ',
    患者评价: '常被美国Bệnh患称为"最后的希望（The last hope）"',
  },
  /** 传人选拔标准 */
  discipleStandards: [
    '心性好',
    '个性强',
    '主见强',
    '敏锐观察力',
    '勇于批判错误理论',
  ],
};

/** Tam纪导航 */
export const SANJI_CATEGORIES = [
  { key: 'tianji' as const, name: 'Thiên纪', nameEn: 'Tian Ji', icon: '⊙', meaning: '上知Thiên文', color: '#d4a843', href: '/tianji' },
  { key: 'diji' as const, name: 'Địa纪', nameEn: 'Di Ji', icon: '⊞', meaning: '下知Địa理', color: '#6b8a5e', href: '/diji' },
  { key: 'renji' as const, name: '人纪', nameEn: 'Ren Ji', icon: '⊕', meaning: '中知人事', color: '#8b6b9e', href: '/renji' },
] as const;
