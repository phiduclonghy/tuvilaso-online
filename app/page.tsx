'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

// ─── wrapper cuộn vào màn hình ────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // Phiên bản trước có đường 1px liền + 12px bóng gradient, khi chuyển chủ đề tạo thành đường ngang rõ ràng rất cứng.
  // Đổi thành gradient 24px mềm mại hơn + opacity thấp, sự nối tiếp giữa các section tự nhiên hơn.
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── Nút chuyển chủ đề ───────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Chuyển sang chủ đề sáng' : 'Chuyển sang chủ đề tối'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </motion.button>
  );
}

// ─── Dữ liệu Chính Tinh ────────────────────────────────────────────
const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Tham Lang' }, { name: 'Cự Môn' }, { name: 'Thiên Tướng' }, { name: 'Thiên Lương' },
  { name: 'Thất Sát' }, { name: 'Phá Quân' },
];

// ─── Mô-đun tính năng ────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Hệ thống lập lá số',
    title: 'Nghê Hải Hạ chính tông\nTử Vi Đẩu Số',
    subtitle: 'Không phải bản giản hóa, tuân theo nghiêm ngặt truyền thừa của thầy Nghê Hải Hạ',
    points: [
      'Nạp âm Ngũ hành Cục khởi lá số, không áp dụng thuật toán giản hóa trên mạng',
      'Mệnh nghịch số sinh giờ, Thân thuận số sinh giờ, căn chỉnh nghiêm ngặt theo quy tắc giảng dạy',
      'Thập Tứ Chính Tinh và Tứ Hóa phi tinh suy diễn theo pháp gốc, cấu trúc hoàn chỉnh có thể đối chiếu',
    ],
  },
  {
    tag: 'Trình bày lá số',
    title: 'Hoàn chỉnh Thập Tứ Chính Tinh\nTứ Hóa phi tinh',
    subtitle: 'Cấu trúc rõ ràng, liếc mắt là hiểu ngay trục chính và trọng điểm',
    points: [
      'Thập Tứ Chính Tinh nhập cung hoàn chỉnh, quan hệ Chính Tinh rõ ràng dễ đọc',
      'Phụ Tinh và Sát Tinh cùng hiển thị trên màn hình, tránh thiếu sót thông tin then chốt',
      'Miếu Vượng Lợi Hạn phân cấp độ sáng, nhanh chóng nhận diện mạnh yếu',
      'Nhấp vào bất kỳ Chính Tinh nào là có thể xem luận giải chi tiết của thầy Nghê Hải Hạ về Sao đó',
    ],
  },
  {
    tag: 'AI Luận giải',
    title: 'Giải lá số sâu\nKhông chỉ dừng ở việc tính toán',
    subtitle: 'Kho tri thức hệ thống Nghê Hải Hạ × Claude AI',
    points: [
      'Phân tích Mệnh cách: xuất phát từ Chính Tinh tại Mệnh, kết hợp Tam Phương Tứ Chính, đưa ra phán đoán toàn diện về tính cách và Cách Cục đời người',
      'Luận giải sáu chiều kích lớn: phương hướng sự nghiệp, tình cảm hôn nhân, mô thức tài vận, lưu ý sức khỏe, quan hệ gia đình, duyên phận con cái',
      'Theo dõi Đại Hạn Lưu Niên: trọng điểm Đại Hạn 10 năm hiện tại, gợi ý và đề xuất hành động cụ thể cho Cung Vị Lưu Niên năm nay',
      'Tự do truy vấn: nhắm vào lá số của bạn để đặt câu hỏi trực tiếp, "năm nay có thể đổi việc không", "khi nào vận kết hôn tốt nhất"',
    ],
  },
  {
    tag: 'Cách CụcNhận diện',
    title: 'Tự động phát hiện\nLá sốCách Cục',
    subtitle: 'Phát hiện điều đã định trong Mệnh của bạn từ tổ hợp Tinh Diệu',
    points: [
      'Tự động nhận diện 11 loại Cách Cục kinh điển: Tử Phủ đồng cung, Sát Phá Lang cách, Cơ Nguyệt Đồng Lương, Liêm Tướng cách, Vũ Khúc Thất Sát v.v.',
      'Phát hiện chính xác các Cách Cục đặc biệt như Phụ Bật giáp Mệnh, Nhật Nguyệt giáp Mệnh, đồng thời đưa ra luận giải tiêu chuẩn theo hệ thống Nghê Hải Hạ',
      'Tự động chú thích tình trạng đặc biệt của Tứ Hóa nhập cung Mệnh, Thiên Di, gợi ý những chủ đề đời người cần quan tâm',
      'Cách Cục được trình bày phân tầng theo đẳng cấp Cát Hung, giúp bạn liếc mắt là thấy rõ ưu thế và thử thách trong lá số của mình',
    ],
  },
];

