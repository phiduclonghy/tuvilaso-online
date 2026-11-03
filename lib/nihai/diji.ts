/**
 * Địa Kỷ — Nghê Hải Hạ Địa lý Phong thủy hệ thống cơ sở dữ liệu
 *
 * 「Hạ tri Địa lý」—— Kỷ của Đất, là nghiên cứu hệ thống hóa về Địa lý chí.
 * Nghê Hải Hạ vốn định sau 60 tuổi mới trứ thuật, Lợi dụng Thiên văn Địa lý Tri thức cùng tố dưỡng y học
 * biên soạn lại Địa lý chí các nước, nghiên cứu quan hệ giữa nhân tính quốc gia, vật sản với Phong thủy Địa lý của nó.
 *
 * Nghê Sư từ thế năm 2012, Địa Kỷ chưa thể hoàn thành, là 「nghiệp chưa trọn của Nghê Sư」.
 * Nội dung hiện có đến từ phần Khám dư học trong khóa Thiên Kỷ cùng di cảo do hậu nhân chỉnh lý.
 */

import type { NiModule } from './types';

// ─── Mô-đun Địa Kỷ ────────────────────────────────────────────
export const DIJI_MODULES: NiModule[] = [
  {
    id: 'dj-guojiadili',
    category: 'diji',
    name: 'Quốc gia Địa lý chí',
    nameEn: 'National Geography',
    subtitle: 'Nghiệp chưa trọn của Nghê Sư · Nghiên độc di cảo',
    description: 'Nghê Sư định dùng Tri thức Phong thủy Địa lý để giải độc ảnh hưởng của hoàn cảnh Địa lý các quốc đối với tính cách quốc dân, vật sản tư nguyên, quốc vận hưng suy. Đây là hoành nguyện Nghê Sư chưa thể hoàn thành.',
    details: [
      'Địa Kỷ là phần dự định hoàn thành cuối cùng trong Tam Đại trứ tác của Nghê Hải Hạ, vốn định sau 60 tuổi mới bắt đầu trứ thuật.',
      'Hạch tâm thiết tưởng là dùng Tri thức Phong thủy Địa lý biên soạn lại Địa lý chí các nước, ứng dụng Khám dư học truyền thống vào tầng vĩ mô quốc gia.',
      'Phương hướng nghiên cứu bao gồm: vị trí Địa lý của quốc gia, sơn xuyên hà lưu đối với sự túc tạo tính cách quốc dân, quan hệ giữa vật sản tư nguyên với Phong thủy Cách Cục, quan liên giữa Lịch sử hưng suy với Địa lý biến thiên.',
      'Nghê Sư từ thế năm 2012, Địa Kỷ chỉ lưu hạ sơ bộ cấu tưởng và cơ sở lý luận của Khám dư học trong khóa Thiên Kỷ. Những tia lửa tư tưởng bảo quý này trị đắc hậu bối chỉnh lý và truyền thừa.',
    ],
    references: [
      'Nghê Hải Hạ 《Thiên Kỷ》 phần Khám dư học',
      'Nghê Hải Hạ cấu tưởng Địa lý chí trong giảng khóa',
    ],
    keywords: ['Địa Kỷ', 'Quốc gia Địa lý', 'Phong thủy', 'Địa lý chí', 'Quốc vận', 'Vật sản', 'Nhân tính', 'Khám dư'],
    icon: '⊞',
    status: 'preview',
    order: 1,
    slug: 'geography',
    chapters: [
      {
        id: 'dj-dl-01',
        title: 'Cấu tưởng Địa Kỷ',
        subtitle: 'Hoành nguyện và lam đồ của Nghê Sư',
        description: 'Cấu tưởng tổng thể của Nghê Sư về Địa Kỷ——dùng Tri thức Phong thủy Địa lý giải độc Mệnh vận quốc gia.',
        keyPoints: [
          'Kế hoạch trứ thuật sau 60 tuổi (Nghê Sư sinh năm 1954)',
          'Dung hợp Tri thức Thiên văn Địa lý với tố dưỡng y học',
          'Biên soạn lại Địa lý chí các nước',
          'Nghiên cứu quan hệ giữa nhân tính, vật sản với Phong thủy Địa lý',
        ],
        quotes: ['Tôi muốn sau tuổi Lục Thập, dùng Tri thức Thiên văn Địa lý và tố dưỡng y học của tôi để viết lại Địa lý chí'],
        order: 1,
      },
      {
        id: 'dj-dl-02',
        title: 'Địa lý và Nhân tính',
        subtitle: 'Nhất phương thủy thổ dưỡng nhất phương nhân',
        description: 'Hoàn cảnh Địa lý bất đồng như hà túc tạo tính cách dân tộc và văn hóa đặc trưng bất đồng.',
        keyPoints: [
          'Khác biệt tính cách giữa dân tộc sơn địa và dân tộc bình nguyên',
          'Ảnh hưởng của phân bố thủy hệ đối với văn minh nông nghiệp',
          'Quan hệ giữa đới khí hậu với thể chất, tính cách của con người',
          'Địa phương Phong thủy tốt ắt có hiền nhân xuất hiện',
        ],
        order: 2,
      },
    ],
  },
  {
    id: 'dj-kanyu-theory',
    category: 'diji',
    name: 'Cơ sở lý luận Khám dư',
    nameEn: 'Feng Shui Theory',
    subtitle: 'Khám dư học Thiên Kỷ · Chỉnh lý lý luận',
    description: 'Chỉnh lý từ phần lý luận Khám dư học trong khóa Thiên Kỷ, làm cơ sở lý luận cho Địa Kỷ. Bao gồm các lý luận hạch tâm như Loan đầu học, Lý khí học, Dương trạch học.',
    details: [
      'Tuy Địa Kỷ chưa thể độc lập thành sách, nhưng khóa Thiên Kỷ đã bao hàm nội dung lý luận Khám dư học phong phú.',
      'Những lý luận này là khung cơ sở của Địa Kỷ, bao quát phương pháp phân tích Phong thủy từ vi mô (nhà ở) đến vĩ mô (thành thị, quốc gia).',
      'Nghê Sư áp dụng Cửu Sao phái (lưu phái Dương Cứu Bần), chú trọng Loan đầu và Lý khí song trọng.',
      'Phần nội dung này có thể xem là 「khóa dự bị lý luận」 của Địa Kỷ, cung cấp phương pháp luận cho nghiên cứu Quốc gia Địa lý chí về sau.',
    ],
    school: 'Cửu Sao phái (lưu phái Dương Cứu Bần)',
    references: [
      'Nghê Hải Hạ 《Thiên Kỷ · Địa mạch đạo》',
      'Phong thủy điển tịch Dương Cứu Bần',
    ],
    keywords: ['Khám dư', 'Lý luận Phong thủy', 'Loan đầu', 'Lý khí', 'Cửu Sao phái', 'Dương Cứu Bần', 'Dương trạch', 'Âm trạch'],
    icon: '◫',
    status: 'active',
    order: 2,
    slug: 'kanyu-theory',
    chapters: [
      {
        id: 'dj-kt-01',
        title: 'Loan đầu học',
        subtitle: 'Phán đoán sơn hình thủy thế',
        description: 'Thông qua quan sát hình trạng của núi, hướng đi, dòng chảy của nước cùng các Địa mạo tự nhiên để phán đoán Phong thủy Cát Hung.',
        keyPoints: [
          'Long mạch: thế đi của sơn mạch cùng khí mạch',
          'Huyệt vị: vị trí tối ưu tàng phong tụ khí',
          'Sa thủ: sơn thế hoàn bão hai bên tả hữu huyệt vị',
          'Thủy khẩu: phương vị ra vào của dòng nước',
        ],
        order: 1,
      },
      {
        id: 'dj-kt-02',
        title: 'Lý khí học',
        subtitle: 'Suy toán phương vị Cát Hung',
        description: 'Thông qua la bàn đo đạc phương vị, kết hợp các lý luận Cửu Sao phi bố, Bát sát Hoàng tuyền để suy toán Cát Hung.',
        keyPoints: [
          'Phương pháp sử dụng la bàn',
          'Nguyên lý Cửu Sao phi bố',
          'Phương vị cấm kỵ của Bát sát Hoàng tuyền',
          'Phương vị Cát Lợi của Tam Cát Lục Tú',
        ],
        order: 2,
      },
      {
        id: 'dj-kt-03',
        title: 'Ứng dụng Dương trạch',
        subtitle: 'Thực tiễn Phong thủy của hoàn cảnh cư trú',
        description: 'Ứng dụng lý luận Khám dư vào phương pháp thao tác thực tế trong lựa chọn nhà ở và bố Cục.',
        keyPoints: [
          'Nguyên tắc lựa chọn tọa hướng nhà ở',
          'Sắp xếp phương vị các khu chức năng trong nhà',
          'Phán đoán Cát Hung của hoàn cảnh xung quanh',
          'Phương pháp hóa giải Phong thủy bất lợi',
        ],
        order: 3,
      },
    ],
  },
  {
    id: 'dj-yigao',
    category: 'diji',
    name: 'Di cảo và Hậu học',
    nameEn: 'Legacy & Continuation',
    subtitle: 'Hậu bối bổ chú · Tân hỏa tương truyền',
    description: 'Chỉnh lý những giảng thuật linh tán của Nghê Sư giới thiệu về Địa Kỷ, nghiên cứu bổ chú của hậu bối học sinh, cùng sự mở rộng hiện đại của tư tưởng Địa Kỷ.',
    details: [
      'Nghê Sư tuy chưa hoàn thành chuyên trước tác Địa Kỷ, nhưng đã nhiều lần đề cập cấu tưởng và yếu điểm của Địa Kỷ trong khóa Thiên Kỷ và các dịp khác.',
      'Hậu bối học sinh và các nhà nghiên cứu căn cứ vào giảng thuật và di cảo của Nghê Sư, đã tiến hành chỉnh lý và bổ chú ở mức độ nhất định.',
      'Tư tưởng của Địa Kỷ có giá trị tham khảo trọng yếu trong các lĩnh vực nghiên cứu Phong thủy hiện đại, quy hoạch đô thị, khoa học hoàn cảnh.',
      'Mô-đun này nhằm thu thập, chỉnh lý mọi tài liệu tản kiến liên quan đến Địa Kỷ, cung cấp cơ sở cho nghiên cứu về sau.',
    ],
    references: [
      'Giảng khóa thực lục của Nghê Hải Hạ',
      'Bút ký và nghiên cứu của hậu bối học sinh',
    ],
    keywords: ['Di cảo', 'Hậu học', 'Bổ chú', 'Truyền thừa', 'Ứng dụng hiện đại'],
    icon: '⊟',
    status: 'coming',
    order: 3,
    slug: 'legacy',
    chapters: [
      {
        id: 'dj-yg-01',
        title: 'Ngữ lục Địa Kỷ của Nghê Sư',
        subtitle: 'Tư tưởng Địa Kỷ tản kiến trong các khóa học',
        description: 'Trích lục những luận thuật trọng yếu của Nghê Sư giới thiệu về Địa Kỷ từ các khóa Thiên Kỷ, Nhân Kỷ.',
        keyPoints: [
          'Động cơ sáng tác và quy hoạch của Địa Kỷ',
          'Quan sát hoàn cảnh Địa lý các nước',
          'Luận thuật quan hệ giữa Phong thủy và quốc vận',
          'Quan liên của Địa Kỷ với Thiên Kỷ, Nhân Kỷ',
        ],
        quotes: [
          'Nỗ lực của nhân sự cộng thêm điều chỉnh về Địa lý, nhất định có thể lớn hơn Mệnh vận tiên thiên',
          '2/3 lớn hơn 1/3——nhân sự + Địa lý = 2/3, tiên thiên Mệnh vận = 1/3',
        ],
        order: 1,
      },
    ],
  },
];

// ─── Thống kê ────────────────────────────────────────────────
export const DIJI_STATS = {
  totalModules: DIJI_MODULES.length,
  totalChapters: DIJI_MODULES.reduce((sum, m) => sum + m.chapters.length, 0),
  status: 'Nghiệp chưa trọn của Nghê Sư · Hậu bối đang tiếp tục chỉnh lý',
  note: 'Nghê Hải Hạ vốn định sau 60 tuổi trứ thuật Địa Kỷ, từ thế năm 2012, Địa Kỷ chỉ lưu hạ cấu tưởng và cơ sở lý luận',
};
