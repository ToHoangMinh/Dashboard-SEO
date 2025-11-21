# 📋 CHECKLIST KIỂM THỬ DASHBOARD BÁN HÀNG

## 🚀 Hướng dẫn chạy ứng dụng

### Bước 1: Cài đặt
```bash
# Tạo thư mục dự án
mkdir deadlineSEO-dashboard
cd deadlineSEO-dashboard

# Copy 4 files vào thư mục:
# - index.html
# - styles.css
# - script.js
# - sample-data.json

# Chạy local server (chọn 1 trong các cách sau):

# Cách 1: Python
python -m http.server 8000

# Cách 2: Node.js 
npx serve .

# Cách 3: PHP
php -S localhost:8000

# Cách 4: VS Code với Live Server extension
```

### Bước 2: Truy cập
Mở trình duyệt và truy cập: `http://localhost:8000`

---

## ✅ CHECKLIST SEO & METADATA

### Meta Tags Cơ Bản
- [ ] **Title tag** có mặt và dưới 60 ký tự
- [ ] **Meta description** có mặt và 150-160 ký tự  
- [ ] **Meta viewport** cho responsive
- [ ] **Meta charset UTF-8**
- [ ] **Canonical URL** được đặt đúng
- [ ] **Meta robots** index, follow

### Open Graph & Social
- [ ] **og:title** có mặt
- [ ] **og:description** có mặt
- [ ] **og:image** có mặt (1200x630px)
- [ ] **og:url** chính xác
- [ ] **og:type** = website
- [ ] **Twitter Card** meta tags

### Schema.org JSON-LD
- [ ] **Organization schema** có đầy đủ thông tin
- [ ] **WebPage schema** có mặt
- [ ] **JSON-LD syntax** hợp lệ (kiểm tra với Google Rich Results Test)

### SEO Content
- [ ] **H1 tag** duy nhất cho tiêu đề chính
- [ ] **H2-H6** được sử dụng đúng thứ tự
- [ ] **Alt text** cho tất cả hình ảnh
- [ ] **Nội dung chính** có trong HTML (không chỉ JS-generated)

---

## 📱 CHECKLIST RESPONSIVE DESIGN

### Breakpoints Test
- [ ] **Desktop** (1920px, 1440px, 1024px) - Layout 3 cột
- [ ] **Tablet** (768px, 1024px) - Layout 2 cột, sidebar ẩn
- [ ] **Mobile** (375px, 414px, 360px) - Layout 1 cột stacked

### Mobile Specific
- [ ] **Sidebar** chuyển thành overlay trên mobile
- [ ] **Date dropdown** ẩn trên mobile nhỏ
- [ ] **Table** scroll ngang trên mobile
- [ ] **Touch targets** tối thiểu 44px
- [ ] **Text** đọc được không cần zoom

### Interaction Tests
- [ ] **Sidebar toggle** hoạt động mượt
- [ ] **Charts** responsive khi resize
- [ ] **Table sorting** hoạt động trên mọi thiết bị
- [ ] **Buttons** có feedback khi tap/click

---

## ⚡ CHECKLIST PERFORMANCE & LIGHTHOUSE

### Core Web Vitals
- [ ] **LCP** (Largest Contentful Paint) < 2.5s
- [ ] **FID** (First Input Delay) < 100ms  
- [ ] **CLS** (Cumulative Layout Shift) < 0.1

### Performance Optimizations
- [ ] **Preconnect** cho Google Fonts và CDN
- [ ] **Font-display: swap** được áp dụng
- [ ] **Chart.js** load từ CDN
- [ ] **Images** có loading="lazy" khi cần
- [ ] **CSS** minification trong production

### Lighthouse Scores (Target)
- [ ] **Performance**: 90+
- [ ] **Accessibility**: 95+
- [ ] **Best Practices**: 90+
- [ ] **SEO**: 100

### Tools để test
```bash
# Google Lighthouse (Chrome DevTools)
# PageSpeed Insights: https://pagespeed.web.dev/
# GTmetrix: https://gtmetrix.com/
# WebPageTest: https://www.webpagetest.org/
```

---

## ♿ CHECKLIST ACCESSIBILITY

