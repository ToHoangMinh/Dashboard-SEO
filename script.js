// Dashboard Sales Management System
// Main JavaScript file with Chart.js integration, table sorting, CSV export

// Sample data for demo - trong thực tế sẽ load từ API
const SAMPLE_DATA = {
  kpiData: {
    revenue: {
      today: 45890000,
      yesterday: 40850000,
      change: 12.5
    },
    orders: {
      today: 247,
      yesterday: 228,
      change: 8.3
    },
    conversion: {
      today: 3.2,
      yesterday: 3.7,
      change: -0.5
    },
    visitors: {
      today: 7823,
      yesterday: 6762,
      change: 15.7
    }
  },
  
  // Revenue data for 30 days
  revenueChart: {
    labels: Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }),
    data: [
      42500000, 38900000, 45200000, 41800000, 48600000, 52300000, 49800000,
      46700000, 44200000, 47900000, 51200000, 48800000, 45600000, 49300000,
      52800000, 47400000, 44900000, 48700000, 51600000, 49200000, 46800000,
      50400000, 53200000, 48900000, 47600000, 49800000, 52100000, 48300000,
      46900000, 45890000
    ]
  },
  
  // Top 5 products data
  productsChart: {
    labels: ['Áo thun basic', 'Giày sneaker', 'Túi xách', 'Điện thoại', 'Laptop'],
    data: [156, 142, 128, 98, 87],
    colors: ['#0fb9a0', '#5b4de3', '#ff6b6b', '#ff9500', '#af52de']
  },
  
  // Recent orders data
  orders: [
    { id: 'DH001', customer: 'Nguyễn Minh Tuấn', total: 1250000, status: 'completed', date: '2024-10-15' },
    { id: 'DH002', customer: 'Trần Thị Mai Anh', total: 890000, status: 'processing', date: '2024-10-18' },
    { id: 'DH003', customer: 'Lê Hoàng Nam', total: 2150000, status: 'pending', date: '2024-10-12' },
    { id: 'DH004', customer: 'Phạm Thị Hương', total: 675000, status: 'completed', date: '2024-10-20' },
    { id: 'DH005', customer: 'Hoàng Văn Đức', total: 1450000, status: 'cancelled', date: '2024-10-08' },
    { id: 'DH006', customer: 'Vũ Thị Lan', total: 3200000, status: 'processing', date: '2024-10-22' },
    { id: 'DH007', customer: 'Đặng Minh Quang', total: 950000, status: 'completed', date: '2024-10-14' },
    { id: 'DH008', customer: 'Bùi Thị Hoa', total: 1780000, status: 'pending', date: '2024-10-16' },
    { id: 'DH009', customer: 'Ngô Văn Thành', total: 2450000, status: 'completed', date: '2024-10-19' },
    { id: 'DH010', customer: 'Dương Thị Linh', total: 1120000, status: 'processing', date: '2024-10-21' },
    { id: 'DH011', customer: 'Nguyễn Thị Thu', total: 1850000, status: 'completed', date: '2024-10-11' },
    { id: 'DH012', customer: 'Trần Văn Hùng', total: 750000, status: 'pending', date: '2024-10-13' },
    { id: 'DH013', customer: 'Lê Thị Nga', total: 2200000, status: 'completed', date: '2024-10-17' },
    { id: 'DH014', customer: 'Phạm Văn Tài', total: 1350000, status: 'processing', date: '2024-10-09' },
    { id: 'DH015', customer: 'Hoàng Thị Hạnh', total: 980000, status: 'completed', date: '2024-10-10' }
  ]
};

// Global variables
let currentSortColumn = null;
let currentSortDirection = 'asc';
let revenueChart, productsChart;
let chartsCompactMode = false;

// Default configuration values
const DEFAULT_CONFIG = {
  openaiApiKey: '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',
  googleSheetsUrl: 'https://docs.google.com/spreadsheets/d/1kQTZ-BxfjfAdZmLjd4PNwwd7jQd9TW3NrIgdhMSjCNk/edit?gid=0#gid=0',
  aiModel: 'gpt-4o-mini',
  industry: 'Thương mại điện tử',
  thresholds: {
    revenueMin: 40000000,
    ordersMin: 200,
    conversionMin: 3,
    visitorsMin: 6000
  }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dashboard initializing...');
  
  // Initialize all components
  initializeSidebar();
  if (window.Chart) {
    initializeCharts();
  }
  initializeTable();
  initializeKPICards();
  initializeDateDropdown();
  initializeReportsSection();
  initializeCompactChartsToggle();
  initializeNavScrolling();
  initializeAISection();
  initializeWooSettings();
  
  console.log('Dashboard initialized successfully');
});

// Sidebar functionality
function initializeSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const body = document.body;
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      body.classList.toggle('sidebar-collapsed');
      
      // Update ARIA attributes
      const isCollapsed = body.classList.contains('sidebar-collapsed');
      sidebarToggle.setAttribute('aria-expanded', !isCollapsed);
      
      // Save state to localStorage
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
  }
  
  // Restore sidebar state from localStorage
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true') {
    body.classList.add('sidebar-collapsed');
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'false');
    }
  }
  
  // Mobile sidebar toggle
  if (window.innerWidth <= 1024) {
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function() {
        body.classList.toggle('sidebar-open');
      });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024 && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('.sidebar-toggle')) {
        body.classList.remove('sidebar-open');
      }
    });
  }
}

