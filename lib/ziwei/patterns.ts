/**
 * Tử Vi Đẩu Số nhận dạng Cách Cục（v2 bản nghiêm ngặt hóa）
 *
 * Nguyên tắc thiết kế：
 * 1. Ưu tiên điều kiện cổ thư：mỗi Cách Cục liệt kê cấu trúc ba tầng "bắt buộc / cộng điểm / phá cách"，xuất xứ có thể tra cứu
 * 2. Lập trường của 倪师：không sử dụng Cung can tự hóa、Đại Hạn Tứ Hóa、Lai Nhân Cung đẳng công cụ phi sao phái
 * 3. Miếu Vượng Lợi Hãm：dùng trường brightness（bright=Miếu Vượng、normal=Bình、dim=Hãm）
 * 4. Tam Phương Tứ Chính hội chiếu：Mệnh + Tài Bạch + Quan Lộc + Thiên Di
 * 5. Giáp Cung：hai Cung trước sau Mệnh
 *
 * Xuất xứ cổ thư chính：
 *  - 《Tử Vi Đẩu Số toàn tập》（Trần Đoàn tổ sư truyền，bản in thời Minh）
 *  - 《Tử Vi Đẩu Số toàn thư》（La Hồng Tiên biên，bản in thời Minh）
 *  - 《Cốt Tủy phú》《Nữ Mệnh cốt tủy phú》《Thập Nhị Cung chư Sao Đắc Địa hợp cách quyết》
 *  - 倪师《Thiên Kỷ》Tử Vi Đẩu Số giảng nghĩa
 */

import type { ZiweiChart, Palace, Star, SiHua } from './types';

// ────────────────── Kiểu ──────────────────
export interface PatternCondition {
  required: string[];   // điều kiện bắt buộc（đã thỏa mãn）
  bonus?: string[];     // hạng mục cộng điểm（đã kích hoạt）
  breaking?: string[];  // cảnh báo phá cách（đã kích hoạt）
}

export interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];                 // Cung Vị liên quan
  conditions?: PatternCondition;     // điều kiện thành lập phân tầng（v2 bổ sung）
  source?: string;                   // xuất xứ cổ thư（v2 bổ sung）
}

// ────────────────── Hằng số ──────────────────
const SHA_NAMES = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
const SHA_HARD = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];   // Tứ Sát
const SHA_KONG = ['Địa Không', 'Địa Kiếp'];                  // Không Kiếp
const ZUO_YOU = ['Tả Phù', 'Hữu Bật'];
const CHANG_QU = ['Văn Xương', 'Văn Khúc'];
const KUI_YUE = ['Thiên Khôi', 'Thiên Việt'];

// ────────────────── Hàm hỗ trợ ──────────────────
function getMajorStarNames(palace: Palace): string[] {
  return palace.stars.filter(s => s.type === 'major').map(s => s.name);
}
function findStar(palace: Palace, name: string): Star | undefined {
  return palace.stars.find(s => s.name === name);
}
function hasStar(palace: Palace, name: string): boolean {
  return palace.stars.some(s => s.name === name);
}
function findStarPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === name));
}
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}
function shaCountInPalace(palace: Palace, list: string[] = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}
function hasShaInPalace(palace: Palace, list: string[] = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}
function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
function getDuiGong(chart: ZiweiChart, branch: number): Palace | undefined {
  return getPalaceByBranch(chart, (branch + 6) % 12);
}
function getJiaPalaces(chart: ZiweiChart, branch: number): { prev?: Palace; next?: Palace } {
  return {
    prev: getPalaceByBranch(chart, (branch + 11) % 12),
    next: getPalaceByBranch(chart, (branch + 1) % 12),
  };
}
function sanFangAllStars(chart: ZiweiChart): Set<string> {
  return new Set(getSanFangPalaces(chart).flatMap(p => p.stars.map(s => s.name)));
}
function sanFangShaCount(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  return getSanFangPalaces(chart).reduce((sum, p) => sum + shaCountInPalace(p, list), 0);
}
function isBright(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';
}
function isDim(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';
}
function getStarSiHua(palace: Palace, starName: string): Star['siHua'] | undefined {
  return findStar(palace, starName)?.siHua;
}
// Tứ Hóa gắn trên trường siHua của Tinh Diệu，không phải tên Sao độc lập——không thể dùng hasStar / sanFangAllStars để tra「Hóa Lộc」
function palaceHasSiHua(palace: Palace, hua: SiHua): boolean {
  return palace.stars.some(s => s.siHua === hua);
}
function sanFangHasSiHua(chart: ZiweiChart, hua: SiHua): boolean {
  return getSanFangPalaces(chart).some(p => palaceHasSiHua(p, hua));
}
const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// ────────────────── Bộ nhận dạng chính cách ──────────────────

/** Quân Thần Khánh Hội：Tử Vi nhập Mệnh，Tả Phù Hữu Bật đồng hội（đồng Cung hoặc Tam Phương） */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, 'Tử Vi')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('Tả Phù');
  const hasYou = sanFangSet.has('Hữu Bật');
  if (!hasZuo || !hasYou) return;

  const required = ['Tử Vi nhập Mệnh', 'Tả Phù Hữu Bật đồng hội Tam Phương Tứ Chính'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('lại hội Văn Xương hoặc Văn Khúc');
  if (sanFangSet.has('Thiên Khôi') || sanFangSet.has('Thiên Việt')) bonus.push('Khôi Việt quý nhân gia chiếu');
  if (getStarSiHua(ming, 'Tử Vi') === 'Quyền') bonus.push('Tử Vi hóa Quyền');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('Địa Không Địa Kiếp song giáp hội chiếu（Tử Vi kỵ Không Kiếp）');

  patterns.push({
    name: 'Quân Thần Khánh Hội',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Tử Vi nhập Mệnh，Tả Phù Hữu Bật đồng hội，đế vương đắc hiền thần phù tá，chủ đại phú đại quý、mệnh thống ngự。Nhất sinh quý nhân bất tuyệt，nghi đi con đường chính thương cao vị、lãnh tụ xuyên giới。',
    palaces: ['Mệnh'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Quân Thần Khánh Hội cách》',
  });
}

/** Tử Phủ Đồng Cung：Tử Vi+Thiên Phủ tại Mệnh（giới hạn Dần、Thân Cung） */
function detectZiFu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const ziwei = findStarPalace(chart, 'Tử Vi');
  const tianfu = findStarPalace(chart, 'Thiên Phủ');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['Tử Vi Thiên Phủ đồng nhập Mệnh']
    : ['Tử Vi Thiên Phủ đồng Cung（không tại Mệnh，hội chiếu giảm lực）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('Tả Phù') && sanFangSet.has('Hữu Bật')) bonus.push('Tả Phù Hữu Bật đồng hội');
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('lại hội Xương Khúc');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('Tử Phủ Cung tọa Không Kiếp（phá quý khí của Tử Phủ）');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('Tử Phủ Cung kiến song Sát đồng tọa');

  patterns.push({
    name: 'Tử Phủ Đồng Cung',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? 'Tử Vi Thiên Phủ đồng nhập Mệnh，đế tướng tịnh lâm，mệnh tôn quý。Chủ phẩm hạnh đoan chính、y thực vô ưu、có tài lãnh đạo，nghi đảm nhiệm chức vụ quan trọng。Cần Tả Phù Hữu Bật phối hợp mới thành đại cách trọn vẹn。'
      : 'Tử Vi Thiên Phủ đồng Cung nhưng chưa tọa Mệnh，chủ Nhất sinh có quý nhân quý khí nương tựa，nhưng bản Thân chưa chắc đại phú đại quý，cần xem hội chiếu Cát Sát mà định。',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Tử Phủ Đồng Cung cách》',
  });
}

/** Phủ Tướng Triều Viên：Thiên Phủ、Thiên Tướng phân biệt tọa thủ Tam Phương Tứ Chính của Mệnh */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, 'Thiên Phủ');
  const tianxiang = findStarPalace(chart, 'Thiên Tướng');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['Thiên Phủ tọa Mệnh Tam Phương', 'Thiên Tướng tọa Mệnh Tam Phương', 'hai Sao bất đồng Cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, 'Lộc Tồn') || palaceHasSiHua(ming, 'Lộc')) bonus.push('Mệnh kiến Lộc');
  if (sanFangAllStars(chart).has('Tả Phù')) bonus.push('lại hội Tả Phù');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh tọa Sát Tinh');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Tam Phương Tứ Chính Sát Tinh quá nhiều');

  patterns.push({
    name: 'Phủ Tướng Triều Viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Phủ Thiên Tướng phân thủ Mệnh Tam Phương Tứ Chính，văn võ tịnh tế、Quyền ấn song huy，chủ Nhất sinh y thực phong túc、địa vị sùng cao。Cổ thư vân "Phủ Tướng Triều Viên thiên chung thực Lộc"，thường thấy ở giới chính trị、nhà quản lý doanh nghiệp。',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Phủ Tướng Triều Viên cách》',
  });
}

