// Thiên干 Heavenly Stems
export const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Địa支 Earthly Branches
export const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// giờThìn对应Địa支
export const SHICHEN = [
  { branch: 0, name: 'giờ Tý', range: '23:00-01:00' },
  { branch: 1, name: 'giờ Sửu', range: '01:00-03:00' },
  { branch: 2, name: 'giờ Dần', range: '03:00-05:00' },
  { branch: 3, name: 'giờ Mão', range: '05:00-07:00' },
  { branch: 4, name: 'giờ Thìn', range: '07:00-09:00' },
  { branch: 5, name: 'giờ Tỵ', range: '09:00-11:00' },
  { branch: 6, name: 'giờ Ngọ', range: '11:00-13:00' },
  { branch: 7, name: 'giờ Mùi', range: '13:00-15:00' },
  { branch: 8, name: 'giờ Thân', range: '15:00-17:00' },
  { branch: 9, name: 'giờ Dậu', range: '17:00-19:00' },
  { branch: 10, name: 'giờ Tuất', range: '19:00-21:00' },
  { branch: 11, name: 'giờ Hợi', range: '21:00-23:00' },
];

// Thập Nhị Cung名顺序；Địa支索引从Mệnh起每减 1 前进NhấtCung（Lập lá số界面为逆giờ针）
export const PALACE_NAMES_ORDER = [
  'Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Nữ', 'Tài Bạch', 'Tật Ách',
  'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'
];

// 纳音Ngũ Hành（30组干支对的Ngũ Hành）
export const NAYIN_ELEMENTS = [
  'Kim','Hỏa','Mộc','Thổ','Kim','Hỏa','Thủy','Thổ','Kim','Mộc',
  'Thủy','Thổ','Hỏa','Mộc','Thủy','Kim','Hỏa','Mộc','Thổ','Kim',
  'Hỏa','Thủy','Thổ','Kim','Mộc','Thủy','Thổ','Hỏa','Mộc','Thủy'
];

// Ngũ Hành → Cục数
export const ELEMENT_TO_JU: Record<string, number> = {
  'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6
};

// Cục数名称
export const JU_NAMES: Record<number, string> = {
  2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục'
};

// Tứ Hóa表（năm干 → [化Lộc, 化Quyền, 化Khoa, 化Kỵ]）
export const SI_HUA_TABLE: Record<number, [string, string, string, string]> = {
  0: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp
  1: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],   // Ất
  2: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],   // Bính
  3: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],   // Đinh
  4: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],   // Mậu
  5: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],   // Kỷ
  6: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],   // Canh
  7: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],   // Tân
  8: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],   // Nhâm
  9: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],   // Quý
};

// Thiên KhôiThiên Việt表（năm干 → [Thiên Khôibranch, Thiên Việtbranch]）
export const TIANKUI_TABLE: Record<number, [number, number]> = {
  0: [1, 7],   // Giáp: 魁Sửu 钺Mùi
  1: [0, 8],   // Ất: 魁Tý 钺Thân
  2: [11, 9],  // Bính: 魁Hợi 钺Dậu
  3: [11, 9],  // Đinh: 魁Hợi 钺Dậu
  4: [1, 7],   // Mậu: 魁Sửu 钺Mùi
  5: [0, 8],   // Kỷ: 魁Tý 钺Thân
  6: [1, 7],   // Canh: 魁Sửu 钺Mùi
  7: [6, 2],   // Tân: 魁Ngọ 钺Dần
  8: [3, 5],   // Nhâm: 魁Mão 钺Tỵ
  9: [3, 5],   // Quý: 魁Mão 钺Tỵ
};

// Lộc Tồn表（năm干 → Lộc Tồnbranch）
export const LUCUN_TABLE: Record<number, number> = {
  0: 2,   // Giáp: Dần
  1: 3,   // Ất: Mão
  2: 5,   // Bính: Tỵ
  3: 6,   // Đinh: Ngọ
  4: 5,   // Mậu: Tỵ
  5: 6,   // Kỷ: Ngọ
  6: 8,   // Canh: Thân
  7: 9,   // Tân: Dậu
  8: 11,  // Nhâm: Hợi
  9: 0,   // Quý: Tý
};