// Initialize Charts using Chart.js
function initializeCharts() {
  // Revenue Chart (Line Chart)
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: SAMPLE_DATA.revenueChart.labels,
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: SAMPLE_DATA.revenueChart.data,
          borderColor: '#0fb9a0',
          backgroundColor: 'rgba(15, 185, 160, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0fb9a0',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#0fb9a0',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Doanh thu: ' + formatCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter',
                size: 11
              },
              callback: function(value) {
                return formatCurrency(value, true);
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }
  
  // Products Chart (Bar Chart)
  const productsCtx = document.getElementById('productsChart');
  if (productsCtx) {
    productsChart = new Chart(productsCtx, {
      type: 'bar',
      data: {
        labels: ['Ty giả an toàn', 'Kẹo dẻo vitamin', 'Máy sấy tóc', 'Viên tẩy lồng giặt', 'Nồi mini đa năng'],
        datasets: [{
          label: 'Số lượng bán (Mẹ & Bé)',
          data: [128, 142, 98, 87, 76],
          backgroundColor: SAMPLE_DATA.productsChart.colors,
          borderColor: SAMPLE_DATA.productsChart.colors,
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#5b4de3',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          }
        }
      }
    });
  }
}

function initializeCompactChartsToggle() {
  const btn = document.getElementById('compactChartsBtn');
  if (!btn) return;
  chartsCompactMode = localStorage.getItem('chartsCompactMode') === 'true';
  btn.setAttribute('aria-pressed', String(chartsCompactMode));
  if (chartsCompactMode && window.Chart) applyCompactMode();

  btn.addEventListener('click', function() {
    chartsCompactMode = !chartsCompactMode;
    localStorage.setItem('chartsCompactMode', String(chartsCompactMode));
    btn.setAttribute('aria-pressed', String(chartsCompactMode));
    if (chartsCompactMode && window.Chart) {
      applyCompactMode();
      showNotification('Đã bật chế độ thu gọn biểu đồ', 'success');
    } else {
      if (window.Chart) removeCompactMode();
      showNotification('Đã tắt chế độ thu gọn biểu đồ');
    }
  });
}

function applyCompactMode() {
  if (revenueChart) {
    const ds = revenueChart.data.datasets[0];
    ds.borderWidth = 2;
    ds.pointRadius = 0;
    ds.pointHoverRadius = 0;
    revenueChart.options.plugins.legend.display = false;
    revenueChart.options.scales.x.grid.display = false;
    revenueChart.options.scales.y.grid.display = false;
    revenueChart.options.scales.y.ticks.maxTicksLimit = 4;
    revenueChart.update();
  }
  if (productsChart) {
    productsChart.options.plugins.legend.display = false;
    productsChart.options.scales.x.ticks.maxTicksLimit = 4;
    productsChart.options.scales.y.grid.display = false;
    const dsb = productsChart.data.datasets[0];
    dsb.borderWidth = 0;
    productsChart.update();
  }
}

function removeCompactMode() {
  if (revenueChart) {
    const ds = revenueChart.data.datasets[0];
    ds.borderWidth = 3;
    ds.pointRadius = 4;
    ds.pointHoverRadius = 6;
    revenueChart.options.plugins.legend.display = true;
    revenueChart.options.scales.x.grid.display = true;
    revenueChart.options.scales.y.grid.display = true;
    delete revenueChart.options.scales.y.ticks.maxTicksLimit;
    revenueChart.update();
  }
  if (productsChart) {
    productsChart.options.plugins.legend.display = false;
    delete productsChart.options.scales.x.ticks.maxTicksLimit;
    productsChart.options.scales.y.grid.display = true;
    const dsb = productsChart.data.datasets[0];
    dsb.borderWidth = 1;
    productsChart.update();
  }
}

// Initialize KPI Cards
function initializeKPICards() {
  const kpiData = SAMPLE_DATA.kpiData;
  
  // Update revenue card
  updateKPICard('revenue-today', formatCurrency(kpiData.revenue.today));
  updateKPICard('revenue-change', `${kpiData.revenue.change > 0 ? '+' : ''}${kpiData.revenue.change}% so với hôm qua`, kpiData.revenue.change > 0);
  
  // Update orders card
  updateKPICard('orders-today', `${kpiData.orders.today} đơn mẹ & bé`);
  updateKPICard('orders-change', `${kpiData.orders.change > 0 ? '+' : ''}${kpiData.orders.change}% so với hôm qua`, kpiData.orders.change > 0);
  
  // Update conversion card
  updateKPICard('conversion-rate', `${kpiData.conversion.today}%`);
  updateKPICard('conversion-change', `${kpiData.conversion.change}% so với hôm qua`, kpiData.conversion.change > 0);
  
  // Update visitors card
  updateKPICard('visitors-today', `${kpiData.visitors.today.toLocaleString('vi-VN')} lượt`);
  updateKPICard('visitors-change', `${kpiData.visitors.change > 0 ? '+' : ''}${kpiData.visitors.change}% so với hôm qua`, kpiData.visitors.change > 0);
}

function updateKPICard(elementId, value, isPositive = null) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
    
    if (isPositive !== null) {
      element.className = element.className.replace(/\b(positive|negative)\b/g, '');
      element.classList.add(isPositive ? 'positive' : 'negative');
    }
  }
}