/** Dương Lương Xương Lộc：Thái Dương+Thiên Lương+Văn Xương+Lộc Tồn Tứ Sao hội Mệnh，đại quý cách */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Thái Dương') || !sanFangSet.has('Thiên Lương') ||
      !sanFangSet.has('Văn Xương') || !sanFangSet.has('Lộc Tồn')) return;

  const sun = findStarPalace(chart, 'Thái Dương')!;
  const liang = findStarPalace(chart, 'Thiên Lương')!;
  const required = [
    'Thái Dương hội Mệnh Tam Phương',
    'Thiên Lương hội Mệnh Tam Phương',
    'Văn Xương hội Mệnh Tam Phương',
    'Lộc Tồn hội Mệnh Tam Phương',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, 'Thái Dương')) bonus.push('Thái Dương Miếu Vượng');
  if (isBright(liang, 'Thiên Lương')) bonus.push('Thiên Lương Miếu Vượng');
  if (sanFangHasSiHua(chart, 'Khoa')) bonus.push('lại hội hóa Khoa');
  if (isDim(sun, 'Thái Dương')) breaking.push('Thái Dương Lạc Hãm（Dương Lương thất huy）');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Tam Phương Sát nặng');

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương、Thiên Lương、Văn Xương、Lộc Tồn Tứ Sao tề hội Mệnh Tam Phương，hiệu xưng "Sao Khoa cử"，chủ thanh quý hiển đạt、vận thi cực tốt，nghi đi con đường học thuật、văn giáo、nghiên cứu、chứng nhận chuyên nghiệp，Nhất sinh công danh dễ thành。',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Dương Lương Xương Lộc cách》',
  });
}