// ─── 4 học phần lớn (trục thời gian sau hero) ──────────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 Chính Tinh · 13 Cung Vị · AI Luận giải',
    status: 'ready' as const,
    when: '5 tháng',
    icon: '◉',  // Hình tròn đặc + chấm trong, hình ảnh Sao Tử Vi
    note: '',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: '6 tháng',
    icon: '⊙',  // Hình tròn + chấm trong (chữ cổ "nhật"), cùng độ rộng ký tự với ◉
    note: '',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    en: 'Di Ji',
    desc: 'Sự nghiệp chưa hoàn thành của Nghê sư · Hậu bối bổ chú',
    status: 'soon' as const,
    when: '6 tháng',
    icon: '⊞',  // Hình vuông + giếng (hình ảnh Địa/Điền), cùng độ rộng ký tự với ⊙
    note: 'Nghiên cứu di cảo',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm cứu',
    status: 'soon' as const,
    when: '7 tháng',
    icon: '⊕',  // Hình tròn + chữ Thập (đạo y / Âm Dương điều hòa), cùng độ rộng ký tự với ⊙/⊞
    note: '',
  },
];

// ─── Giáo nghĩa hạch tâm của Nghê Hải Hạ ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: 'Mệnh làm gốc, Tam Phương làm dụng',
    body: 'Nghê sư luôn nhấn mạnh, xem Mệnh ắt phải xem Mệnh trước tiên. Chính Tinh tại Mệnh quyết định Cách Cục cơ bản và tính cách thiên sinh của một người, Tam Phương (Tài Bạch, Quan Lộc, Thiên Di) thì quyết định "đất dụng võ" của người này. Bốn Cung liên động mới là toàn cảnh đời người.',
  },
  {
    title: 'Đối Cung mượn Sao, không thể xem nhẹ',
    body: 'Chỗ độc đáo của Nghê sư nằm ở việc coi trọng "Đối Cung". Bất kỳ Cung Vị nào nếu là Cung Vô Chính Diệu, ắt phải mượn Tinh Diệu của Đối Cung để luận đoán, đối diện Mệnh là cung Thiên Di, hai bên ảnh hưởng lẫn nhau, đây là điểm then chốt mà nhiều người mới học dễ bỏ qua.',
  },
  {
    title: 'Tứ Hóa mới là bàn tay của vận Mệnh',
    body: 'Tinh Diệu chỉ là cơ sở, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là điểm then chốt quyết định vận thế tốt xấu. Cùng một ngôi Sao, có Hóa Lộc với có Hóa Kỵ, quỹ đạo đời người có thể hoàn toàn khác nhau. Nghê sư lặp đi lặp lại nhấn mạnh: không xem Tứ Hóa, lá số chỉ giải được một nửa.',
  },
  {
    title: 'Đại Hạn mười năm, vận thế có nhịp',
    body: 'Nghê sư chia đời người thành 12 Đại Hạn, mỗi Đại Hạn 10 năm. Ông cho rằng người ở các Cung Vị Đại Hạn khác nhau, cơ ngộ hoàn toàn khác nhau. Hiểu rõ mình hiện đang đi Đại Hạn nào, Cung Vị đó có Tinh Diệu gì, mới thực sự nắm bắt được vận thế hiện tại.',
  },
];

