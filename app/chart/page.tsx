'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * Trang lá số —— Bản mã nguồn mở「Động cơ lập lá số Demo」
 *
 * Đây là một ví dụ tối giản có thể chạy: dùng động cơ lập lá số generateChart() của kho mã nguồn này kết hợp với UI cơ bản
 * component, render một tấm lá số Tử Vi hoàn chỉnh + luận giải cơ bản, và hỗ trợ chuyển đổi Bản Mệnh / Đại Hạn / Lưu Niên.
 *
 * Ghi chú: giao diện tương tác hoàn chỉnh của bản thương mại trực tuyến (UI mới thiết kế lại, AI luận giải dạng luồng, hợp bàn, chia sẻ
 * thẻ v.v.) không nằm trong phạm vi mã nguồn mở; nhưng lõi lập lá số — thuật toán An Sao, Tứ Hóa, nhận diện Cách Cục, kho Cổ thư —
 * hoàn toàn mở (xem lib/ziwei/*), có thể tự do phát triển thêm để tạo ra giao diện của riêng bạn.
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  // ── Mùi khởi lá số: hiển thị biểu mẫu thông tin sinh ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Lập lá số Tử Vi Đẩu Số</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          Nhập ngày, tháng, năm và giờ sinh để lập lá số.
          <br />
          Dữ liệu lá số được tính ngay trên trình duyệt của bạn.
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── Đã khởi lá số: lá số + luận giải ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); }}
        style={{
          marginBottom: 16, padding: '6px 14px', cursor: 'pointer',
          border: '1px solid #ccc', borderRadius: 8, background: 'transparent',
        }}
      >
        ← Tạo lại lá số
      </button>

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
        style={{
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}