/** Hỏa Tham Cách / Linh Tham Cách：Tham Lang+Hỏa Tinh hoặc Tham Lang+Linh Tinh đồng Cung hoặc hội chiếu */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, 'Tham Lang');
  if (!tan) return;
  const huo = findStarPalace(chart, 'Hỏa Tinh');
  const ling = findStarPalace(chart, 'Linh Tinh');

  for (const [shaName, shaPalace] of [['Hỏa Tinh', huo], ['Linh Tinh', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const required = [`Tham Lang${tan.branch === shaPalace.branch ? 'đồng Cung' : 'hội chiếu'}${shaName}`, 'Tham Lang hội chiếu Mệnh Tam Phương'];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, 'Tham Lang')) bonus.push('Tham Lang Miếu Vượng');
    if (getStarSiHua(tan, 'Tham Lang') === 'Lộc' || getStarSiHua(tan, 'Tham Lang') === 'Quyền') bonus.push('Tham Lang hóa Lộc/hóa Quyền');
    if (hasShaInPalace(tan, ['Kình Dương', 'Đà La'])) breaking.push('Tham Lang Cung lại kiến Dương Đà（phá lực hoạnh phát）');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('Tham Lang ngộ Không Kiếp（tài lai tài khứ）');

    patterns.push({
      name: shaName === 'Hỏa Tinh' ? 'Hỏa Tham Cách' : 'Linh Tham Cách',
      level: breaking.length ? 'good' : 'excellent',
      description: `Tham Lang ngộ ${shaName}${tan.branch === shaPalace.branch ? 'đồng Cung' : 'Tam Phương hội chiếu'}，chủ đột phát hoạnh tài、cơ hội bất ngờ ập đến。Cổ thư vân “Tham Lang ngộ Hỏa Linh，tất phát hoạnh tài”，nhưng đến nhanh đi cũng nhanh，nghi thấy tốt thì thu。${breaking.length ? 'Điều kiện phá cách của bàn này đã kích hoạt，lực phát giảm sút。' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: '《Tử Vi Đẩu Số Cốt Tủy phú》',
    });
  }
}

/** Vũ Tham Cách：Vũ Khúc+Tham Lang đồng Cung（Sửu、Mùi）hoặc đối chiếu */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, 'Vũ Khúc');
  const tan = findStarPalace(chart, 'Tham Lang');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const required = [
    wu.branch === tan.branch ? 'Vũ Khúc Tham Lang đồng Cung（Sửu/Mùi）' : 'Vũ Khúc Tham Lang Đối Cung củng chiếu',
    'hội chiếu Mệnh Tam Phương',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Hỏa Tinh') || sanFangAllStars(chart).has('Linh Tinh'))
    bonus.push('lại ngộ Hỏa Tinh/Linh Tinh（Hỏa Tham/Linh Tham điệp gia）');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Lộc') bonus.push('Vũ Khúc hóa Lộc');
  if (hasShaInPalace(wu, ['Kình Dương', 'Đà La'])) breaking.push('Vũ Tham Cung kiến Dương Đà');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('Vũ Tham Cung ngộ Không Kiếp');

  patterns.push({
    name: 'Vũ Tham Cách',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Vũ Khúc Tham Lang hội Mệnh，Sao tài giao huy với Sao đào hoa dục vọng，cổ thư vân "Vũ Tham bất phát thiếu niên nhân"——Tam Thập tuổi sau mới có thể hậu tích bạc phát。Chủ trung niên về sau đại phú đại quý，tài nguyên do nhân mạch、xã giao、quản lý dục vọng mà đến，thích hợp tài chính、đầu cơ、bán hàng、ngành giải trí。',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Cốt Tủy phú》',
  });
}

/** Sát Phá Lang：Thất Sát、Phá Quân、Tham Lang Tam Phương tề tụ */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thất Sát', 'Phá Quân', 'Tham Lang'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['Thất Sát、Phá Quân、Tham Lang Tam Sao tề nhập Mệnh Tam Phương Tứ Chính'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangHasSiHua(chart, 'Lộc') || sanFangHasSiHua(chart, 'Quyền')) bonus.push('Tam Phương có hóa Lộc hoặc hóa Quyền（động đắc hữu lực）');
  if (sanFangSet.has('Tả Phù') && sanFangSet.has('Hữu Bật')) bonus.push('Phụ Bật đồng hội（biến động trung đắc quý nhân）');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát Tinh quá nặng（động nhi vô thành）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Mệnh tọa Không Kiếp（động đắc tân khổ）');

  patterns.push({
    name: 'Sát Phá Lang',
    level: breaking.length ? 'caution' : 'good',
    description: 'Thất Sát、Phá Quân、Tham Lang Tam Sao hội Mệnh，mệnh cách khai sáng xông pha。Nhất sinh biến động nhiều、bất cam bình phàm，nghi khởi nghiệp、quân cảnh、nghiệp vụ、bán hàng。Trung niên về sau mới có thể ổn định thủ thành，lúc trẻ dễ vì xung động mà mất Lợi。',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Sát Phá Lang》',
  });
}

/** Cơ Nguyệt Đồng Lương：Thiên Cơ、Thái Âm、Thiên Đồng、Thiên Lương Tứ Sao tề nhập Mệnh Thiên Di Tài Quan */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['Thiên Cơ、Thái Âm、Thiên Đồng、Thiên Lương Tứ Sao tề nhập Mệnh Tam Phương Tứ Chính'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('Văn Xương') || sanFangSet.has('Văn Khúc')) bonus.push('lại hội Xương Khúc');
  if (sanFangHasSiHua(chart, 'Khoa')) bonus.push('lại hội hóa Khoa');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát Tinh quá nhiều（Cơ Nguyệt Đồng Lương kỵ Sát）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh tọa Sát');

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Cơ Thái Âm Thiên Đồng Thiên Lương Tứ Sao tề nhập Mệnh Thiên Di Tài Quan，văn chất bân bân、thông tuệ thiện mưu。Thích hợp nhất công chức、học thuật、văn nghệ、y tế、phục vụ đẳng ngành cần tích lũy ổn định，bất nghi mạo hiểm lớn đầu cơ lớn。',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Cơ Nguyệt Đồng Lương cách》',
  });
}

/** Liêm Trinh Thiên Tướng：đồng Cung */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, 'Liêm Trinh');
  const xiang = findStarPalace(chart, 'Thiên Tướng');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['Liêm Trinh Thiên Tướng đồng Cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, 'Lộc Tồn') || getStarSiHua(lian, 'Liêm Trinh') === 'Lộc') bonus.push('kiến Lộc Tồn hoặc Liêm Trinh hóa Lộc');
  if (sanFangAllStars(chart).has('Tả Phù')) bonus.push('Tả Phù hội chiếu');
  if (hasShaInPalace(lian, ['Kình Dương'])) breaking.push('Liêm Tướng Cung tọa Kình Dương（Liêm Sát Dương khuynh hướng）');
  if (getStarSiHua(lian, 'Liêm Trinh') === 'Kỵ') breaking.push('Liêm Trinh hóa Kỵ');

  patterns.push({
    name: 'Liêm Trinh Thiên Tướng Cách',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trinh Thiên Tướng đồng Cung，cách cục ấn thụ，chủ bỉnh công xử sự、danh thanh liêm，nghi đảm nhiệm công chức、quản lý hành chính、pháp vụ、kế hoạch。Sợ kiến Kình Dương hóa Kỵ，thì phản chủ quan phi。',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Vũ Khúc Thất Sát：đồng Cung，tướng tinh phối tài Sao */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, 'Vũ Khúc');
  const qi = findStarPalace(chart, 'Thất Sát');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['Vũ Khúc Thất Sát đồng Cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Quyền') bonus.push('Vũ Khúc hóa Quyền');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Lộc') bonus.push('Vũ Khúc hóa Lộc');
  if (getStarSiHua(wu, 'Vũ Khúc') === 'Kỵ') breaking.push('Vũ Khúc hóa Kỵ（Vũ Khúc hóa Kỵ vi triệu tài kiếp）');
  if (hasShaInPalace(wu, ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'])) breaking.push('Vũ Sát Cung Sát Tinh quá nhiều');

  patterns.push({
    name: 'Vũ Khúc Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Vũ Khúc Thất Sát đồng Cung，tướng tinh phối tài Sao，chủ quả quyết cương nghị、năng lực lý tài mạnh，thích hợp tài chính、quân cảnh、khởi nghiệp。Nhưng kỵ kiến hóa Kỵ Sát Tinh，nếu không sẽ hung hiểm。Nhất sinh phấn đấu、tích tài nhưng thao tâm。',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Thiên Đồng Thiên Lương：đồng Cung */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, 'Thiên Đồng');
  const liang = findStarPalace(chart, 'Thiên Lương');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['Thiên Đồng Thiên Lương đồng Cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương hội chiếu');
  if (getStarSiHua(tong, 'Thiên Đồng') === 'Lộc') bonus.push('Thiên Đồng hóa Lộc');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('Sát Tinh đồng tọa');

  patterns.push({
    name: 'Thiên Đồng Thiên Lương Cách',
    level: breaking.length ? 'neutral' : 'good',
    description: 'Thiên Đồng Thiên Lương đồng Cung，Sao Phúc cùng Sao Ấm cộng hội，chủ khoan hậu hòa thiện、thích giúp người，nghi y tế、giáo dục、tôn giáo、công ích xã hội。Nhưng thiên ôn hòa bảo thủ，khó thành Cục đại phú đại quý。',
    palaces: [tong.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Nhật Nguyệt Đồng Cung：Thái Dương Thái Âm Sửu hoặc Mùi Cung đồng Cung */
function detectRiYueTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const sun = findStarPalace(chart, 'Thái Dương');
  const moon = findStarPalace(chart, 'Thái Âm');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // phải là Sửu(1) hoặc Mùi(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`Thái Dương Thái Âm đồng nhập ${BRANCH_NAMES[sun.branch]} Cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('Mùi Cung Nhật Nguyệt đồng huy（cổ thư vân Mùi Cung Nhật Nguyệt song mỹ）');
  if (sanFangAllStars(chart).has('Văn Xương') && sanFangAllStars(chart).has('Văn Khúc')) bonus.push('Xương Khúc hội chiếu');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('Nhật Nguyệt Cung Sát Tinh đồng tọa');

  patterns.push({
    name: 'Nhật Nguyệt Đồng Cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `Thái Dương Thái Âm tại ${BRANCH_NAMES[sun.branch]} Cung đồng Cung，Âm Dương bình hành，văn võ kiêm bị。Chủ duyên khác phái tốt、sự nghiệp thuận lợi、danh tiếng vang xa。${sun.branch === 7 ? 'Mùi Cung Nhật Nguyệt song mỹ càng tốt。' : 'Sửu Cung Nhật Nguyệt đồng Cung lực lượng tương đối Bình。'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Nhật Nguyệt Giáp Mệnh：Thái Dương Thái Âm tại hai Cung trước sau Mệnh */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, 'Thái Dương');
  const prevHasMoon = hasStar(prev, 'Thái Âm');
  const nextHasSun = hasStar(next, 'Thái Dương');
  const nextHasMoon = hasStar(next, 'Thái Âm');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['Thái Dương Thái Âm phân cư hai Cung trước sau Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, 'Thái Dương')) bonus.push('Thái Dương Miếu Vượng');
  if (isBright(moonPalace, 'Thái Âm')) bonus.push('Thái Âm Miếu Vượng');
  if (isDim(sunPalace, 'Thái Dương') || isDim(moonPalace, 'Thái Âm')) breaking.push('Nhật Nguyệt Lạc Hãm（Giáp Mệnh vô quang）');

  patterns.push({
    name: 'Nhật Nguyệt Giáp Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương Thái Âm phân cư hai bên Mệnh giáp chiếu，quang minh lỗi lạc，Nhất sinh quý nhân tương trợ，sự nghiệp bồng bột。Nam chủ quan quý，Nữ chủ vượng phu hưng gia。Nhật Nguyệt phải bất Lạc Hãm mới là chân giáp。',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Nhật Nguyệt Giáp Mệnh》',
  });
}

/** Cự Nhật Đồng Cung：Cự Môn Thái Dương đồng nhập Dần hoặc Thân */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, 'Cự Môn');
  const sun = findStarPalace(chart, 'Thái Dương');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // phải là Dần(2) hoặc Thân(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`Cự Môn Thái Dương đồng nhập ${BRANCH_NAMES[ju.branch]} Cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('Dần Cung Thái Dương Miếu Vượng，Cự Môn đắc nhật quang hóa giải thị phi');
  if (getStarSiHua(ju, 'Cự Môn') === 'Lộc' || getStarSiHua(ju, 'Cự Môn') === 'Quyền') bonus.push('Cự Môn hóa Lộc/hóa Quyền（khẩu tài sinh tài）');
  if (getStarSiHua(ju, 'Cự Môn') === 'Kỵ') breaking.push('Cự Môn hóa Kỵ（khẩu thiệt quan phi）');
  if (ju.branch === 8) breaking.push('Thân Cung Thái Dương thiên Tây，Cự Môn ám diệu càng hiển');

  patterns.push({
    name: 'Cự Nhật Đồng Cung',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `Cự Môn Thái Dương đồng ${BRANCH_NAMES[ju.branch]} Cung，Thái Dương hóa giải Cự Môn ám diệu，chủ dùng khẩu tài、truyền thông、ngoại ngữ、chuyên nghiệp lập nghiệp。Dần Cung là tốt，Thân Cung lực giảm。Sợ Cự Môn hóa Kỵ thì quan phi。`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Cự Nhật Đồng Cung》',
  });
}

/** Thạch Trung Ẩn Ngọc：Cự Môn nhập Mệnh tại Tý Ngọ Cung */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, 'Cự Môn')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // Tý(0) hoặc Ngọ(6)

  const required = [`Cự Môn nhập Mệnh tại ${BRANCH_NAMES[ming.branch]} Cung`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, 'Cự Môn') === 'Lộc' || getStarSiHua(ming, 'Cự Môn') === 'Quyền') bonus.push('Cự Môn hóa Lộc/hóa Quyền');
  if (sanFangAllStars(chart).has('Văn Xương')) bonus.push('Văn Xương hội chiếu（Thạch Trung Ẩn Ngọc đắc minh）');
  if (getStarSiHua(ming, 'Cự Môn') === 'Kỵ') breaking.push('Cự Môn hóa Kỵ（ngọc tàng thâm nê）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh tọa Sát Tinh');

  patterns.push({
    name: 'Thạch Trung Ẩn Ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cự Môn tọa Mệnh Tý Ngọ，bề ngoài bình phàm mà trong ẩn tài học。Sớm năm lặng lẽ vô danh、trung niên mới hiển quý khí，nghi đi con đường chuyên nghiệp、nghiên cứu、khẩu tài、truyền thông。Cần có Lộc Quyền hoặc Văn Xương tương trợ mới có thể "tạc thạch kiến ngọc"。',
    palaces: ['Mệnh'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số Cốt Tủy phú·Thạch Trung Ẩn Ngọc》',
  });
}

/** Minh Châu Xuất Hải：Mệnh tại Mùi Cung Vô Chính Diệu，Đối Cung Sửu Cung là Thái Dương Thái Âm */
function detectMingZhuChuHai(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 7) return;   // Mệnh tại Mùi
  if (getMajorStarNames(ming).length > 0) return;   // Mệnh là Cung Vô Chính Diệu
  const dui = getDuiGong(chart, ming.branch);
  if (!dui) return;
  if (!hasStar(dui, 'Thái Dương') || !hasStar(dui, 'Thái Âm')) return;

  const required = ['Mệnh tại Mùi là Cung Vô Chính Diệu', 'Đối Cung Sửu Cung là Thái Dương Thái Âm đồng độ'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Văn Xương') || sanFangAllStars(chart).has('Văn Khúc')) bonus.push('lại hội Xương Khúc');
  if (sanFangAllStars(chart).has('Tả Phù') || sanFangAllStars(chart).has('Hữu Bật')) bonus.push('Phụ Bật tương trợ');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Sát Tinh hội chiếu（châu quang ảm đạm）');

  patterns.push({
    name: 'Minh Châu Xuất Hải',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Mệnh Mùi Cung Vô Chính Diệu，Đối Cung Sửu Cung Nhật Nguyệt đồng huy củng chiếu，hiệu "Minh Châu Xuất Hải"。Chủ xuất thân bình phàm、hậu Thiên nỗ lực vươn lên，nghi đi xa tha hương、nghiên cứu học thuật hoặc chức vị cao trong công ty lớn，chủ đại phú đại quý。',
    palaces: ['Mệnh', dui.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn tập·Minh Châu Xuất Hải》',
  });
}

/** Tử Vi độc tọa nhập Mệnh */
function detectZiWeiInMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, 'Tử Vi') || hasStar(ming, 'Thiên Phủ')) return;

  const required = ['Tử Vi độc tọa Mệnh（vô Thiên Phủ đồng tọa）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('Tả Phù') && sanFangSet.has('Hữu Bật')) bonus.push('Tả Phù Hữu Bật đồng hội');
  if (sanFangSet.has('Văn Xương') && sanFangSet.has('Văn Khúc')) bonus.push('Văn Xương Văn Khúc đồng hội');
  if (!sanFangSet.has('Tả Phù') && !sanFangSet.has('Hữu Bật')) breaking.push('vô Phụ Bật（cô quân vô thần）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Tử Vi ngộ Không Kiếp（cổ thư tối Kỵ）');

  patterns.push({
    name: 'Tử Vi Nhập Mệnh',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: 'Tử Vi độc tọa Mệnh，Sao đế vương，tự tôn mạnh、có sức hút lãnh đạo。Nhưng Tử Vi tối Kỵ "tại dã cô quân"——nếu không có Tả Hữu Phụ Bật hội chiếu，phản thành cô cao tự ngạo、dễ chiêu hủy báng。',
    palaces: ['Mệnh'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Phụ Bật Giáp Mệnh */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, 'Tả Phù');
  const prevHasYou = hasStar(prev, 'Hữu Bật');
  const nextHasZuo = hasStar(next, 'Tả Phù');
  const nextHasYou = hasStar(next, 'Hữu Bật');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['Tả Phù Hữu Bật phân cư hai Cung trước sau Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Thiên Khôi') || sanFangAllStars(chart).has('Thiên Việt')) bonus.push('lại hội Khôi Việt');

  patterns.push({
    name: 'Phụ Bật Giáp Mệnh',
    level: 'excellent',
    description: 'Tả Phù Hữu Bật Giáp Mệnh，luận thuật truyền thống cho rằng cách này tượng trưng quý nhân tương trợ và phúc hậu。Thích hợp đi con đường sĩ đồ、quản lý doanh nghiệp lớn đẳng hướng phát huy tài tổ chức。Cổ thư vân "Tả Phù Hữu Bật，chung Thân phúc hậu"——nhấn mạnh ưu thế của cách này trong phối hợp tổ chức。',
    palaces: ['Mệnh', prev.name, next.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư·Phụ Bật Giáp Mệnh》',
  });
}

/** Xương Khúc Giáp Mệnh */
function detectChangQuJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasChang = hasStar(prev, 'Văn Xương');
  const prevHasQu = hasStar(prev, 'Văn Khúc');
  const nextHasChang = hasStar(next, 'Văn Xương');
  const nextHasQu = hasStar(next, 'Văn Khúc');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: 'Xương Khúc Giáp Mệnh',
    level: 'excellent',
    description: 'Văn Xương Văn Khúc Giáp Mệnh，chủ thông minh tuấn tú、văn thải phi nhiên，nghi đi con đường văn giáo、học thuật、nghệ thuật、viết lách。Cổ thư vân "Xương Khúc Giáp Mệnh chủ Khoa Giáp"，tối Lợi vận thi。',
    palaces: ['Mệnh', prev.name, next.name],
    conditions: { required: ['Văn Xương Văn Khúc phân cư hai Cung trước sau Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Khôi Việt Giáp Mệnh */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Thiên Khôi') && hasStar(next, 'Thiên Việt');
  const okB = hasStar(prev, 'Thiên Việt') && hasStar(next, 'Thiên Khôi');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Khôi Việt Giáp Mệnh',
    level: 'good',
    description: 'Thiên Khôi Thiên Việt Giáp Mệnh，Nam xưng Thiên Ất、Nữ xưng Ngọc Đường，Nhất sinh quý nhân đề bạt。Thi cử、cầu chức、thời khắc then chốt thường có quý nhân bất ngờ tương trợ。',
    palaces: ['Mệnh', prev.name, next.name],
    conditions: { required: ['Thiên Khôi Thiên Việt phân cư hai Cung trước sau Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Song Lộc Triều Viên：hóa Lộc + Lộc Tồn đồng hội Tam Phương */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === 'Lộc')) huaLuFound = true;
    if (hasStar(p, 'Lộc Tồn')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: 'excellent',
    description: 'hóa Lộc、Lộc Tồn đồng hội Mệnh Tam Phương Tứ Chính，tài nguyên dũng động、y thực phong túc。Cổ thư vân "Song Lộc Triều Viên，phú bỉ Đào Chu"，chủ Nhất sinh bất sầu tài，nhiều chính tài hoạnh tài kiêm đắc。',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['hóa Lộc hội chiếu Tam Phương Tứ Chính', 'Lộc Tồn hội chiếu Tam Phương Tứ Chính'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['Mệnh tọa Không Kiếp（Song Lộc ngộ Không，tài lai tài khứ）'] : undefined,
    },
    source: '《Tử Vi Đẩu Số toàn thư·Song Lộc Triều Viên》',
  });
}

/** Tam Kỳ Gia Hội：hóa Lộc hóa Quyền hóa Khoa đồng hội Tam Phương */
function detectSanQiJiaHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangPalaces = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFangPalaces) {
    for (const s of p.stars) {
      if (s.siHua === 'Lộc') lu = true;
      if (s.siHua === 'Quyền') quan = true;
      if (s.siHua === 'Khoa') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: 'Tam Kỳ Gia Hội',
    level: 'excellent',
    description: 'hóa Lộc、hóa Quyền、hóa Khoa Tam Cát hóa tề hội Mệnh Tam Phương Tứ Chính，hiệu xưng "Tam Kỳ Gia Hội"。Chủ Nhất sinh công danh、tài phú、quý nhân Tam toàn，là Nhất trong các Cát cách cao nhất của Tử Vi Đẩu Số。',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['hóa Lộc、hóa Quyền、hóa Khoa Tam Cát hóa tề hội Mệnh Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Tam Kỳ Gia Hội》',
  });
}

/** hóa Lộc nhập Mệnh/Quan/Tài */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === 'Lộc' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${huaLuStar.name} hóa Lộc nhập Mệnh`,
    level: 'good',
    description: `${huaLuStar.name} hóa Lộc tọa Mệnh，chủ sinh tài thuận Lợi、nhân duyên tốt、cơ duyên nhiều。${huaLuStar.name === 'Vũ Khúc' ? 'Vũ Khúc hóa Lộc thuộc chính tài，nghi thực nghiệp、tài chính。' : huaLuStar.name === 'Thái Âm' ? 'Thái Âm hóa Lộc thuộc Âm tài、bất động sản。' : huaLuStar.name === 'Tham Lang' ? 'Tham Lang hóa Lộc thuộc tài nhân mạch、tài đào hoa。' : ''}`,
    palaces: ['Mệnh'],
    conditions: { required: [`${huaLuStar.name} hóa Lộc tọa Mệnh`] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

// ────────────────── Bộ nhận dạng ác cách ──────────────────

/** hóa Kỵ nhập Mệnh/Thiên Di */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === 'Kỵ' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${jiStar.name} hóa Kỵ nhập ${inMing ? 'Mệnh' : 'Thiên Di'}`,
      level: 'caution',
      description: inMing
        ? `${jiStar.name} hóa Kỵ tọa Mệnh，cần lưu ý bản Thân cố chấp、chướng ngại tâm lý hoặc ẩn hoạn sức khỏe，mọi việc lùi Nhất bước suy nghĩ。hóa Kỵ chưa chắc xấu，đại biểu năng lượng của Sao này cần được đặc biệt quan tâm。`
        : `${jiStar.name} hóa Kỵ tọa Thiên Di Cung，xuất ngoại、viễn hành、nhân tế quan hệ dễ có trắc trở，nghi thủ bất nghi động。`,
      palaces: [palace.name],
      conditions: { required: [`${jiStar.name} hóa Kỵ tọa ${inMing ? 'Mệnh' : 'Thiên Di'} Cung`] },
      source: '《Tử Vi Đẩu Số toàn thư》',
    });
  }
}