// ─── helper màu sắc chủ đề ─────────────────────────────────────
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    // nav dùng màu đục hoàn toàn giống bgBase, tránh việc bán trong suốt chồng lên sinh ra dải lệch màu
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    // Chữ sáng màu dùng hệ xám lạnh (hạch tâm phương án A): nền ấm + chữ lạnh → thị giác không mỏi mệt
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // Accent màu lạnh (hạch tâm phương án B): hô ứng màu xanh lam của chế độ tối; dùng cho glow trang trí / liên kết / làm nổi bật
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    // Glow chế độ sáng dùng xanh lam/tím thật — thêm điểm nhấn màu lạnh cho bầu không khí tổng thể
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── Dữ liệu giới thiệu Tứ Hóa ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Hóa Lộc': { attr: 'Cát hóa · Tăng ích', brief: 'Phúc tinh nhập cung, chủ về tài vận và phúc khí tăng ích. Sự vật nơi Cung Vị đó thuận lợi, năng lực tăng cường, là hóa tinh được ưa chuộng nhất trong lá số.' },
  'Hóa Quyền': { attr: 'Cát hóa · Quyền uy', brief: 'Quyền lực tinh nhập cung, chủ về sự kiểm soát và năng lực lãnh đạo. Cung Vị đó chủ về cường thế và quyết đoán, thích nhập cung Quan Lộc và Mệnh, chủ về thực quyền trong sự nghiệp.' },
  'Hóa Khoa': { attr: 'Cát hóa · Danh dự', brief: 'Khoa danh tinh nhập cung, chủ về thanh danh và duyên quý nhân. Cung Vị đó chủ về văn danh và vận thi cử, có quý nhân phù trì, thích hợp học thuật, thi cử và những dịp công khai.' },
  'Hóa Kỵ': { attr: 'Hung hóa · Trở ngại', brief: 'Kiếp số tinh nhập cung, chủ về chấp niệm và trở ngại. Cung Vị đó cần đặc biệt quan tâm, khóa đề đời người của cung đó sẽ trở thành khảo nghiệm quan trọng.' },
};

