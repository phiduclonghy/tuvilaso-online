'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Số phiên bản thông báo——muốn hiện lại thông báo mới sau này，chỉ cần sửa ở đây（key phiên bản cũ hết hiệu lực，phiên bản mới hiện lại Một lần）
const ANNOUNCEMENT_VERSION = '2026-05-01';
const STORAGE_KEY = `announcement_seen_${ANNOUNCEMENT_VERSION}`;

export default function AnnouncementModal() {
  // Mặc định Không mở，phía client dùng useEffect kiểm tra localStorage rồi Ngay quyết định có hiện lên hay không。
  // Chưa từng xem → Ngay phủ lên Trang chủ；đã xem → Không hiện lại。
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false); // cờ hoàn tất hydration

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch { /* localStorage có thể bị cấm，bỏ qua */ }
    setDecided(true);
  }, []);

  // Khi thông báo mở，khóa cuộn body，ngăn Trang chủ phía sau có thể cuộn（cảm giác nghi thức mạnh hơn）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* skip */ }
  };

  if (!decided) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // Không nhấp bên ngoài để Đóng——bắt buộc người dùng nhấn nút "Tôi đã biết" mới vào được Trang chủ
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(20,12,2,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #fefcf6 0%, #faf3e3 100%)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: 'min(85vh, 760px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(60,30,10,0.4), 0 4px 16px rgba(60,30,10,0.2)',
              border: '1px solid rgba(184,146,42,0.25)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            }}
          >
            {/* Trang trí phía trên + Nút Đóng */}
            <div style={{
              padding: '22px 28px 14px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              background: 'linear-gradient(180deg, rgba(184,146,42,0.08) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#b8922a', opacity: 0.7, marginBottom: '6px' }}>
                A LETTER TO USERS
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#3d2f10', letterSpacing: '0.08em', margin: 0 }}>
                Gửi bạn đang sử dụng Nền tảng này
              </h2>
              <button
                onClick={close}
                aria-label="Đóng"
                style={{
                  position: 'absolute', top: '14px', right: '16px',
                  width: '28px', height: '28px',
                  background: 'rgba(184,146,42,0.08)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '50%',
                  color: '#7a5e2a', fontSize: '14px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* Banner Miễn phí có Thời hạn（Thông tin quan trọng nhất，đặt lên đầu để nhấn mạnh）*/}
            <div style={{
              margin: '14px 22px 0',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
              border: '1.5px dashed rgba(232,132,62,0.5)',
              borderRadius: '12px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c45a2d', marginBottom: '4px', fontWeight: 600 }}>
                LIMITED TIME · Tri ân có Thời hạn
              </div>
              <div style={{ fontSize: '14px', color: '#8b3a1a', fontWeight: 600, lineHeight: 1.6 }}>
                <span style={{ fontSize: '16px', color: '#c45a2d', fontWeight: 700 }}>5 tháng 1 ngày — 5 tháng 8 ngày</span>
                <br />
                Tất cả Tính năng của Nền tảng + Đặt câu hỏi AI đều Miễn phí mở
              </div>
            </div>

            {/* Nội dung chính（có thể cuộn）*/}
            <div style={{
              padding: '18px 28px 24px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: 1.85,
              color: '#5a4a30',
              flex: 1,
            }}>
              <p style={{ margin: '0 0 12px' }}>
                Nói thật，tôi thực sự không ngờ lại có lượng truy cập lớn đến vậy。
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Ban đầu làm Nền tảng này，sơ tâm của tôi thực ra rất đơn giản：trong thời đại AI，đem bộ hệ thống vốn phức tạp、ngưỡng cửa rất cao của Nghê sư，cố gắng làm cho đơn giản hơn、hiệu quả hơn、dễ hiểu hơn。
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Không nhất thiết mỗi người đều phải học rất lâu、đọc rất nhiều sách trước，mới có thể tiếp cận những nội dung này。Chúng tôi hy vọng thông qua Nền tảng này，giúp mọi người dùng cách nhẹ nhàng hơn，đạt được một vài gợi ý tham khảo và khơi gợi về bản thân、giai đoạn cuộc đời、hướng Chọn。
              </p>
              <p style={{
                margin: '0 0 12px',
                padding: '10px 14px',
                background: 'rgba(184,146,42,0.07)',
                borderLeft: '3px solid rgba(184,146,42,0.45)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: '#7a5e2a',
              }}>
                Nghê sư từng nói qua Một câu：con người sao có thể phát minh ra thứ hoàn toàn vô dụng được chứ？
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Trực giác đầu tiên của tôi là，Kinh Dịch như vậy，Tử Vi Đẩu Số cũng như vậy。Chỗ thực sự có giá trị của chúng，không phải khiến người ta bị một Kết quả nào đó trói buộc，mà là giúp chúng ta sớm nhìn thấy quán tính tính cách、bài học cuộc đời và hướng Chọn của bản thân。Sau khi nhìn thấy，mới có cơ hội điều chỉnh；sau khi hiểu rõ，mới có cơ hội trở nên tốt hơn。
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Còn những câu kiểu &ldquo;bạn Hiện tại đang xem những thứ này，thực ra cũng là Một phần của Mệnh vận&rdquo;，tôi Không bình luận nhiều。
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Mấy ngày nay tài khoản được Xiaohongshu đưa lên，<strong style={{ color: '#c45a2d' }}>ngày 3 tháng 5 Bắt đầu khôi phục cập nhật bình thường。</strong>
              </p>
              <p style={{ margin: '0 0 16px', color: '#3d2f10', fontWeight: 500 }}>
                Cuối cùng，chân thành chúc mọi người đều ngày càng hiểu bản thân，ngày càng yêu bản thân，cũng ngày càng có năng lực yêu những người bên cạnh。
              </p>
              <p style={{ margin: 0, textAlign: 'right', fontSize: '13px', color: '#7a5e2a' }}>
                ——Cảm ơn mọi người 🙏
              </p>
            </div>

            {/* Nút phía dưới */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid rgba(184,146,42,0.15)',
              background: 'rgba(184,146,42,0.04)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
            }}>
              <button
                onClick={close}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #b8922a 0%, #9a7a20 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                }}
              >
                Tôi đã biết
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