/** Dương Đà Giáp Kỵ：hóa Kỵ tọa Cung，tả hữu bị Kình Dương Đà La giáp */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === 'Kỵ');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;   // chỉ xem Mệnh bị giáp

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, 'Kình Dương') && hasStar(next, 'Đà La');
    const aNext = hasStar(prev, 'Đà La') && hasStar(next, 'Kình Dương');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: 'Dương Đà Giáp Kỵ',
      level: 'caution',
      description: 'hóa Kỵ tọa Mệnh，tả hữu Kình Dương Đà La Giáp Mệnh，cổ thư vân "Dương Đà Giáp Kỵ vi bại Cục"，chủ Nhất sinh lao lục bôn ba、khảm khả bất thuận、thân tâm câu bì。Cần dùng đức hạnh tu dưỡng và tích cực làm việc để hóa giải，mọi việc thận trọng là trên。',
      palaces: ['Mệnh', prev.name, next.name],
      conditions: { required: ['hóa Kỵ tọa Mệnh', 'Kình Dương Đà La phân cư hai Cung trước sau Mệnh'] },
      source: '《Tử Vi Đẩu Số Cốt Tủy phú·Dương Đà Giáp Kỵ》',
    });
    return;
  }
}

/** Hỏa Linh Giáp Mệnh：Hỏa Tinh Linh Tinh phân cư trước sau Mệnh */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Hỏa Tinh') && hasStar(next, 'Linh Tinh');
  const okB = hasStar(prev, 'Linh Tinh') && hasStar(next, 'Hỏa Tinh');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Hỏa Linh Giáp Mệnh',
    level: 'caution',
    description: 'Hỏa Tinh Linh Tinh phân cư hai Cung trước sau Mệnh Giáp Mệnh，chủ tính nóng、dễ xung động、bất ngờ gặp sự cố hoặc tranh chấp。Cần bồi dưỡng nhẫn nại、tránh quyết định xung động。',
    palaces: ['Mệnh', prev.name, next.name],
    conditions: { required: ['Hỏa Tinh Linh Tinh phân cư hai Cung trước sau Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Không Kiếp Giáp Mệnh：Địa Không Địa Kiếp phân cư trước sau Mệnh */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, 'Địa Không') && hasStar(next, 'Địa Kiếp');
  const okB = hasStar(prev, 'Địa Kiếp') && hasStar(next, 'Địa Không');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Không Kiếp Giáp Mệnh',
    level: 'caution',
    description: 'Địa Không Địa Kiếp Giáp Mệnh，chủ tài lai tài khứ、tư tưởng thoát tục、dễ đốn nhập tôn giáo triết học。Cổ thư vân "Không Kiếp Giáp Mệnh，tài bất tụ"。Nghi kỹ nghệ、tôn giáo、nghiên cứu đẳng ngành bất trọng vật chất。',
    palaces: ['Mệnh', prev.name, next.name],
    conditions: { required: ['Địa Không Địa Kiếp phân cư hai Cung trước sau Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** Liêm Sát Dương：Liêm Trinh、Thất Sát、Kình Dương Tam Sao hội chiếu（Lưu Niên Đại Hạn tối Hung） */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Liêm Trinh') && sanFangSet.has('Thất Sát') && sanFangSet.has('Kình Dương'))) return;

  patterns.push({
    name: 'Liêm Sát Dương',
    level: 'caution',
    description: 'Liêm Trinh、Thất Sát、Kình Dương Tam Sao hội chiếu Mệnh Tam Phương，trong luận thuật truyền thống được đánh dấu là tổ hợp cần đặc biệt quan tâm。Cách này khi Đại Hạn Lưu Niên kích hoạt thì nhắc nhở giữ thái độ thận trọng：an toàn lái xe、nhân tế hòa bình、quyết định y tế cần lý tính——nhấn mạnh chủ động quản lý chứ không phải tiêu cực túc mệnh。',
    palaces: ['Mệnh'],
    conditions: { required: ['Liêm Trinh、Thất Sát、Kình Dương Tam Sao hội chiếu Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Liêm Sát Dương》',
  });
}

/** Cự Hỏa Dương：Cự Môn、Hỏa Tinh、Kình Dương hội chiếu */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Cự Môn') && sanFangSet.has('Hỏa Tinh') && sanFangSet.has('Kình Dương'))) return;

  patterns.push({
    name: 'Cự Hỏa Dương',
    level: 'caution',
    description: 'Cự Môn、Hỏa Tinh、Kình Dương Tam Sao hội chiếu，cổ thư truyền thống ghi chép cách này là tổ hợp cần cảnh giác（cổ văn "chung Thân ải tử" là cách nói túc mệnh luận，ngày nay đã bất thích dụng）。Cách hiểu hiện đại：tổ hợp này tượng trưng ngôn thẳng dễ kích hoạt xung đột、lúc cảm xúc kịch liệt cần tự giác ngộ。Phương hướng tu dưỡng là：luyện tập biểu đạt ôn hòa、chủ động hóa giải đối lập、bồi dưỡng quản lý cảm xúc。',
    palaces: ['Mệnh'],
    conditions: { required: ['Cự Môn、Hỏa Tinh、Kình Dương Tam Sao hội chiếu Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số Cốt Tủy phú·Cự Hỏa Dương》',
  });
}

/** Linh Xương Đà Vũ：Linh Tinh、Văn Xương、Đà La、Vũ Khúc hội chiếu（hạn chí đầu hà） */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('Linh Tinh') && sanFangSet.has('Văn Xương') && sanFangSet.has('Đà La') && sanFangSet.has('Vũ Khúc'))) return;

  patterns.push({
    name: 'Linh Xương Đà Vũ',
    level: 'caution',
    description: 'Linh Tinh、Văn Xương、Đà La、Vũ Khúc Tứ Sao tề hội，cổ thư truyền thống ghi chép đây là tổ hợp cần đặc biệt quan tâm（cổ văn "hạn chí đầu hà" là cách nói túc mệnh luận，không phải cách hiểu hiện đại）。Kiến nghị hiện đại là：khi tổ hợp này ở Đại Hạn Lưu Niên kích hoạt，nhắc nhở xử lý lý tính các quyết định lớn、quan tâm dao động cảm xúc、duy trì tính ổn định của cuộc sống——nhấn mạnh chủ động quản lý chứ không phải tiêu cực chờ đợi。',
    palaces: ['Mệnh'],
    conditions: { required: ['Linh Tinh、Văn Xương、Đà La、Vũ Khúc Tứ Sao hội chiếu Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số Cốt Tủy phú·Linh Xương Đà Vũ》',
  });
}

/** Mã Đầu Đới Tiễn：Kình Dương tại Ngọ Cung tọa Mệnh */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // phải là Ngọ
  if (!hasStar(ming, 'Kình Dương')) return;

  const required = ['Kình Dương tại Ngọ Cung tọa Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('Thất Sát') || sanFangAllStars(chart).has('Phá Quân')) bonus.push('lại hội Thất Sát hoặc Phá Quân（võ chức đại quý）');
  if (sanFangAllStars(chart).has('Thiên Khôi') || sanFangAllStars(chart).has('Thiên Việt')) bonus.push('Khôi Việt gia chiếu');

  patterns.push({
    name: 'Mã Đầu Đới Tiễn',
    level: bonus.length ? 'good' : 'caution',
    description: 'Kình Dương tại Ngọ Cung tọa Mệnh，hiệu "Mã Đầu Đới Tiễn"，cổ thư vân "uy trấn biên cương"。Cách này tượng trưng hành động lực quả quyết và tinh thần cạnh tranh，thích hợp phương hướng nghề nghiệp cần lực chấp hành và quyết sách quả cảm。Luận thuật truyền thống đồng thời nhắc nhở cách này cần phối hợp Cát Lợi Tinh Diệu mới phát huy tối ưu——nhấn mạnh ảnh hưởng của tổ hợp chứ không phải đơn Sao độc luận。',
    palaces: ['Mệnh'],
    conditions: { required, bonus },
    source: '《Tử Vi Đẩu Số Cốt Tủy phú·Mã Đầu Đới Tiễn》',
  });
}

// ────────────────── Cách Cục cơ bản（nâng cao độ phủ nhận dạng）──────────────────
// Thiết kế：để Lá số bình thường cũng nhận dạng được 1-3 Cách Cục phổ biến，chứ không phải 30+ Cách Cục cổ thư nghiêm ngặt đều bất khớp。
// Đây đều là nhận dạng nhẹ do điều kiện đơn Nhất kích hoạt，level phần lớn là neutral / good。

/** Lộc Tồn thủ Thân：Lộc Tồn nhập Thân（hoặc Mệnh cùng Thân đồng Cung） */
function detectLuCunShouShen(chart: ZiweiChart, patterns: Pattern[]) {
  const luCunPalace = findStarPalace(chart, 'Lộc Tồn');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? 'Lộc Tồn Thủ Mệnh' : 'Lộc Tồn Thủ Thân',
    level: 'good',
    description: inMing
      ? 'Lộc Tồn tọa Mệnh，chủ Nhất sinh y thực vô ưu、tài Lộc ổn định。tính cách bảo thủ，giỏi tích lũy，nhưng Dương Đà Giáp Lộc cần đề phòng tiểu nhân。Tối nghi phối hợp hóa Lộc、Tả Phù Hữu Bật mới là đại cách。'
      : 'Lộc Tồn nhập Thân，chủ trung niên về sau tài nguyên ổn định、đắc Lộc tự hưởng。倪师 nói「Lộc Tồn nhập Thân，tài khí cận Thân」——phối ngẫu hoặc phương hướng sự nghiệp có thể mang lại tài Lộc ổn định。',
    palaces: [inMing ? 'Mệnh' : 'Thân'],
    conditions: { required: [inMing ? 'Lộc Tồn nhập Mệnh' : 'Lộc Tồn nhập Thân'] },
    source: '《Tử Vi Đẩu Số toàn thư·Lộc Tồn Sao》',
  });
}