// ─── Dữ liệu giới thiệu Chính Tinh ─────────────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': { attr: 'Thổ · Đế vương tinh', brief: 'Thiên hoàng quý tinh, thống ngự các tinh. Người tọa Mệnh có khí chất cô ngạo, chủ về quyền uy hiển đạt, thiên sinh có khí chất lãnh đạo, thích hợp với cương vị lãnh đạo một mình gánh vác một phương.' },
  'Thiên Cơ': { attr: 'Mộc · Trí tuệ tinh', brief: 'Ích thọ tinh, chủ về trí mưu và biến động. Thông tuệ lanh lợi, giỏi mưu tính, tâm tư tinh tế, thích hợp làm nghề hoạch định, cố vấn, kỹ thuật.' },
  'Thái Dương': { attr: 'Hỏa · Chủ Quan Lộc', brief: 'Chính Tinh Quan Lộc, chủ về thanh danh và danh vọng. Khảng khái đại độ, coi trọng hình tượng công chúng, lợi cho quan trường và công chức, Mệnh nam lực mạnh, nhập Miếu càng quang minh lỗi lạc.' },
  'Vũ Khúc': { attr: 'Kim · Chủ Tài Bạch', brief: 'Chính Tinh Tài Bạch, chủ về tài vụ và quyết đoán. Ý chí kiên định, hành động quả cảm, thích hợp nghề tài vụ, tài chính, quân cảnh, là tinh cô khắc, lợi cho kết hôn muộn.' },
  'Thiên Đồng': { attr: 'Thủy · Phúc tinh', brief: 'Chính Tinh Phúc Đức, chủ về hưởng lạc và nhân duyên. Tính tình ôn hòa, nhân duyên cực tốt, chú trọng chất lượng cuộc sống, tình cảm tinh tế, vận thế cuối năm tốt đẹp.' },
  'Liêm Trinh': { attr: 'Hỏa · Tài nghệ tinh', brief: 'Thứ đào hoa tinh, chủ về tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú, thích hợp nghệ thuật, chính giới, đa tài đa nghệ nhưng cần phòng thị phi đào hoa.' },
  'Thiên Phủ': { attr: 'Thổ · Tài khố tinh', brief: 'Chính Tinh Nam Đẩu, chủ về tài khố và tích trữ. Ổn trọng bảo thủ, năng lực lý tài cao, là lực lượng ổn định của lá số, thích hợp quản lý tài vụ và hành chính.' },
  'Thái Âm': { attr: 'Thủy · Chủ Điền Trạch', brief: 'Chính Tinh Điền Trạch, chủ về tài phú và âm nhu. Tinh tế ôn nhu, cảm thụ lực mạnh, Mệnh nữ càng tốt, lợi cho bất động sản và tích trữ, thích hợp văn nghệ hoặc ngành dịch vụ.' },
  'Tham Lang': { attr: 'Mộc Thủy · Đào hoa', brief: 'Đào hoa tinh, chủ về dục vọng và tài nghệ. Đa tài đa nghệ, dục vọng vượng thịnh, giao tế hoạt bát, thích hợp làm nghề nghệ thuật, quan hệ công chúng, thương nghiệp, nhân duyên cực tốt.' },
  'Cự Môn': { attr: 'Thủy · Thị phi tinh', brief: 'Ám tinh, chủ về khẩu tài và thị phi. Khẩu tài xuất chúng, năng lực tư biện mạnh, thích hợp luật sư, giáo dục, truyền thông, lưu ý khẩu thiệt thị phi, lấy biện tài lập thân.' },
  'Thiên Tướng': { attr: 'Thủy · Ấn tinh', brief: 'Ấn tinh, chủ về phù tá và ấn thụ. Giỏi hiệp điều, coi trọng lễ tiết, chính trực tuân thủ pháp luật, thích hợp mạc liêu, hành chính, nghề pháp luật, vận quý nhân tốt.' },
  'Thiên Lương': { attr: 'Thổ · Ấm tinh', brief: 'Ấm tinh, chủ về lão thành và ấm che. Chính trực ổn trọng, lòng từ bi mạnh, ông trời sẽ phù hộ, thích hợp y tế, công tác xã hội, lĩnh vực tôn giáo.' },
  'Thất Sát': { attr: 'Kim Hỏa · Tướng tinh', brief: 'Tướng tinh, chủ về cương liệt và khai sáng. Tính cách cương nghị, hành động lực mạnh, dũng cảm thử thách, thích hợp khởi nghiệp, quân cảnh, ngành nghề cạnh tranh, gặp hung hóa cát.' },
  'Phá Quân': { attr: 'Thủy · Hao tinh', brief: 'Hao tinh, chủ về biến động và khai thác. Dũng cảm đột phá, không sợ thay đổi, cả đời biến động lớn nhưng có phách lực, thích hợp công việc kiểu khai thác, đi con đường người khác chưa từng đi.' },
};

