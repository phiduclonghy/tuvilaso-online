import Link from 'next/link';

export const metadata = { title: '服务Điều khoản · Tử ViLá số', description: 'Tử ViLá số服务Điều khoản与用户协议' };

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>服务Điều khoản</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>最后更新：2026năm4tháng</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 服务概述</h2>
      <p>Tử ViLá số（以下简称"本Bình台"）基于Nghê Hải Hạ《Thiên纪》Tử Vi Đẩu Số体系提供Lá sốLập lá số与Luận giải服务。本Bình台所有Mệnh Lý内容仅供参考，<strong>Bất构成Bất kỳ医疗、投资、法律、心理Tư vấn或人生重大决策建议</strong>。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 用户行为规范</h2>
      <p>使用本Bình台即表示您同意：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>仅出于合法、个人参考目的使用本Bình台</li>
        <li>Bất传播本Bình台内容用于商业销售、转载或公开发布</li>
        <li>Bất进行扰乱Bình台正常运行的行为</li>
        <li>Gửi的SinhThông tin真实有效；本Bình台对LỗiThông tin导致的Luận giải偏差Bất承担责任</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Tri thức产Quyền与禁止Điều khoản · 反爬反训练</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>本Bình台所有Mệnh Lý内容、Tri thức库（含 14 Chính Tinh × 12 Cung × NamNữ × Tứ Hóa × Đại HạnLưu Niên的Tất cảLuận giải文本）、UI 设计、算法整合方案、案例库均为本Bình台原创或经合法整理。</strong><br/><br/>
        严格禁止以下行为，违者保留追究民事赔偿与刑事责任的QuyềnLợi：<br/>
        ① 通过爬虫、自动化脚本、批量调用 API 等Bất kỳ技术手段抓取本Bình台内容；<br/>
        ② 将本Bình台Tạo的Lá sốLuận giải、文本、API 响应数据**用于训练Bất kỳ机器学习模型**（含但Bất限于大Ngôn ngữ模型、Mệnh LýTạo模型、文本Tạo模型等）；<br/>
        ③ 将本Bình台Tạo的内容转售、发布到其他网站、APP、自媒体账号；<br/>
        ④ 反编译、复制、修改本Bình台前端或后端代码并以"自营"方式提供同类服务。<br/><br/>
        本Bình台Xuất ra文本嵌入有指纹追溯水印，违规复制 / 训练所产生的Xuất ra可被检测追溯。Nhất经发现违规，本Bình台有Quyền要求 <strong>每例违约赔偿 100 万元人民币</strong>，并保留向法院提起诉讼及配合公安机关调查的QuyềnLợi。
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 免责声明</h2>
      <p>本Bình台Mệnh Lý内容基于传统Tử Vi Đẩu Số与Nghê Hải Hạ体系的Tri thức整理，<strong>Bất保证 100% 准确</strong>。Mệnh运受Thiên、Địa、人Tam才共同影响，本Bình台Xuất ra仅作为认识自Của tôi参考，使用者应理性看待，Bất应过度依赖Bất kỳ单NhấtMệnh Lý判断。</p>
      <p>因使用本Bình台内容产生的Bất kỳ后果（包括但Bất限于决策失误、心理影响、关系变化等），本Bình台Bất承担法律责任。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 服务变更与终止</h2>
      <p>本Bình台保留随giờ调整、暂停或终止部分或Tất cả服务的QuyềnLợi。重大变更将以站内公告或邮件方式通知用户。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. 法律适用与争议解决</h2>
      <p>本Điều khoản适用中华人民共和国法律。若发生争议，双方应友好协商；协商Bất成的，Gửi本Bình台运营主体所在Địa有管辖Quyền的人民法院诉讼解决。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 联系方式</h2>
      <p>如有疑问，请通过本Bình台公布的客服微信 / 邮箱联系。</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <Link href="/privacy" style={{ color: 'var(--ac)' }}>Quyền riêng tư政策</Link> · <Link href="/" style={{ color: 'var(--ac)' }}>Quay lạiTrang chủ</Link>
        </p>
      </main>
    </>
  );
}
