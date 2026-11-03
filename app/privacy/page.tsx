import Link from 'next/link';

export const metadata = { title: 'Quyền riêng tư政策 · Tử ViLá số', description: 'Tử ViLá sốQuyền riêng tư政策' };

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Quay lạiTrang chủ</span>
        </Link>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>Tử ViLá số</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Quyền riêng tư政策</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>最后更新：2026năm4tháng</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 我们收集的Thông tin</h2>
      <p>为提供Tử ViLá sốLập lá số与Luận giải服务，我们可能收集以下Thông tin：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Lá số必要Thông tin</strong>：Họ tên（选填）、SinhDương lịchnămthángngày、SinhgiờThìn、Giới tính、SinhĐịaKinh độ</li>
        <li><strong>账号Thông tin（Đăng ký后）</strong>：手机号（用于短信验证与会员服务）</li>
        <li><strong>交互Thông tin</strong>：你在站内的点击、浏览、Lá sốLịch sử记录</li>
        <li><strong>反馈Thông tin</strong>：你对Luận giải内容的"准 / Bất准"打分与文字反馈</li>
        <li><strong>支付Thông tin</strong>：购买会员或单项服务giờ通过第Tam Phương支付（支付宝 / 微信支付）处理，本Bình台Bất存储完整卡号或密码</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 我们如何使用Thông tin</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Lá sốThông tin仅用于本次Luận giải与你账号下的Lịch sửLá số记录</li>
        <li>手机号用于Đăng ký、Đăng nhập、订单通知</li>
        <li>反馈Thông tin用于持续改进Mệnh Lý内容质量（脱敏后聚合Phân tích）</li>
        <li>聚合数据可能用于行业研究与Bình台优化</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Thông tin共享与第Tam Phương</h2>
      <p>除以下情形外，我们Bất会向第Tam Phương共享你的个人Thông tin：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>支付服务商（支付宝 / 微信支付）：处理订单结算</li>
        <li>短信服务商（如阿里云短信）：Gửi验证码</li>
        <li>云服务商（如 Vercel / Cloudflare / 阿里云）：技术承载</li>
        <li>AI Luận giải服务（如 Anthropic Claude）：处理你的"自由追问"对话（已做匿名化）</li>
        <li>司法机关或政府部门基于法律法规的合法要求</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Thông tin安全</h2>
      <p>我们采取业界常见的技术与管理手段保护你的Thông tin（HTTPS 传输加密、数据库加密存储、访问Quyền限控制等）。但请Lưu ý，互联网传输无法保证 100% 安全。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 你的QuyềnLợi</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>查询</strong>：可通过账号中心Xem你的所有Lịch sửLá số与订单</li>
        <li><strong>删除</strong>：联系客服删除账号下指定Lá số / 注销账号</li>
        <li><strong>导出</strong>：可Thân请导出你的Tất cả个人数据</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookie 与本Địa存储</h2>
      <p>本站使用 cookie / localStorage 用于：Lưu你的暗黑/亮色主题偏好、最近的Lá sốLịch sử、会员Đăng nhập状态。你可在浏览器Cài đặt中Đóng，但部分Tính năng可能受影响。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Mùi成năm人</h2>
      <p>本Bình台Mệnh Lý内容面向 18 岁以上成năm用户。Mùi成năm人请在监护人同意下使用，并BấtĐắc将Luận giải用于重大人生决策。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. 政策变更</h2>
      <p>本政策可能Bất定期更新。重大变更将以显著方式通知。继续使用即表示同意更新后的版本。</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <Link href="/terms" style={{ color: 'var(--ac)' }}>服务Điều khoản</Link> · <Link href="/" style={{ color: 'var(--ac)' }}>Quay lạiTrang chủ</Link>
        </p>
      </main>
    </>
  );
}