### Keyboard Navigation
- [ ] **Tab order** logic và liên tục
- [ ] **Focus indicators** rõ ràng
- [ ] **Skip links** cho navigation
- [ ] **Escape** đóng sidebar trên mobile

### ARIA & Semantic
- [ ] **Landmark roles** (banner, navigation, main, complementary)
- [ ] **ARIA labels** cho interactive elements
- [ ] **Screen reader** friendly table headers
- [ ] **Color contrast** ratio ≥ 4.5:1

### Interactive Elements
- [ ] **Buttons** có accessible names
- [ ] **Form controls** có labels
- [ ] **Error messages** associatd với controls
- [ ] **Status updates** announced to screen readers

---

## 🎯 CHECKLIST FUNCTIONALITY

### Charts & Visualization
- [ ] **Revenue chart** hiển thị đúng data
- [ ] **Products chart** hiển thị top 5 sản phẩm
- [ ] **Charts responsive** khi resize
- [ ] **Tooltips** hiển thị đúng format tiền tệ

### Data Management
- [ ] **Table sorting** hoạt động cho tất cả cột
- [ ] **CSV export** tạo file đúng format
- [ ] **Print report** tạo PDF/print đẹp
- [ ] **Refresh function** update data

### User Interface
- [ ] **KPI cards** hiển thị đúng màu cho tăng/giảm
- [ ] **Status badges** đúng màu theo trạng thái
- [ ] **Date picker** functional
- [ ] **Notifications** hiển thị và tự đóng

### Cross-browser Compatibility
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)  
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile browsers** (iOS Safari, Chrome Mobile)

---

## 🔍 CHECKLIST ADVANCED FEATURES

### PWA Readiness
- [ ] **Service Worker** registered (commented in script.js)
- [ ] **Web App Manifest** có thể thêm
- [ ] **Offline fallback** có thể implement

### Security
- [ ] **CSP headers** có thể implement
- [ ] **HTTPS** ready
- [ ] **XSS protection** via proper escaping

### Analytics Ready
- [ ] **Google Analytics** integration points
- [ ] **Goal tracking** events setup
- [ ] **Custom events** for user actions

---

## 🐛 COMMON ISSUES & FIXES

### Chart.js Issues
```javascript
// Nếu charts không hiển thị:
// 1. Kiểm tra CDN link
// 2. Đảm bảo canvas có width/height
// 3. Kiểm tra console errors

// Fix responsive charts:
window.addEventListener('resize', function() {
  if (revenueChart) revenueChart.resize();
  if (productsChart) productsChart.resize();
});
```

### CSS Issues
```css
/* Fix flexbox issues trên Safari */
.flex-container {
  -webkit-flex: 1;
  flex: 1;
}

/* Fix grid layout trên IE11 */
@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
}
```

### JavaScript Issues
```javascript
// Polyfill cho IntersectionObserver (IE)
if (!window.IntersectionObserver) {
  // Load polyfill
}

// Handle các browser không support ES6
// Transpile với Babel nếu cần support IE11
```

---

## 📊 TESTING MATRIX

| Device/Browser | Desktop Chrome | Desktop Firefox | Desktop Safari | Mobile Chrome | Mobile Safari | Status |
|----------------|----------------|-----------------|----------------|---------------|---------------|---------|
| Layout         | ⬜             | ⬜              | ⬜             | ⬜            | ⬜            |         |
| Charts         | ⬜             | ⬜              | ⬜             | ⬜            | ⬜            |         |
| Interactions   | ⬜             | ⬜              | ⬜             | ⬜            | ⬜            |         |
| Performance    | ⬜             | ⬜              | ⬜             | ⬜            | ⬜            |         |
| Accessibility  | ⬜             | ⬜              | ⬜             | ⬜            | ⬜            |         |

---

## 🎯 FINAL DEPLOYMENT CHECKLIST

- [ ] **Minify CSS/JS** cho production
- [ ] **Optimize images** (WebP format)
- [ ] **Setup CDN** cho static assets
- [ ] **Configure caching** headers
- [ ] **Setup monitoring** (Google Analytics, error tracking)
- [ ] **SSL certificate** installed
- [ ] **Sitemap.xml** generated
- [ ] **Robots.txt** configured

---

**🚀 Ready to launch khi tất cả checkboxes được tích! ✅**