/** Thiên Mã nhập Mệnh/Thiên Di：dịch mã Sao động */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, 'Thiên Mã');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? 'Thiên Mã Nhập Mệnh' : 'Thiên Mã Tại Thiên Di',
    level: 'neutral',
    description: inMing
      ? 'Thiên Mã tọa Mệnh，chủ Nhất sinh bôn ba、động trung đắc tài，nghi đi con đường thương lữ、ngoại cần、phát triển xuyên giới。倪师 nói「Thiên Mã nhập Mệnh，vô Lộc bất phát」——nếu lại hội Lộc Tồn hoặc hóa Lộc tức là phú cách「Lộc Mã giao trì」。'
      : 'Thiên Mã tại Thiên Di Cung，chủ xuất ngoại hữu Lợi、viễn hành đắc tài，nghi phát triển nơi đất khách。Phối hóa Lộc chủ dị địa sinh tài，phối Sát Tinh thì lữ đồ nhiều trắc trở。',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? 'Thiên Mã nhập Mệnh' : 'Thiên Mã nhập Thiên Di Cung'] },
    source: '《Tử Vi Đẩu Số toàn thư·Thiên Mã Sao》',
  });
}

/** hóa Lộc nhập Tài：Tài Bạch Cung Chính Tinh hóa Lộc */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === 'Tài Bạch');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === 'Lộc');
  if (!luStar) return;
  patterns.push({
    name: 'Hóa Lộc Nhập Tài',
    level: 'good',
    description: `${luStar.name} hóa Lộc nhập Tài Bạch Cung，chủ tài nguyên thông suốt、thu nhập ổn định。倪师 giảng hóa Lộc là tượng trưng「chính tài」——năng lực mà Sao hóa Lộc này đại biểu（đặc chất cốt lõi của ${luStar.name}）là trục chính kiếm tiền của bạn。Phối Lộc Tồn hoặc Thiên Mã thì tài nguyên càng rộng。`,
    palaces: ['Tài Bạch'],
    conditions: { required: [`${luStar.name} hóa Lộc nhập Tài Bạch Cung`] },
    source: '《Tử Vi Đẩu Số toàn thư·Tứ Hóa luận》',
  });
}