// Initialize Table
function initializeTable() {
  renderOrdersTable(SAMPLE_DATA.orders);
  initializeTableSorting();
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customer}</td>
      <td><strong>${formatCurrency(order.total)}</strong></td>
      <td>
        <span class="status-badge status-${order.status}">
          ${getStatusText(order.status)}
        </span>
      </td>
      <td>${formatDate(order.date)}</td>
    </tr>
  `).join('');
}

function getStatusText(status) {
  const statusMap = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return statusMap[status] || status;
}

// Table Sorting
function initializeTableSorting() {
  const sortableHeaders = document.querySelectorAll('.sortable');
  
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const column = this.dataset.column;
      
      if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
      }
      
      sortTable(column, currentSortDirection);
      updateSortIndicators(this, currentSortDirection);
    });
  });
}

function sortTable(column, direction) {
  const sortedOrders = [...SAMPLE_DATA.orders].sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Handle different data types
    if (column === 'total') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    } else if (column === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  renderOrdersTable(sortedOrders);
}

function updateSortIndicators(activeHeader, direction) {
  // Reset all indicators
  document.querySelectorAll('.sort-indicator').forEach(indicator => {
    indicator.textContent = '↕️';
  });
  
  // Update active indicator
  const indicator = activeHeader.querySelector('.sort-indicator');
  if (indicator) {
    indicator.textContent = direction === 'asc' ? '↑' : '↓';
  }
}

// Date Dropdown
function initializeDateDropdown() {
  const dateDropdown = document.getElementById('dateRange');
  if (dateDropdown) {
    dateDropdown.addEventListener('change', function() {
      const selectedRange = this.value;
      console.log('Date range changed to:', selectedRange);
      
      // In a real application, this would trigger a data refresh
      // For demo purposes, we'll just show a message
      showNotification(`Đã chuyển sang khoảng thời gian: ${this.options[this.selectedIndex].text}`);
    });
  }
}

// CSV Export Functionality
function exportToCSV() {
  const headers = ['Mã Đơn', 'Khách Hàng', 'Tổng Tiền', 'Trạng Thái', 'Ngày Đặt'];
  const csvContent = [
    headers.join(','),
    ...SAMPLE_DATA.orders.map(order => [
      order.id,
      `"${order.customer}"`,
      order.total,
      `"${getStatusText(order.status)}"`,
      order.date
    ].join(','))
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `don-hang-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Xuất file CSV thành công!');
}

// Print Report Functionality
function printReport() {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Báo Cáo Dashboard - ${new Date().toLocaleDateString('vi-VN')}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .kpi-summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
        .kpi-item { border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
        .orders-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .orders-table th, .orders-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .orders-table th { background-color: #f2f2f2; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Báo Cáo Dashboard Bán Hàng</h1>
        <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      
      <div class="kpi-summary">
        <div class="kpi-item">
          <h3>Doanh thu hôm nay</h3>
          <p><strong>${formatCurrency(SAMPLE_DATA.kpiData.revenue.today)}</strong></p>
          <small>${SAMPLE_DATA.kpiData.revenue.change > 0 ? '+' : ''}${SAMPLE_DATA.kpiData.revenue.change}% so với hôm qua</small>
        </div>
        <div class="kpi-item">
          <h3>Đơn hàng</h3>
          <p><strong>${SAMPLE_DATA.kpiData.orders.today} đơn</strong></p>
          <small>${SAMPLE_DATA.kpiData.orders.change > 0 ? '+' : ''}${SAMPLE_DATA.kpiData.orders.change}% so với hôm qua</small>
        </div>
        <div class="kpi-item">
          <h3>Tỉ lệ chuyển đổi</h3>
          <p><strong>${SAMPLE_DATA.kpiData.conversion.today}%</strong></p>
          <small>${SAMPLE_DATA.kpiData.conversion.change}% so với hôm qua</small>
        </div>
        <div class="kpi-item">
          <h3>Lượt truy cập</h3>
          <p><strong>${SAMPLE_DATA.kpiData.visitors.today.toLocaleString('vi-VN')} lượt</strong></p>
          <small>${SAMPLE_DATA.kpiData.visitors.change > 0 ? '+' : ''}${SAMPLE_DATA.kpiData.visitors.change}% so với hôm qua</small>
        </div>
      </div>
      
      <h2>Đơn hàng gần đây</h2>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Khách Hàng</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Ngày Đặt</th>
          </tr>
        </thead>
        <tbody>
          ${SAMPLE_DATA.orders.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.customer}</td>
              <td>${formatCurrency(order.total)}</td>
              <td>${getStatusText(order.status)}</td>
              <td>${formatDate(order.date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
  
  showNotification('Đang chuẩn bị báo cáo để in...');
}

// Refresh Dashboard
function refreshDashboard() {
  showNotification('Đang làm mới dữ liệu...');
  
  // Simulate API call delay
  setTimeout(() => {
    // In a real application, this would fetch new data from the API
    // For demo, we'll just re-initialize with slightly different data
    
    // Add some randomness to simulate real-time data
    const variation = () => (Math.random() - 0.5) * 0.1; // ±5% variation
    
    // Update KPI data with small variations
    SAMPLE_DATA.kpiData.revenue.today = Math.round(SAMPLE_DATA.kpiData.revenue.today * (1 + variation()));
    SAMPLE_DATA.kpiData.orders.today = Math.round(SAMPLE_DATA.kpiData.orders.today * (1 + variation()));
    SAMPLE_DATA.kpiData.visitors.today = Math.round(SAMPLE_DATA.kpiData.visitors.today * (1 + variation()));
    
    // Re-initialize components
    initializeKPICards();
    
    // Update charts with animation
    if (revenueChart) {
      revenueChart.data.datasets[0].data = SAMPLE_DATA.revenueChart.data.map(val => 
        Math.round(val * (1 + variation()))
      );
      revenueChart.update('active');
    }
    
    if (productsChart) {
      productsChart.data.datasets[0].data = SAMPLE_DATA.productsChart.data.map(val => 
        Math.round(val * (1 + variation()))
      );
      productsChart.update('active');
    }
    
    showNotification('Dữ liệu đã được cập nhật!', 'success');
  }, 1500);
}

// Utility Functions
function formatCurrency(amount, abbreviated = false) {
  if (abbreviated && amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 500;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
  if (revenueChart) {
    revenueChart.resize();
  }
  if (productsChart) {
    productsChart.resize();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + R: Refresh dashboard
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    refreshDashboard();
  }
  
  // Ctrl/Cmd + E: Export CSV
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    exportToCSV();
  }
  
  // Ctrl/Cmd + P: Print report
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    printReport();
  }
  
  // ESC: Close sidebar on mobile
  if (e.key === 'Escape' && window.innerWidth <= 1024) {
    document.body.classList.remove('sidebar-open');
  }
});

// Service Worker registration for PWA capability (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // In a production environment, you would register a service worker here
    console.log('Service Worker support detected');
  });
}

