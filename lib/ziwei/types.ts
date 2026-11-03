export interface BirthInfo {
  year: number;      // Gregorian year（已经过Týgiờ换ngày修正后的"Lập lá sốngày"）
  month: number;     // Gregorian month (1-12)
  day: number;       // Gregorian day
  hour: number;      // giờThìn branch index (0=Tý, 1=Sửu, ... 11=Hợi)
  gender: 'male' | 'female';
  name?: string;
  province?: string;   // 出生省份
  city?: string;       // 出生城市
  longitude?: number;  // 出生Địa经度（用于Giờ Thái Dương Thực校正）
  /**
   * 原始Nhập（用户在表单里实际填的giờ间），已知Giờ sinhgiờ始终保留。
   * 例：用户Nhập 5/9 23:55 → year/month/day 会被改成 5/10（次ngàyTýgiờ），
   *     而这里Lưu原始的 { year:Y, month:5, day:9, clockHour:23, clockMinute:55 }，
   *     用于在 chart 页让用户看见"已为你按Týgiờ换ngày规则归到次ngày"。
   */
  origInput?: {
    year: number;
    month: number;
    day: number;
    clockHour: number;
    clockMinute: number;
  };
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;    // positive = normal, negative = leap month
  lunarDay: number;
  yearStem: number;      // 0-9 (GiápẤtBínhĐinhMậuKỷCanhTânNhâmQuý)
  yearBranch: number;    // 0-11 (TýSửuDầnMãoThìnTỵNgọMùiThânDậuTuấtHợi)
  isLeapMonth: boolean;
  /** 节气Tứ Trụ（năm/tháng/ngày/Thời Trụ），如 ["NhâmNgọ","NhâmTý","NhâmTuất","CanhTuất"] */
  fourPillars?: [string, string, string, string];
  /** 非节气Tứ Trụ（Âm lịch口径：正tháng初Nhất换năm + Âm lịchtháng，与Tử Vi同历法）——节气交界ngày其Nguyệt Trụ会与 fourPillars Bất同 */
  fourPillarsLunar?: [string, string, string, string];
}

export type SiHua = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';

/** Tinh Tú亮度 8 档（Tử Vi Đẩu Số标准）——'Địa' 为 XD1（现代修订亮度表第Nhất版）额外等级 */
export type StarBrightness = 'Miếu' | 'Vượng' | 'Đắc' | 'Lợi' | 'Bình' | 'Bất' | '闲' | 'Hạn' | 'Địa';

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  /** 粗粒度亮度（保留向后兼容，算法判断用） */
  brightness?: 'bright' | 'normal' | 'dim';
  /** 原始 7 档亮度（Miếu/Vượng/Đắc/Lợi/Bình/Bất/Hạn）—— Hiển thị层使用 */
  brightnessRaw?: StarBrightness;
}

export interface SelfSihuaMark {
  siHua: SiHua;       // Lộc/Quyền/Khoa/Kỵ
  starName: string;   // 自化的Sao
}

export interface Palace {
  branch: number;      // 0-11 (Địa支索引)
  stem: number;        // 0-9 (Thiên干索引)
  name: string;        // Cung名
  stars: Star[];
  daXianAge?: [number, number];   // Đại Hạnnăm龄段
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** Cung干自化（倪师体系核心） */
  selfSihua?: SelfSihuaMark[];
  /** Đối CungĐịa支索引（永远 = (branch + 6) % 12） */
  oppositeBranch?: number;
  /** 是否Cung Vô Chính Diệu（无Chính Tinh） */
  isEmpty?: boolean;
  /** 若为Cung Vô Chính Diệu，借自哪个Cung的Địa支索引 = oppositeBranch */
  borrowedFromBranch?: number;
  /** 若为Cung Vô Chính Diệu，借自哪个Cung名 */
  borrowedFromName?: string;
  /** 若为Cung Vô Chính Diệu，借到的Đối CungChính Tinh名列表（结构化数据，文案层Bất再需要从文本反查） */
  borrowedStars?: string[];
}

export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string;    // 化LộcSao名
  quan: string;  // 化QuyềnSao名
  ke: string;    // 化KhoaSao名
  ji: string;    // 化KỵSao名
}

export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number;    // Đại HạnCung的Thiên干索引（用于Đại HạnTứ Hóa）
  stemName?: string;
  siHua?: DaXianSiHua;   // 该Đại HạnTứ Hóa（基于Cung干）
}

export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number;    // MệnhĐịa支
  shenGongBranch: number;    // ThânĐịa支
  wuxingJu: number;          // Ngũ行Cục (2,3,4,5,6)
  wuxingJuName: string;      // e.g. 'Thủy Nhị Cục'
  ziweiPos: number;          // Tử ViSao位置
  palaces: Palace[];         // 12Cung，按Địa支0-11排序
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
  /** Signed analysis-cache eligibility marker assigned by /api/generate. */
  analysisCacheProfile?: string;
  /** Mệnh ChủSao（按MệnhĐịa支查表） */
  mingZhu?: string;
  /** Thân ChủSao（按生nămĐịa支查表） */
  shenZhu?: string;
  /** ÂmDươngGiới tính（DươngNam/ÂmNam/DươngNữ/ÂmNữ） */
  yinYangGender?: string;
}