// ─── Trang trí thị giác cho tính năng ────────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Phương pháp lập lá số Nghê Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Hệ Tử Vi', stars: ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh'] },
          { group: 'Hệ Thiên Phủ', stars: ['Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Tứ Hóa phi tinh</div>
          <div className="flex gap-2 flex-wrap">
            {[['Hóa Lộc', 'rgba(52,211,153,0.7)'], ['Hóa Quyền', 'rgba(96,165,250,0.7)'], ['Hóa Khoa', 'rgba(250,204,21,0.7)'], ['Hóa Kỵ', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Vận thế sự nghiệp của tôi năm nay thế nào?' },
      { role: 'ai', text: 'Mệnh Thiên Cơ hóa Lộc, năm nay Đại Hạn đi cung Quan Lộc, Tam Phương có Tả Phù tương trợ, sự nghiệp có quý nhân đề bạt, thích hợp chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào vận tình cảm tốt nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Sát Phá Lang cách', desc: 'Mệnh khai sáng tiến thủ', ok: true },
      { name: 'Liêm Tướng cách',   desc: 'Cách hành chính ấn thụ', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Cần quan tâm đề tài tâm lý', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Tự động nhận diện 11 loại Cách Cục kinh điển
        </div>
      </div>
    );
  }

  return null;
}

// ─── Trang chủ ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Đồng bộ nền body / html với màu chủ đề home, loại bỏ lệch màu do nav bán trong suốt lộ ra #fafaf9
  // useLayoutEffect đảm bảo cập nhật đồng bộ trước khi trình duyệt vẽ, tránh lệch nhịp với transition của div gốc
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* Thông báo gửi người dùng — lần đầu truy cập phủ toàn màn hình, đóng mới vào Trang chủ */}
      <AnnouncementModal />

      <StarField />

      {/* Hào quang toàn cục */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── Điều hướng trên cùng ── nav cùng màu với hero (c.bgBase), không blur không border, triệt để không lệch màu */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{
          background: c.navBg,
        }}>
        <div className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] font-medium transition-colors duration-300 flex-shrink-0"
          style={{ color: c.goldSolid }}>
          Tử ViLá số
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            Hợp bàn
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            NgayKhởi Lá Số
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* Hàng nhãn */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.45em] transition-colors duration-300" style={{ color: c.tagText }}>
              Tử Vi Đẩu Số · Hệ thống Nghê Hải Hạ
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* Tiêu đề chính */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{
                fontSize: 'clamp(56px, 10vw, 124px)',
                letterSpacing: '0.07em',
              }}>
              Tử ViLá số
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}>
            Tử Vi làm cửa · Thiên Địa Nhân làm đường · Nghê Hải Hạ làm thầy
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            AI giải đáp thắc mắc · Tri hành hợp nhất
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            Nhập ngày tháng năm sinh giờ, tạo lá số Tử Vi Đẩu Số dành riêng — sau đó các học phần Thiên Kỷ, Địa Kỷ, Nhân Kỷ lần lượt mở ra.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              NgayKhởi Lá Số
            </motion.button>
          </motion.div>

          {/* ThậpTứChính Tinh */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[540px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Giấy ghi chú thông báo ra mắt — desktop định vị tuyệt đối bên phải */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>5/1 — 5/8</span>
              <span> Giới hạn thời gian hồi quỹ</span>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Tất cả tính năng + AI Đặt câu hỏi
              <strong style={{ color: '#c45a2d' }}> Hoàn toàn miễn phí</strong>
            </div>
          </div>
        </motion.div>

        {/* Thông báo ra mắt — 手机端正常流式Hiển thị（hero 内容下bên居中） */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{
            maxWidth: 'min(280px, 84vw)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '13px' }}>5/1 — 5/8</span>
              <span> Giới hạn thời gian hồi quỹ</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              Tất cả tính năng + AI <strong style={{ color: '#c45a2d' }}>Hoàn toàn miễn phí</strong>
            </div>
          </div>
        </motion.div>

        {/* Gợi ý cuộn（Tuyệt对定位，Bất影响 hero opacity 计算） */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: c.scrollText }}>Khám phá thêm</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ Dẫn ngôn triết học ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>Mệnh</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>Mệnh · Vận · Quan</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc nhìn trước vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: 'không phải ở việc đoán trước tương lai', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: 'mà ở việc không ngừng nhận thức chính mình', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}>
              cuối cùng viết nên kịch bản cuộc đời của chính mình
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ Trục thời gian 4 đại học phần ════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.15em]" style={{ color: c.textPrimary }}>
            Phương pháp luận của Nghê sư · Lần lượt mở ra
          </div>
          <div className="text-xs lg:text-sm tracking-[0.1em]" style={{ color: c.textMuted }}>
            Bắt đầu từ Tử Vi, từng bước mở khóa các module học Thiên Kỷ / Địa Kỷ / Nhân Kỷ
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* Đường nối ngang (chỉ desktop)*/}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* Đường nối dọc (chỉ mobile)—— 圆点贴在线上，做"Địa铁线路图"风格 */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* Nút tròn */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* Nhóm chữ: mobile xếp đơn cột phải; desktop xếp chồng giữa */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* Hàng trên: nhãn thời gian + tên học phần + ghi chú（手机端 inline；桌面端依然分行） */}
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.25em] lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.15em]"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {/* Ghi chú riêng desktop（手机已在đỉnh行 inline 展示）*/}
                    {s.note && (
                      <div className="hidden lg:block text-[9px] tracking-[0.15em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    {/* Giới thiệu */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Tính năngGiải thích chi tiết ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Khu chữ */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* Khu trang trí thị giác */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ Thiên·Địa·人 Tam分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thiên · Địa · Nhân
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Quan điểm vận mệnh cốt lõi của thầy Nghê Hải Hạ: vận mệnh chưa bao giờ là tất cả của nhân sinh.<br />
                Ông chia những sức mạnh ảnh hưởng đến nhân sinh thành ba chiều kích quan trọng ngang nhau.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: 'Thiên', label: 'Vận mệnh tiên thiên', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Tử Vi Đẩu Số hé lộ, chính là cách cục lá số tiên thiên của một người — do giờ sinh quyết địnhinh Diệu布Cục、Ngũ行Cục数、MệnhChính Tinh。这只是Mệnh运的Tam分之Nhất，是人生的底色，而非全貌。', sub: 'Lá số · Tinh Diệu · Ngũ行' },
              { glyph: 'Địa', label: 'Môi trường địa lý', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: '你所在的Môi trường địa lý、Thành phố、国家、风水Cách Cục，乃至家庭背景与社会Cấu trúc，共同构成了Mệnh运的第Nhị个维度。同NhấtLá số，生在Bất同Địabên，际遇可以Thiên壤之别。', sub: 'Địa域 · 风水 · 环境' },
              { glyph: '人', label: 'Ý niệm nhân tâm', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Ý chí, tâm thái, lựa chọn và hành động của cá nhân, mới là sức mạnh chủ động nhất thay đổi vận mệnh. Nghê sư nhấn mạnh:解Lá số是为了更好Địa做人，而Bất是坐等Mệnh运安排。精进自Kỷ，是最强的破Cục之道。', sub: '意志 · Chọn · 行动' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                "Vận mệnh không phải là tất cả của nhân sinh, cộng thêm vị trí địa lý và ý niệm con người, mới là tất cả."
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>— Nghê Hải Hạ</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ Nghê Hải Hạ介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Nghê Hải Hạ老师
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                Một trong những bậc thầy Đông y và thuật số có ảnh hưởng nhất trong giới Hoa nhân đương đại<br />
                Nhà sáng lập Học viện Đông y Hán Đường (Mỹ) · Hai đại hệ thống giảng dạy "Nhân Kỷ" "Thiên Kỷ" lưu truyền hậu thế
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Sinh năm', value: '1954', sub: 'Đài Loan' },
                  { label: 'Mất năm', value: '2012', sub: '1/1 · thọ 58 tuổi' },
                  { label: 'Truyền thừa', value: 'Tử Vi Đẩu Số', sub: 'Đông y kinh phương · Kinh Dịch' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Tiểu sử</strong>：
                  Nghê Hải Hạtrước生（1954–2012）Sinh于Đài Loan，早năm师承多位中医名家，专研经bên派（《伤寒论》Truyền thừa）。
                  Trung niên sang Mỹ hành y, tại Mỹ sáng lập <strong>Học viện Đông y Hán Đường</strong>, hơn hai mươi năm truyền dạy hệ thống Đông y và thuật số truyền thống.
                  2012 năm 1 tháng 31 ngày因肝癌在Đài LoanMất năm，享năm 58 岁。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Hệ thống giảng dạy</strong>：
                  Nghê sư chỉnh lý toàn bộ kiến thức cả đời thành hai loạt giảng dạy công khai.
                  <strong>"Nhân Kỷ"</strong> bao gồm 《Châm Cứu Đại Thành》《Thần Nông Bản Thảo Kinh》《Hoàng Đế Nội Kinh》《Thương Hàn Luận》《Kim Quỹ Yếu Lược》—
                  Đây là "Kỷ của người", đặt nền tảng con đường học Đông y hoàn chỉnh;
                  <strong>"Thiên Kỷ"</strong> bao gồm Tử Vi Đẩu Số và 《Kinh Dịch》— đây là "Kỷ của Trời", là thành quả hệ thống hóa của nghiên cứu thuật số.
                  两者相合，是Nghê sư留给后世最đầy đủ的Truyền thừa。
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Lập trường Tử Vi</strong>：
                  Về Tử Vi Đẩu Số, Nghê sư rõ ràng thuộc <strong>Nam phái Tam Hợp</strong>, chủ trương "lấy Mệnh làm gốc, lấy Tam Phương Tứ Chính làm dụng, lấy Tứ Hóa làm cương".
                  Trong khóa 《Thiên Kỷ》 ông nói rõ: "<em>Phi Tinh (Tứ Hóa) bay qua bay lại quá phức tạp, không làm cái này, dù sao đại đạo chí giản</em>" —
                  Lập trường này phân biệt rõ ràng ông với phái Phi Tinh rườm rà.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Thái độ trị học</strong>：
                  Nghê sư phản đối học vẹt khẩu quyết, nhấn mạnh "hiểu nguyên lý hơn thuộc lòng" "logic có thể kiểm chứng hơn huyền học thần bí".
                  Thái độ này khiến Tử Vi Đẩu Số từ hệ thống kín truyền thầy trò, tiến tới hệ thống tri thức hiện đại có hệ thống, có thể kiểm chứng, có thể học tập.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Ảnh hưởng đương đại</strong>：
                  Video giảng bài của Nghê sư lan truyền rộng rãi trên Bilibili, YouTube và các nền tảng lớn, là môn nhập môn được thế hệ mới yêu thích Mệnh lý và Đông y công nhận.
                  他Bất仅是Tử Vi Đẩu Số的Truyền thừa者，更是把传统Mệnh Lý与中医带nhập现代Tri thứchệ thống的then chốt人物之Nhất。
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  Mọi luận giải trên nền tảng này dựa trên giáo trình giảng dạy công khai 《Thiên Kỷ》 của Nghê sư, bản Minh 《Tử Vi Đẩu Số Toàn Thư》, cổ thư phái Tam Hợp truyền thống chỉnh lý mà thành,
                  chỉ dùng làm tài liệu tham khảo văn hóa và phát triển cá nhân. Bản thân Nghê sư và nền tảng này không có bất kỳ quan hệ thương mại nào.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Cổng hợp bàn ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Tử Vi hợp bàn
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Nhập thông tin sinh của hai người, AI dựa trên hệ thống Nghê Hải Hạ phân tích cung Phu Thê tương tham, độ tương thích Mệnh và sự tương tác Tam Phương Tứ Chính,<br className="hidden md:block" />
                đưa ra độ phù hợp tình cảm, tính khả thi hợp tác và lời khuyên chung sống tốt nhất.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Phân tích độ phù hợp tình cảm', 'Đánh giá hợp tác khởi nghiệp', 'Luận giải duyên phận cha con', 'Đánh giá tương hợp trước hôn nhân'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Bắt đầu phân tích hợp bàn
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ CTA cuối ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6" style={{ color: c.tagText }}>Bắt đầu hành trình lá số của bạn</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Lá số Tử Vi của bạn<br />đang chờ bạn luận giải
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập ngày tháng năm sinh giờ，在tạo lá số độc quyền của bạn trong vài giây<br />
            sau đó AI luận giải sâu cho bạn theo hệ thống Nghê Hải Hạ
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Miễn phíKhởi Lá Số
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/knowledge/`}
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Tử Vi Đẩu SốThư viện tri thức →
            </motion.a>
            <motion.a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/library/`}
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Cổ thưThư viện nguyên điển →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

        {/* Chỗ điều hướng 4 học phần（Đã ra mắt + sắp mở）*/}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.3em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            Nghê sưbên法论 · hệ thống học thuật
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.1em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] tracking-wider"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? '✓ Đã ra mắt' : `${s.when} mở`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            Tử ViLá số · dựa trên hệ thống chính tông Nghê Hải Hạ · 仅供参考，vận mệnh nằm trong tay chính mình
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Nền tảng này dựa trên nghiên cứu văn hóa truyền thống Trung Hoa, chỉ cung cấp tài liệu tham khảo học tập.<br className="sm:hidden" />
            Không cấu thành bất kỳ lời khuyên y tế, đầu tư, pháp luật hay quyết định quan trọng nào.
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/terms/`} style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản dịch vụ</a>
            {' · '}
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/privacy/`} style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách quyền riêng tư</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