// Performance monitoring
if (window.performance && window.performance.mark) {
  window.addEventListener('load', function() {
    window.performance.mark('dashboard-loaded');
    console.log('Dashboard load time:', window.performance.now(), 'ms');
  });
}

// Export functions for global access
window.exportToCSV = exportToCSV;
window.printReport = printReport;
window.refreshDashboard = refreshDashboard;
window.backupData = backupData;
window.aiSendMessage = aiSendMessage;
window.analyzeKPIThresholds = analyzeKPIThresholds;
window.fetchDailySEOTrends = fetchDailySEOTrends;
window.syncWooCommerce = syncWooCommerce;
window.loadSampleData = loadSampleData;

// ==========================
// Google Sheets Integration
// ==========================

function initializeReportsSection() {
  // Set default Google Sheets URL
  const sheetUrlInput = document.getElementById('sheetUrlInput');
  if (sheetUrlInput && !sheetUrlInput.value) {
    sheetUrlInput.value = DEFAULT_CONFIG.googleSheetsUrl;
  }
  
  // Add sample data button for testing
  const reportsControls = document.querySelector('.reports-controls');
  if (reportsControls && !document.getElementById('sampleDataBtn')) {
    const sampleBtn = document.createElement('button');
    sampleBtn.id = 'sampleDataBtn';
    sampleBtn.className = 'quick-action-btn';
    sampleBtn.innerHTML = '📊 Dữ Liệu Mẫu';
    sampleBtn.onclick = loadSampleData;
    reportsControls.appendChild(sampleBtn);
  }

  const syncBtn = document.getElementById('syncSheetBtn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async function() {
      const input = document.getElementById('sheetUrlInput');
      const raw = input ? input.value.trim() : '';
      if (!raw) {
        showNotification('Vui lòng dán Google Sheet URL hoặc ID.', 'error');
        return;
      }

      try {
        showNotification('Đang lấy dữ liệu từ Google Sheet...');
        const { csvUrl, gvizUrl } = buildGoogleSheetUrls(raw);
        let rows = [];
        try {
          const csvText = await fetchText(csvUrl);
          rows = parseCsvToRows(csvText);
        } catch (e) {
          // Fallback to GViz if CSV fails (e.g. not published as CSV)
          const gvizText = await fetchText(gvizUrl);
          rows = parseGvizToRows(gvizText);
        }

        if (!rows.length) {
          throw new Error('Không có hàng dữ liệu nào trong Sheet');
        }

        const orders = mapRowsToOrders(rows);
        if (!orders.length) {
          const availableHeaders = rows.length > 0 ? Object.keys(rows[0]).join(', ') : 'Không có';
          throw new Error(`Không thể ánh xạ dữ liệu Sheet sang đơn hàng. Headers có sẵn: ${availableHeaders}. Cần có các cột: ID, Customer, Total, Status, Date`);
        }

        // Optionally replace SAMPLE_DATA.orders with fetched orders
        SAMPLE_DATA.orders = orders;
        renderOrdersTable(SAMPLE_DATA.orders);
        const report = aggregateOrdersReport(orders);
        renderReportsSummary(report);
        showNotification('Đồng bộ Google Sheet thành công!', 'success');
      } catch (err) {
        console.error(err);
        showNotification('Lỗi đồng bộ Google Sheet: ' + err.message, 'error');
      }
    });
  }
}

function buildGoogleSheetUrls(input) {
  // Accept full URL or raw ID
  const idMatch = input.match(/[-\w]{25,}/);
  const sheetId = idMatch ? idMatch[0] : input;
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  return { csvUrl, gvizUrl };
}