/** hóa Quyền nhập Quan：Quan Lộc Cung Chính Tinh hóa Quyền */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === 'Quan Lộc');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === 'Quyền');
  if (!quanStar) return;
  patterns.push({
    name: 'Hóa Quyền Nhập Quan',
    level: 'good',
    description: `${quanStar.name} hóa Quyền nhập Quan Lộc Cung，chủ sự nghiệp có sức khống chế、đảm đương được chức vụ độc đương Nhất diện。hóa Quyền đại biểu Quyền lực và lực chấp hành——${quanStar.name} hóa Quyền nói rõ bạn trong sự nghiệp có thể trở thành người quyết sách hoặc người chấp hành cốt lõi，nghi đi con đường quản lý hoặc kỹ thuật Quyền uy。`,
    palaces: ['Quan Lộc'],
    conditions: { required: [`${quanStar.name} hóa Quyền nhập Quan Lộc Cung`] },
    source: '《Tử Vi Đẩu Số toàn thư·Tứ Hóa luận》',
  });
}

/** hóa Khoa nhập Mệnh/Thân：Khoa danh gia Thân */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === 'Khoa');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? 'Hóa Khoa Nhập Mệnh' : 'Hóa Khoa Nhập Thân',
      level: 'good',
      description: `${keStar.name} hóa Khoa nhập ${isMing ? 'Mệnh' : 'Thân'} Cung，chủ danh tiếng、văn thư、vận học thuật。倪师 giảng hóa Khoa là「Sao quý nhân」——${keStar.name} hóa Khoa mang lại là đặc chất được người coi trọng，nghi tham gia văn thư、giáo dục、nghiên cứu、tư vấn、sáng tạo văn hóa đẳng hướng "dĩ danh thủ Lợi"。`,
      palaces: [isMing ? 'Mệnh' : 'Thân'],
      conditions: { required: [`${keStar.name} hóa Khoa nhập ${isMing ? 'Mệnh' : 'Thân'} Cung`] },
      source: '《Tử Vi Đẩu Số toàn thư·Tứ Hóa luận》',
    });
    return; // Mệnh và Thân trùng lặp thì chỉ nhận dạng Nhất lần
  }
}

