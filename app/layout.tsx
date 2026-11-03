import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tử ViLá số · Nghê Hải Hạ正宗Tử Vi Đẩu Số',
  description: '基于Nghê Hải Hạ正宗Tử Vi Đẩu Số体系，AISâuLuận giải您的Lá sốCách Cục、Đại HạnLưu Niên、Tình cảmsự nghiệptài phúsức khỏe全方位解析',
  keywords: 'Tử Vi Đẩu Số, Nghê Hải Hạ, Tử Vi Đẩu Số全集, Tử Vi Đẩu Số全书, 骨髓赋, Lá số, Mệnh Lý, 14Chính Tinh, 12Cung Vị',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tử ViLá số · Nghê Hải Hạ正宗Tử Vi Đẩu Số',
    description: '基于Nghê Hải Hạ正宗Tử Vi Đẩu Số体系，AISâuLuận giải您的Lá sốCách Cục、Đại HạnLưu Niên、Tình cảmsự nghiệptài phúsức khỏe全方位解析',
    url: SITE_URL,
    siteName: 'Tử Vi研究',
    locale: 'zh_CN',
    type: 'website',
  },
  // 站长Bình台验证（拿到 verification code 后填入对应字段，重新部署即可）
  verification: {
    // Google Search Console: 在 https://search.google.com/search-console 添加站点后获取
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: 在 https://www.bing.com/webmasters 添加站点后获取
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // 百度站长（等执照下来后）
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 站长（等执照下来后）
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