async function fetchText(url) {
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function parseCsvToRows(csvText) {
  // Simple CSV parser handling commas and quotes
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map(h => normalizeHeader(h));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map(s => s.trim().replace(/^"|"$/g, ''));
}

function parseGvizToRows(text) {
  // GViz JSON is wrapped like: google.visualization.Query.setResponse(...)
  const jsonStr = text.replace(/^.*setResponse\(/, '').replace(/\);?\s*$/, '');
  const obj = JSON.parse(jsonStr);
  const table = obj.table;
  const headers = table.cols.map(c => normalizeHeader(c.label || c.id || ''));
  const rows = table.rows.map(r => {
    const row = {};
    r.c.forEach((cell, idx) => {
      row[headers[idx]] = cell && cell.v != null ? String(cell.v) : '';
    });
    return row;
  });
  return rows;
}

function normalizeHeader(h) {
  return String(h).toLowerCase().trim().replace(/\s+/g, '_');
}

function mapRowsToOrders(rows) {
  console.log('Mapping rows to orders:', rows.length, 'rows');
  
  // Expect headers: id, customer, total, status, date (case-insensitive)
  const keyMap = {
    id: ['id', 'order_id', 'ma_don', 'code', 'mã_đơn', 'ma_don_hang'],
    customer: ['customer', 'khach_hang', 'name', 'tên_khách', 'ten_khach_hang', 'client'],
    total: ['total', 'amount', 'tong_tien', 'revenue', 'tổng_tiền', 'gia_tri', 'value'],
    status: ['status', 'trang_thai', 'trạng_thái', 'state', 'tinh_trang'],
    date: ['date', 'ngay_dat', 'created_at', 'ngày_đặt', 'thoi_gian', 'time']
  };

  function findKey(obj, candidates) {
    for (const c of candidates) {
      if (c in obj) return c;
    }
    return null;
  }

  // Debug: Log available headers
  if (rows.length > 0) {
    console.log('Available headers:', Object.keys(rows[0]));
  }

  const orders = [];
  const missingFields = [];
  
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const idKey = findKey(r, keyMap.id);
    const customerKey = findKey(r, keyMap.customer);
    const totalKey = findKey(r, keyMap.total);
    const statusKey = findKey(r, keyMap.status);
    const dateKey = findKey(r, keyMap.date);
    
    // Debug missing fields
    if (!idKey) missingFields.push(`Row ${i}: Missing ID field (tried: ${keyMap.id.join(', ')})`);
    if (!customerKey) missingFields.push(`Row ${i}: Missing Customer field (tried: ${keyMap.customer.join(', ')})`);
    if (!totalKey) missingFields.push(`Row ${i}: Missing Total field (tried: ${keyMap.total.join(', ')})`);
    if (!statusKey) missingFields.push(`Row ${i}: Missing Status field (tried: ${keyMap.status.join(', ')})`);
    if (!dateKey) missingFields.push(`Row ${i}: Missing Date field (tried: ${keyMap.date.join(', ')})`);
    
    if (!(idKey && customerKey && totalKey && statusKey && dateKey)) {
      console.log(`Skipping row ${i}:`, r);
      continue;
    }

    const parsedTotal = parseFloat(String(r[totalKey]).replace(/[^0-9.-]/g, '')) || 0;
    const normalizedStatus = normalizeStatus(String(r[statusKey]));
    const dateIso = normalizeDate(String(r[dateKey]));

    orders.push({
      id: String(r[idKey]).trim(),
      customer: String(r[customerKey]).trim(),
      total: parsedTotal,
      status: normalizedStatus,
      date: dateIso
    });
  }
  
  // Log debug info
  if (missingFields.length > 0) {
    console.log('Missing fields:', missingFields);
  }
  
  console.log('Successfully mapped', orders.length, 'orders');
  return orders;
}

function normalizeStatus(s) {
  const x = s.toLowerCase().trim();
  if (/(completed|done|hoan thanh|hoàn thành|success|finished|hoàn tất)/.test(x)) return 'completed';
  if (/(processing|processing|dang xu ly|đang xử lý|in_progress|in progress|đang gia công)/.test(x)) return 'processing';
  if (/(pending|cho xu ly|chờ xử lý|new|waiting|chờ)/.test(x)) return 'pending';
  if (/(cancel|huy|hủy|cancelled|canceled|đã hủy)/.test(x)) return 'cancelled';
  if (/(shipped|delivered|giao hàng|đã giao)/.test(x)) return 'completed';
  if (/(refund|hoàn tiền|refunded)/.test(x)) return 'cancelled';
  return 'pending';
}