// Thiên Mã表（năm支Tam Hợp → Thiên Mãbranch）
// DầnNgọTuất→Thân, ThânTýThìn→Dần, TỵDậuSửu→Hợi, HợiMãoMùi→Tỵ
export const TIANMA_TABLE: Record<number, number> = {
  2: 8,   // Dầnnăm → Thân
  6: 8,   // Ngọnăm → Thân
  10: 8,  // Tuấtnăm → Thân
  8: 2,   // Thânnăm → Dần
  0: 2,   // Týnăm → Dần
  4: 2,   // Thìnnăm → Dần
  5: 11,  // Tỵnăm → Hợi
  9: 11,  // Dậunăm → Hợi
  1: 11,  // Sửunăm → Hợi
  11: 5,  // Hợinăm → Tỵ
  3: 5,   // Mãonăm → Tỵ
  7: 5,   // Mùinăm → Tỵ
};

// ★ 所有Tinh Diệu亮度（Chính Tinh + Phụ Tinh）已Thiên Di到 algorithm.ts → astro.config({ brightness })
// 覆写范围：9 颗Chính Tinh + 3 颗Phụ Tinh（Văn Khúc/Linh Tinh/Kình Dương），共 24 处差异修正。
// 其余Tinh Diệu（Vũ Khúc/Liêm Trinh/Tham Lang/Cự Môn/Phá Quân/Văn Xương/Hỏa Tinh/Đà La）iztro 默认值与全书Nhất致，无需覆写。
// 旧 STAR_BRIGHTNESS 是Tử代码（从Mùi被引用），已在 2026-05-08 清理。

// Chính Tinh描述（倪师体系）
export const STAR_DESCRIPTIONS: Record<string, { keywords: string; nature: string; element: string }> = {
  'Tử Vi': { keywords: 'đế vương·tôn quý·độc lập', nature: 'trung tính thiên cát', element: 'Thổ' },
  'Thiên Cơ': { keywords: 'trí tuệ·cơ biến·mưu lược', nature: 'Cát Tinh', element: 'Mộc' },
  'Thái Dương': { keywords: 'dương cương·quan quý·khảng khái', nature: 'Cát Tinh', element: 'Hỏa' },
  'Vũ Khúc': { keywords: 'tài phú·cương nghị·quả đoán', nature: 'trung tính', element: 'Kim' },
  'Thiên Đồng': { keywords: 'ôn hòa·hưởng phúc·tùy duyên', nature: 'Cát Tinh', element: 'Thủy' },
  'Liêm Trinh': { keywords: 'tài nghệ·hình tù·đào hoa', nature: 'hung trung hữu cát', element: 'Hỏa' },
  'Thiên Phủ': { keywords: 'tài khố·ổn trọng·bảo thủ', nature: 'Cát Tinh', element: 'Thổ' },
  'Thái Âm': { keywords: 'nhu mỹ·tài phú·âm nhu', nature: 'Cát Tinh', element: 'Thủy' },
  'Tham Lang': { keywords: 'dục vọng·đào hoa·đa tài', nature: 'trung tính', element: 'Mộc' },
  'Cự Môn': { keywords: 'khẩu thiệt·thị phi·thiện biện', nature: 'hung trung hữu cát', element: 'Thủy' },
  'Thiên Tướng': { keywords: 'phù tá·hành chính·ấn thụ', nature: 'Cát Tinh', element: 'Thủy' },
  'Thiên Lương': { keywords: 'ấm hộ·y dược·trưởng bối', nature: 'Cát Tinh', element: 'Thổ' },
  'Thất Sát': { keywords: 'tướng tinh·quả quyết·cô khắc', nature: 'Sát Tinh', element: 'Kim' },
  'Phá Quân': { keywords: 'khai sáng·biến động·phá hoại', nature: 'Sát Tinh', element: 'Thủy' },
};