/** Cơ Nguyệt Đồng Lương Tam Sao hội（3 Sao bất toàn cách，không phải Tứ Sao chân cách）：Thiên Cơ/Thái Âm/Thiên Đồng/Thiên Lương bất kỳ 3 Sao tề nhập Tam Phương Tứ Chính */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return; // 4 Sao tề do detectJiYueTongLiang xử lý
  // tránh trùng lặp với detectJiYueTongLiang ở trên（4 Sao tề thì bất vào đây）
  const missing = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương Tam Sao Hội',
    level: 'neutral',
    description: `Cơ Nguyệt Đồng Lương cần Thiên Cơ、Thái Âm、Thiên Đồng、Thiên Lương Tứ Sao tề hội Tam Phương Tứ Chính mới là chân cách trọn vẹn；bàn này chỉ hội đủ 3 sao（${has.join('、')}），thiếu ${missing.join('、')} chưa hội，không phải chân cách trọn vẹn，lực lượng giảm Nhất bậc。Văn chất đới mưu，nghi công chức、giáo nghiên、y tế、phục vụ đẳng ngành dựa vào tích lũy và ổn định，mấu chốt xem Sao khuyết vị và sự phối hợp với Tứ Hóa。`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`Tam Phương Tứ Chính hội ${has.join('、')}（Cơ Nguyệt Đồng Lương thiếu ${missing.join('、')}）`] },
    source: '《Tử Vi Đẩu Số toàn thư·Cơ Nguyệt Đồng Lương cách》',
  });
  void ming;
}