function normalizeDate(s) {
  if (!s || s.trim() === '') {
    return new Date().toISOString().slice(0, 10);
  }
  
  const dateStr = s.trim();
  
  // Try to parse various formats; fallback to today
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  
  // Try dd/mm/yyyy or dd-mm-yyyy
  const m = dateStr.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const month = m[2].padStart(2, '0');
    const year = m[3].length === 2 ? ('20' + m[3]) : m[3];
    return `${year}-${month}-${day}`;
  }
  
  // Try yyyy-mm-dd
  const ymd = dateStr.match(/(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/);
  if (ymd) {
    const year = ymd[1];
    const month = ymd[2].padStart(2, '0');
    const day = ymd[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Try mm/dd/yyyy (US format)
  const usDate = dateStr.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
  if (usDate) {
    const month = usDate[1].padStart(2, '0');
    const day = usDate[2].padStart(2, '0');
    const year = usDate[3];
    return `${year}-${month}-${day}`;
  }
  
  // Fallback to today
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

function aggregateOrdersReport(orders) {
  const summary = {
    totalRevenue: 0,
    totalOrders: 0,
    byStatus: { pending: 0, processing: 0, completed: 0, cancelled: 0 }
  };
  for (const o of orders) {
    summary.totalRevenue += Number(o.total) || 0;
    summary.totalOrders += 1;
    if (summary.byStatus[o.status] == null) summary.byStatus[o.status] = 0;
    summary.byStatus[o.status] += 1;
  }
  return summary;
}

function renderReportsSummary(report) {
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText('report-total-revenue', formatCurrency(Math.round(report.totalRevenue)));
  setText('report-total-orders', `${report.totalOrders} đơn`);
  setText('report-completed', `${report.byStatus.completed || 0}`);
  setText('report-processing', `${report.byStatus.processing || 0}`);
  setText('report-pending', `${report.byStatus.pending || 0}`);
  setText('report-cancelled', `${report.byStatus.cancelled || 0}`);
}

// Load sample data for testing
function loadSampleData() {
  const sampleOrders = [
    { id: 'DH001', customer: 'Nguyễn Minh Tuấn', total: 1250000, status: 'completed', date: '2024-10-15' },
    { id: 'DH002', customer: 'Trần Thị Mai Anh', total: 890000, status: 'processing', date: '2024-10-18' },
    { id: 'DH003', customer: 'Lê Hoàng Nam', total: 2150000, status: 'pending', date: '2024-10-12' },
    { id: 'DH004', customer: 'Phạm Thị Hương', total: 675000, status: 'completed', date: '2024-10-20' },
    { id: 'DH005', customer: 'Hoàng Văn Đức', total: 1450000, status: 'cancelled', date: '2024-10-08' },
    { id: 'DH006', customer: 'Vũ Thị Lan', total: 3200000, status: 'processing', date: '2024-10-22' },
    { id: 'DH007', customer: 'Đặng Minh Quang', total: 950000, status: 'completed', date: '2024-10-14' },
    { id: 'DH008', customer: 'Bùi Thị Hoa', total: 1780000, status: 'pending', date: '2024-10-16' },
    { id: 'DH009', customer: 'Ngô Văn Thành', total: 2450000, status: 'completed', date: '2024-10-19' },
    { id: 'DH010', customer: 'Dương Thị Linh', total: 1120000, status: 'processing', date: '2024-10-21' },
    { id: 'DH011', customer: 'Nguyễn Thị Thu', total: 1850000, status: 'completed', date: '2024-10-11' },
    { id: 'DH012', customer: 'Trần Văn Hùng', total: 750000, status: 'pending', date: '2024-10-13' },
    { id: 'DH013', customer: 'Lê Thị Nga', total: 2200000, status: 'completed', date: '2024-10-17' },
    { id: 'DH014', customer: 'Phạm Văn Tài', total: 1350000, status: 'processing', date: '2024-10-09' },
    { id: 'DH015', customer: 'Hoàng Thị Hạnh', total: 980000, status: 'completed', date: '2024-10-10' }
  ];
  
  SAMPLE_DATA.orders = sampleOrders;
  renderOrdersTable(SAMPLE_DATA.orders);
  const report = aggregateOrdersReport(sampleOrders);
  renderReportsSummary(report);
  showNotification('Đã tải dữ liệu mẫu thành công!', 'success');
}

// ==========================
// Navigation: smooth scroll & active link
// ==========================
function initializeNavScrolling() {
  const links = document.querySelectorAll('.nav-menu a.nav-link');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveNav(href);
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // Highlight on scroll
  const sections = ['#dashboard', '#orders', '#products', '#seo', '#reports', '#ai', '#settings']
    .map(sel => document.querySelector(sel))
    .filter(Boolean);

  window.addEventListener('scroll', function() {
    let current = '#dashboard';
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) {
        current = '#' + (sec.id || '');
        break;
      }
    }
    setActiveNav(current);
  });

  // Initial highlight
  const hash = location.hash && document.querySelector(location.hash) ? location.hash : '#dashboard';
  setActiveNav(hash);
}

function setActiveNav(hash) {
  document.querySelectorAll('.nav-menu a.nav-link').forEach(a => {
    a.classList.remove('active');
    a.removeAttribute('aria-current');
  });
  const active = document.querySelector(`.nav-menu a.nav-link[href="${hash}"]`);
  if (active) {
    active.classList.add('active');
    active.setAttribute('aria-current', 'page');
  }
}

// ==========================
// Backup data
// ==========================
function backupData() {
  try {
    const payload = {
      exportedAt: new Date().toISOString(),
      kpiData: SAMPLE_DATA.kpiData,
      revenueChart: SAMPLE_DATA.revenueChart,
      productsChart: SAMPLE_DATA.productsChart,
      orders: SAMPLE_DATA.orders
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Đã tải xuống bản sao dữ liệu!', 'success');
  } catch (err) {
    console.error(err);
    showNotification('Không thể sao lưu dữ liệu: ' + err.message, 'error');
  }
}

// ==========================
// AI Assistant
// ==========================
function initializeAISection() {
  // Load saved settings or use defaults
  const urlKey = new URLSearchParams(location.search).get('openaiKey');
  if (urlKey) {
    localStorage.setItem('openaiApiKey', urlKey);
  }
  const savedKey = localStorage.getItem('openaiApiKey') || DEFAULT_CONFIG.openaiApiKey;
  const savedModel = localStorage.getItem('aiModel') || DEFAULT_CONFIG.aiModel;
  const savedIndustry = localStorage.getItem('industryInput') || DEFAULT_CONFIG.industry;
  
  const keyInput = document.getElementById('openaiApiKey');
  const modelSelect = document.getElementById('aiModel');
  const industryInput = document.getElementById('industryInput');
  
  // Set default values
  if (keyInput) keyInput.value = savedKey;
  if (modelSelect) modelSelect.value = savedModel;
  if (industryInput) industryInput.value = savedIndustry;

  // Set default threshold values
  const thRevenueMin = document.getElementById('thRevenueMin');
  const thOrdersMin = document.getElementById('thOrdersMin');
  const thConversionMin = document.getElementById('thConversionMin');
  const thVisitorsMin = document.getElementById('thVisitorsMin');
  
  if (thRevenueMin) thRevenueMin.value = DEFAULT_CONFIG.thresholds.revenueMin;
  if (thOrdersMin) thOrdersMin.value = DEFAULT_CONFIG.thresholds.ordersMin;
  if (thConversionMin) thConversionMin.value = DEFAULT_CONFIG.thresholds.conversionMin;
  if (thVisitorsMin) thVisitorsMin.value = DEFAULT_CONFIG.thresholds.visitorsMin;

  // Persist changes
  if (keyInput) keyInput.addEventListener('change', () => localStorage.setItem('openaiApiKey', keyInput.value.trim()));
  if (modelSelect) modelSelect.addEventListener('change', () => localStorage.setItem('aiModel', modelSelect.value));
  if (industryInput) industryInput.addEventListener('change', () => localStorage.setItem('industryInput', industryInput.value.trim()));

  const analyzeBtn = document.getElementById('analyzeKpiBtn');
  if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeKPIThresholds);

  const trendsBtn = document.getElementById('seoTrendsBtn');
  if (trendsBtn) trendsBtn.addEventListener('click', fetchDailySEOTrends);

  const sendBtn = document.getElementById('aiSendBtn');
  const userInput = document.getElementById('aiUserInput');
  if (sendBtn && userInput) {
    sendBtn.addEventListener('click', aiSendMessage);
    userInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') aiSendMessage();
    });
  }
}