/** Xương Khúc Đồng Hội：Văn Xương+Văn Khúc đều tại Mệnh Tam Phương Tứ Chính */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Văn Xương') || !sanFangSet.has('Văn Khúc')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, 'Văn Xương') && hasStar(ming, 'Văn Khúc');
  patterns.push({
    name: inMing ? 'Xương Khúc Tọa Mệnh' : 'Xương Khúc Đồng Hội',
    level: 'good',
    description: inMing
      ? 'Văn Xương Văn Khúc đồng nhập Mệnh，chủ thông minh tuấn tú、văn thải phi nhiên，nghi văn học、giáo dục、viết lách、tư vấn。Tối Kỵ hóa Kỵ——Xương Khúc hóa Kỵ chủ văn thư khế ước ám khuy。'
      : 'Văn Xương Văn Khúc đồng hội Tam Phương Tứ Chính，chủ tài hoa hoành dật、khẩu tài văn bút câu giai。Nghi đi ngành cần biểu đạt và văn thải，hóa Khoa gia trì thì danh tiếng hiển đạt。',
    palaces: ['Mệnh'],
    conditions: { required: ['Văn Xương、Văn Khúc đồng hội Mệnh Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Văn Sao luận》',
  });
}

/** Phụ Bật Đồng Hội：Tả Phù+Hữu Bật đều tại Mệnh Tam Phương Tứ Chính */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Tả Phù') || !sanFangSet.has('Hữu Bật')) return;
  patterns.push({
    name: 'Phụ Bật Đồng Hội',
    level: 'good',
    description: 'Tả Phù Hữu Bật đồng hội Mệnh Tam Phương Tứ Chính，chủ Nhất sinh quý nhân bất tuyệt、nhân duyên cực tốt。Tối nghi cương vị lãnh đạo và công việc phối hợp nhóm。倪师 nói「Phụ Bật Giáp Mệnh，bình sinh quý nhân nhiều」——bạn bất phải là Mệnh đơn thương độc mã，cần giỏi dùng mạng lưới nhân tế。',
    palaces: ['Mệnh'],
    conditions: { required: ['Tả Phù、Hữu Bật đồng hội Mệnh Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Phụ Bật luận》',
  });
}

/** Khôi Việt Đồng Hội：Thiên Khôi+Thiên Việt đều tại Mệnh Tam Phương Tứ Chính */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('Thiên Khôi') || !sanFangSet.has('Thiên Việt')) return;
  patterns.push({
    name: 'Khôi Việt Đồng Hội',
    level: 'good',
    description: 'Thiên Khôi Thiên Việt đồng hội Mệnh Tam Phương Tứ Chính，chủ "quý nhân Thiên Ất" gia trì，thời khắc then chốt luôn có quý nhân đề bạt。倪师 nói「Khôi Việt Giáp Mệnh，tất vi quý nhân」——lúc gặp khó khăn bên Thân sẽ xuất hiện người tương trợ đắc lực，nghi chủ động duy trì nhân mạch。',
    palaces: ['Mệnh'],
    conditions: { required: ['Thiên Khôi、Thiên Việt đồng hội Mệnh Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Khôi Việt luận》',
  });
}

/** Khoa Quyền Song Hội：hóa Khoa + hóa Quyền đồng hội Tam Phương Tứ Chính */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === 'Khoa') hasKe = true;
      if (s.type === 'major' && s.siHua === 'Quyền') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: 'Khoa Quyền Song Hội',
    level: 'good',
    description: 'hóa Khoa + hóa Quyền đồng hội Tam Phương Tứ Chính，chủ danh Quyền song mỹ——vừa có học thức/danh tiếng（Khoa），vừa có sức khống chế（Quyền），nghi đi con đường "Quyền uy chuyên nghiệp"（như bác sĩ、luật sư、giáo sư、cốt cán kỹ thuật），danh Lợi song thu và căn cơ vững chắc。',
    palaces: ['Mệnh'],
    conditions: { required: ['hóa Khoa、hóa Quyền đồng hội Mệnh Tam Phương Tứ Chính'] },
    source: '《Tử Vi Đẩu Số toàn thư·Tứ Hóa hội chiếu》',
  });
}

// ────────────────── Điểm vào chính ──────────────────
export function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return patterns;

  // Thượng cách
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);

  // Trung cách
  detectLianXiang(chart, patterns);
  detectWuQiSha(chart, patterns);
  detectTongLiang(chart, patterns);
  detectRiYueTongGong(chart, patterns);
  detectRiYueJiaMing(chart, patterns);
  detectJuRiTongGong(chart, patterns);
  detectShiZhongYinYu(chart, ming, patterns);
  detectMingZhuChuHai(chart, ming, patterns);
  detectZiWeiInMing(chart, ming, patterns);

  // Trợ lực cách
  detectFuBiJiaMing(chart, patterns);
  detectChangQuJiaMing(chart, patterns);
  detectKuiYueJiaMing(chart, patterns);
  detectShuangLuChaoYuan(chart, ming, patterns);
  detectSanQiJiaHui(chart, patterns);
  detectHuaLuRuMing(chart, ming, patterns);

  // Ác cách
  detectHuaJiRuMingQian(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectJuHuoYang(chart, patterns);
  detectLingChangTuoWu(chart, patterns);
  detectMaTouDaiJian(chart, ming, patterns);

  // Cách Cục cơ bản（nâng cao độ phủ nhận dạng，để Lá số bình thường cũng nhận dạng được 1-3 cái）
  detectLuCunShouShen(chart, patterns);
  detectTianMaRuMing(chart, patterns);
  detectHuaLuRuCai(chart, patterns);
  detectHuaQuanRuGuan(chart, patterns);
  detectHuaKeRuMingShen(chart, patterns);
  detectJiYueTongLiangPartial(chart, ming, patterns);
  detectChangQuTongHui(chart, patterns);
  detectFuBiTongHui(chart, patterns);
  detectKuiYueTongHui(chart, patterns);
  detectKeQuanShuangHui(chart, patterns);

  return patterns;
}

// ────────────────── Tóm tắt Mệnh（giữ tương thích ngược）──────────────────
export function getMingGongSummary(chart: ZiweiChart): {
  stars: string[];
  keywords: string[];
  nature: string;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!mingPalace) return { stars: [], keywords: [], nature: '' };

  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  const keywordMap: Record<string, string[]> = {
    'Tử Vi': ['tôn quý', 'độc lập', 'lãnh đạo'],
    'Thiên Cơ': ['trí tuệ', 'cơ biến', 'thiện mưu'],
    'Thái Dương': ['dương cương', 'quan quý', 'khảng khái'],
    'Vũ Khúc': ['tài phú', 'cương nghị', 'quả đoán'],
    'Thiên Đồng': ['ôn hòa', 'hưởng phúc', 'tùy duyên'],
    'Liêm Trinh': ['tài nghệ', 'đào hoa', 'đa biến'],
    'Thiên Phủ': ['tài khố', 'ổn trọng', 'bảo thủ'],
    'Thái Âm': ['nhu mỹ', 'tài phú', 'tế nhị'],
    'Tham Lang': ['dục vọng', 'đào hoa', 'đa tài'],
    'Cự Môn': ['thiện biện', 'đa tư', 'khẩu tài'],
    'Thiên Tướng': ['phù tá', 'hành chính', 'ổn kiện'],
    'Thiên Lương': ['ấm hộ', 'y dược', 'trưởng bối'],
    'Thất Sát': ['tướng tinh', 'quả quyết', 'cô khắc'],
    'Phá Quân': ['khai sáng', 'biến động', 'phá cựu'],
  };

  const natureMap: Record<string, string> = {
    'Tử Vi': 'Sao đế vương', 'Thiên Cơ': 'Sao trí tuệ', 'Thái Dương': 'Sao quý nhân',
    'Vũ Khúc': 'Sao Tài Bạch', 'Thiên Đồng': 'Sao Phúc Đức', 'Liêm Trinh': 'Sao đào hoa',
    'Thiên Phủ': 'Sao tài khố', 'Thái Âm': 'Sao tài phú', 'Tham Lang': 'Sao đào hoa',
    'Cự Môn': 'Sao thị phi', 'Thiên Tướng': 'Sao ấn thụ', 'Thiên Lương': 'Sao ấm tí',
    'Thất Sát': 'Sao tướng soái', 'Phá Quân': 'Sao biến động',
  };

  const keywords = starNames.flatMap(n => keywordMap[n] ?? []).slice(0, 5);
  const nature = starNames.length > 0 ? (natureMap[starNames[0]] ?? '') : 'Cung Vô Chính Diệu';

  return { stars: starNames, keywords, nature };
}