// ==========================
// WooCommerce Integration
// ==========================
function initializeWooSettings() {
  const urlInput = document.getElementById('wooStoreUrl');
  const keyInput = document.getElementById('wooConsumerKey');
  const secretInput = document.getElementById('wooConsumerSecret');
  const syncBtn = document.getElementById('wooSyncBtn');
  if (!urlInput || !keyInput || !secretInput || !syncBtn) return;

  // Load saved
  urlInput.value = localStorage.getItem('wooStoreUrl') || 'https://khanhngockorea.com';
  keyInput.value = localStorage.getItem('wooConsumerKey') || '';
  secretInput.value = localStorage.getItem('wooConsumerSecret') || '';

  // Persist changes
  urlInput.addEventListener('change', () => localStorage.setItem('wooStoreUrl', urlInput.value.trim()));
  keyInput.addEventListener('change', () => localStorage.setItem('wooConsumerKey', keyInput.value.trim()));
  secretInput.addEventListener('change', () => localStorage.setItem('wooConsumerSecret', secretInput.value.trim()));

  syncBtn.addEventListener('click', syncWooCommerce);
}

async function syncWooCommerce() {
  const baseUrl = (document.getElementById('wooStoreUrl')?.value || '').replace(/\/$/, '');
  const ck = (document.getElementById('wooConsumerKey')?.value || '').trim();
  const cs = (document.getElementById('wooConsumerSecret')?.value || '').trim();
  if (!baseUrl || !ck || !cs) {
    showNotification('Vui lòng nhập đủ Store URL, Consumer Key, Consumer Secret.', 'error');
    return;
  }

  try {
    showNotification('Đang đồng bộ đơn hàng từ WooCommerce...');
    // WooCommerce REST API v3: /wp-json/wc/v3/orders
    const url = `${baseUrl}/wp-json/wc/v3/orders?per_page=20&order=desc&orderby=date&consumer_key=${encodeURIComponent(ck)}&consumer_secret=${encodeURIComponent(cs)}`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`WooCommerce API ${res.status}`);
    const orders = await res.json();

    // Map to dashboard orders
    const mapped = (orders || []).map(o => ({
      id: String(o.number || o.id),
      customer: o.billing ? `${o.billing.first_name || ''} ${o.billing.last_name || ''}`.trim() || (o.customer_id ? `Khách #${o.customer_id}` : 'Khách lẻ') : 'Khách lẻ',
      total: Number(o.total) || 0,
      status: mapWooStatus(o.status),
      date: (o.date_created || '').slice(0, 10)
    }));

    if (mapped.length) {
      SAMPLE_DATA.orders = mapped;
      renderOrdersTable(SAMPLE_DATA.orders);
      recomputeKPIsFromOrders(mapped);
      showNotification('Đồng bộ WooCommerce thành công!', 'success');
    } else {
      showNotification('Không có đơn hàng để đồng bộ.', 'info');
    }
  } catch (err) {
    console.error(err);
    showNotification('Lỗi đồng bộ WooCommerce: ' + err.message, 'error');
  }
}

function mapWooStatus(s) {
  const x = String(s || '').toLowerCase();
  if (/(completed)/.test(x)) return 'completed';
  if (/(processing|on-hold)/.test(x)) return 'processing';
  if (/(pending|pending-payment)/.test(x)) return 'pending';
  if (/(cancelled|refunded|failed)/.test(x)) return 'cancelled';
  return 'pending';
}

function recomputeKPIsFromOrders(orders) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => (o.date || '').slice(0, 10) === todayStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  const yesterdayOrders = orders.filter(o => (o.date || '').slice(0, 10) === yStr);

  const sum = list => list.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const todayRevenue = sum(todayOrders);
  const yRevenue = sum(yesterdayOrders) || 1;
  const todayCount = todayOrders.length;
  const yCount = yesterdayOrders.length || 1;

  SAMPLE_DATA.kpiData.revenue.today = Math.round(todayRevenue);
  SAMPLE_DATA.kpiData.revenue.yesterday = Math.round(yRevenue);
  SAMPLE_DATA.kpiData.revenue.change = Number(((todayRevenue - yRevenue) / yRevenue * 100).toFixed(1));

  SAMPLE_DATA.kpiData.orders.today = todayCount;
  SAMPLE_DATA.kpiData.orders.yesterday = yCount;
  SAMPLE_DATA.kpiData.orders.change = Number(((todayCount - yCount) / yCount * 100).toFixed(1));

  // Conversion/visitors unknown from orders; keep previous or infer basic
  initializeKPICards();
}
function analyzeKPIThresholds() {
  const warnings = [];
  const { revenue, orders, conversion, visitors } = SAMPLE_DATA.kpiData;
  const revMin = getNumberValue('thRevenueMin', 0);
  const ordMin = getNumberValue('thOrdersMin', 0);
  const crMin = getNumberValue('thConversionMin', 0);
  const visMin = getNumberValue('thVisitorsMin', 0);

  if (revMin && revenue.today < revMin) warnings.push(`Doanh thu hôm nay thấp hơn ngưỡng (${formatCurrency(revenue.today)} < ${formatCurrency(revMin)}).`);
  if (ordMin && orders.today < ordMin) warnings.push(`Số đơn hôm nay thấp hơn ngưỡng (${orders.today} < ${ordMin}).`);
  if (crMin && conversion.today < crMin) warnings.push(`CR hôm nay thấp hơn ngưỡng (${conversion.today}% < ${crMin}%).`);
  if (visMin && visitors.today < visMin) warnings.push(`Traffic hôm nay thấp hơn ngưỡng (${visitors.today.toLocaleString('vi-VN')} < ${visMin.toLocaleString('vi-VN')}).`);

  renderWarningsList(warnings);
  if (!warnings.length) showNotification('Tất cả KPI đang đạt ngưỡng cài đặt.', 'success');
}

function renderWarningsList(warnings) {
  const ul = document.getElementById('aiWarningsList');
  const warningCount = document.getElementById('warningCount');
  if (!ul) return;
  
  ul.innerHTML = '';
  
  // Update warning count
  if (warningCount) {
    warningCount.textContent = warnings.length;
    warningCount.style.display = warnings.length > 0 ? 'block' : 'none';
  }
  
  if (!warnings.length) {
    const li = document.createElement('li');
    li.className = 'no-warnings';
    li.textContent = '✅ Tất cả chỉ số đang ở mức tốt';
    ul.appendChild(li);
    return;
  }
  
  warnings.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    ul.appendChild(li);
  });
}

function getOpenAIKey() {
  const urlKey = new URLSearchParams(location.search).get('openaiKey');
  if (urlKey) return urlKey.trim();
  const inputKey = (document.getElementById('openaiApiKey')?.value || '').trim();
  if (inputKey) return inputKey;
  const saved = (localStorage.getItem('openaiApiKey') || '').trim();
  if (saved) return saved;
  return DEFAULT_CONFIG.openaiApiKey;
}

async function aiSendMessage() {
  const key = getOpenAIKey();
  const model = (document.getElementById('aiModel')?.value || 'gpt-4o-mini').trim();
  const industry = (document.getElementById('industryInput')?.value || '').trim();
  const inputEl = document.getElementById('aiUserInput');
  const log = document.getElementById('aiChatLog');
  if (!inputEl || !log) return;
  const userMsg = inputEl.value.trim();
  if (!userMsg) return;
  if (!key) {
    showNotification('Vui lòng nhập OpenAI API Key.', 'error');
    return;
  }

  appendChat(log, 'user', userMsg);
  inputEl.value = '';

  const sysPrompt = `Bạn là trợ lý bán hàng và SEO cho ngành: ${industry || 'chung'}. Hãy trả lời ngắn gọn, cụ thể, tiếng Việt.`;
  const kpiContext = JSON.stringify(SAMPLE_DATA.kpiData);

  try {
    const answer = await callOpenAIChat(key, model, [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: `Ngữ cảnh KPI hiện tại: ${kpiContext}` },
      { role: 'user', content: userMsg }
    ]);
    appendChat(log, 'assistant', answer);
  } catch (err) {
    console.error(err);
    appendChat(log, 'assistant', 'Xin lỗi, không thể kết nối AI lúc này.');
  }
}

async function fetchDailySEOTrends() {
  const key = getOpenAIKey();
  const model = (document.getElementById('aiModel')?.value || 'gpt-4o-mini').trim();
  const industry = (document.getElementById('industryInput')?.value || '').trim();
  const log = document.getElementById('aiChatLog');
  if (!log) return;
  if (!key) {
    showNotification('Vui lòng nhập OpenAI API Key.', 'error');
    return;
  }
  appendChat(log, 'user', 'Đề xuất xu hướng SEO trong ngành hôm nay');
  try {
    const answer = await callOpenAIChat(key, model, [
      { role: 'system', content: `Bạn là chuyên gia SEO. Ngành: ${industry || 'chung'}. Hãy đưa ra xu hướng SEO trong ngày và 3 hành động cụ thể.` },
      { role: 'user', content: 'Gợi ý xu hướng SEO hôm nay cho ngành.' }
    ]);
    appendChat(log, 'assistant', answer);
  } catch (err) {
    console.error(err);
    appendChat(log, 'assistant', 'Không thể lấy xu hướng SEO hôm nay.');
  }
}

async function callOpenAIChat(apiKey, model, messages) {
  const body = {
    model,
    messages,
    temperature: 0.7
  };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  return content;
}

function appendChat(container, role, text) {
  // Remove welcome message if it exists
  const welcomeMsg = container.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }
  
  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg chat-${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function getNumberValue(id, fallback) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const n = Number(el.value);
  return isNaN(n) ? fallback : n;
}