/**
 * BookMind AI & Nhã Nam Book Store - Admin Dashboard Logic
 */

let currentAdminUser = null;
let allBooksData = [];
let allOrdersData = [];
let allCategoriesData = [];
let allUsersData = [];

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAdminAuth();
    });
} else {
    initAdminAuth();
}

// =====================================================
// AUTHENTICATION & ROLE CHECK
// =====================================================
function initAdminAuth() {
    const userJson = localStorage.getItem('bookmind_user') || localStorage.getItem('currentUser');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const roles = user.roles || [];
            if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF')) {
                currentAdminUser = user;
                setupAdminUI();
                return;
            } else {
                // Đã đăng nhập nhưng là tài khoản khách hàng -> chuyển về trang khách hàng
                showAdminToast('Tài khoản của bạn là Khách hàng. Đang chuyển về trang Cửa hàng...', 'info');
                setTimeout(() => {
                    window.location.href = '/';
                }, 800);
                return;
            }
        } catch (e) {
            console.error('Error parsing user session:', e);
        }
    }

    // Chưa đăng nhập -> hiển thị modal đăng nhập admin
    showAdminLoginModal();
}

function setupAdminUI() {
    // Hide login modal if open
    closeAdminModal('adminLoginModal');

    // Update profile display
    const nameDisplay = document.getElementById('adminNameDisplay');
    const roleDisplay = document.getElementById('adminRoleDisplay');
    if (nameDisplay) nameDisplay.textContent = currentAdminUser.fullName || currentAdminUser.email;
    if (roleDisplay) roleDisplay.textContent = (currentAdminUser.roles && currentAdminUser.roles.includes('ROLE_ADMIN')) ? 'Quản Trị Viên' : 'Nhân Viên';

    // Load initial tab
    switchTab('dashboard');
}

function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminLoginEmail').value.trim();
    const password = document.getElementById('adminLoginPassword').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success && data.message) {
                showAdminToast(data.message, 'error');
                return;
            }

            const user = data.data || data.user || data;
            const roles = user.roles || [];
            localStorage.setItem('bookmind_user', JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify(user));

            if (!roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_STAFF')) {
                showAdminToast('Tài khoản của bạn là Khách hàng. Đang chuyển về trang Cửa hàng...', 'info');
                setTimeout(() => {
                    window.location.href = '/';
                }, 800);
                return;
            }

            currentAdminUser = user;
            showAdminToast('Đăng nhập Quản Trị thành công!', 'success');
            setupAdminUI();
        })
        .catch(err => {
            showAdminToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
        });
}

function handleAdminLogout() {
    localStorage.removeItem('bookmind_user');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
}

// =====================================================
// TAB NAVIGATION
// =====================================================
function switchTab(tabId) {
    // Update menu items
    document.querySelectorAll('.admin-sidebar .menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabId)) {
            item.classList.add('active');
        }
    });

    // Update tab panes
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    const targetPane = document.getElementById('tab-' + tabId);
    if (targetPane) {
        targetPane.classList.add('active');
    }

    // Update Topbar Title
    const titleMap = {
        'dashboard': 'Tổng Quan Kinh Doanh',
        'books': 'Quản Lý Kho Sách',
        'orders': 'Quản Lý Đơn Hàng',
        'categories': 'Danh Mục Thể Loại',
        'promotions': 'Quản Lý Khuyến Mãi & Giảm Giá',
        'users': 'Quản Lý Khách Hàng',
        'settings': 'Cài Đặt Cửa Hàng'
    };
    const titleEl = document.getElementById('topbarPageTitle');
    if (titleEl && titleMap[tabId]) {
        titleEl.textContent = titleMap[tabId];
    }

    // Load Tab Data
    if (tabId === 'dashboard') loadDashboardStats();
    if (tabId === 'books') {
        loadCategoryOptions();
        loadBooks();
    }
    if (tabId === 'orders') {
        loadOrders();
        startOrdersPolling();
    } else {
        stopOrdersPolling();
    }
    if (tabId === 'categories') loadCategories();
    if (tabId === 'promotions') {
        loadCategoriesForBatchDiscount();
        loadBooksForSingleDiscount();
        loadCoupons();
    }
    if (tabId === 'users') loadUsers();
}

let ordersPollingTimer = null;
function startOrdersPolling() {
    stopOrdersPolling();
    ordersPollingTimer = setInterval(() => {
        const pane = document.getElementById('tab-orders');
        if (pane && pane.classList.contains('active')) {
            // Chỉ polling nếu không đang gõ tìm kiếm
            const searchVal = document.getElementById('orderSearchInput')?.value || '';
            if (!searchVal.trim()) {
                loadOrders();
            }
        } else {
            stopOrdersPolling();
        }
    }, 10000);
}
function stopOrdersPolling() {
    if (ordersPollingTimer) {
        clearInterval(ordersPollingTimer);
        ordersPollingTimer = null;
    }
}

// =====================================================
// 1. DASHBOARD & KPIS
// =====================================================
function loadDashboardStats() {
    fetch('/api/admin/stats')
        .then(res => res.json())
        .then(stats => {
            document.getElementById('kpiTotalRevenue').textContent = formatCurrency(stats.totalRevenue || 0);
            document.getElementById('kpiTotalOrders').textContent = stats.totalOrders || 0;
            document.getElementById('kpiPendingOrders').textContent = (stats.pendingOrders || 0) + ' đơn chờ duyệt';
            document.getElementById('kpiTotalBooks').textContent = stats.totalBooks || 0;
            document.getElementById('kpiLowStockBooks').textContent = (stats.lowStockBooks || 0) + ' cuốn sắp hết hàng';
            document.getElementById('kpiTotalCustomers').textContent = stats.totalCustomers || 0;

            renderRecentOrdersTable(stats.recentOrders || []);
            loadRevenueAnalytics();
        })
        .catch(err => {
            console.error('Error loading dashboard stats:', err);
        });
}

function renderRecentOrdersTable(orders) {
    const tbody = document.getElementById('recentOrdersTableBody');
    if (!tbody) return;

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Chưa có đơn hàng nào gần đây</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong>#${o.trackingNumber || o.id}</strong></td>
            <td>${escapeHtml(o.receiverName || 'Khách hàng')}</td>
            <td>${escapeHtml(o.receiverPhone || 'N/A')}</td>
            <td><strong class="text-primary">${formatCurrency(o.totalAmount)}</strong></td>
            <td>${renderOrderStatusBadge(o.status)}</td>
            <td>
                <button class="btn-action view" onclick="openOrderDetailModal(${o.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// =====================================================
// 1.1 REVENUE ANALYTICS & CHART
// =====================================================
let revenueChartInstance = null;
let currentRevenuePeriod = 'DAY'; // 'DAY', 'MONTH', 'YEAR'
let currentChartType = 'line'; // 'line', 'bar'
let currentRevenueData = null;

function setRevenuePeriod(period) {
    currentRevenuePeriod = period;

    // Update active button
    document.querySelectorAll('.period-btn-group .btn').forEach(btn => btn.classList.remove('active'));
    const btnMap = { 'DAY': 'btnPeriodDay', 'MONTH': 'btnPeriodMonth', 'YEAR': 'btnPeriodYear' };
    const activeBtn = document.getElementById(btnMap[period]);
    if (activeBtn) activeBtn.classList.add('active');

    // Update filter dropdown options
    const select = document.getElementById('revenueFilterSelect');
    if (select) {
        if (period === 'DAY') {
            select.style.display = 'inline-block';
            select.innerHTML = `
                <option value="7">7 ngày qua</option>
                <option value="14">14 ngày qua</option>
                <option value="30" selected>30 ngày qua</option>
                <option value="60">60 ngày qua</option>
            `;
        } else if (period === 'MONTH') {
            select.style.display = 'inline-block';
            const currentYear = new Date().getFullYear();
            select.innerHTML = `
                <option value="${currentYear}" selected>Năm ${currentYear}</option>
                <option value="${currentYear - 1}">Năm ${currentYear - 1}</option>
                <option value="${currentYear - 2}">Năm ${currentYear - 2}</option>
            `;
        } else if (period === 'YEAR') {
            select.style.display = 'none';
        }
    }

    loadRevenueAnalytics();
}

function onRevenueFilterChange() {
    loadRevenueAnalytics();
}

function toggleRevenueChartType(type) {
    currentChartType = type;
    const btnLine = document.getElementById('btnChartTypeLine');
    const btnBar = document.getElementById('btnChartTypeBar');
    if (btnLine && btnBar) {
        btnLine.classList.toggle('active', type === 'line');
        btnBar.classList.toggle('active', type === 'bar');
    }
    if (currentRevenueData) {
        renderRevenueChart(currentRevenueData);
    }
}

function loadRevenueAnalytics() {
    const filterSelect = document.getElementById('revenueFilterSelect');
    const filterVal = filterSelect ? filterSelect.value : '';

    let url = `/api/admin/stats/revenue-analytics?period=${currentRevenuePeriod}`;
    if (currentRevenuePeriod === 'DAY' && filterVal) {
        url += `&days=${filterVal}`;
    } else if (currentRevenuePeriod === 'MONTH' && filterVal) {
        url += `&year=${filterVal}`;
    }

    const subtitleEl = document.getElementById('revenueChartSubtitle');
    if (subtitleEl) subtitleEl.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang tải dữ liệu biểu đồ...';

    fetch(url)
        .then(res => res.json())
        .then(data => {
            currentRevenueData = data;

            // Update Metrics
            const revEl = document.getElementById('metricPeriodRevenue');
            const ordersEl = document.getElementById('metricPeriodOrders');
            const aovEl = document.getElementById('metricPeriodAOV');

            if (revEl) revEl.textContent = formatCurrency(data.totalRevenue || 0);
            if (ordersEl) ordersEl.textContent = (data.totalOrders || 0) + ' đơn';
            if (aovEl) aovEl.textContent = formatCurrency(data.averageOrderValue || 0);

            if (subtitleEl) {
                subtitleEl.innerHTML = `<i class="far fa-calendar-alt me-1"></i> ${escapeHtml(data.filterTitle)} (Cập nhật thời gian thực)`;
            }

            renderRevenueChart(data);
            renderRevenueDetailTable(data.details || []);
        })
        .catch(err => {
            console.error('Error loading revenue analytics:', err);
            if (subtitleEl) subtitleEl.innerHTML = '<i class="fas fa-exclamation-triangle text-danger me-1"></i> Không thể tải dữ liệu thống kê.';
        });
}

function formatShortCurrency(val) {
    if (val >= 1000000) {
        return (val / 1000000).toFixed(1).replace(/\.0$/, '') + ' tr';
    }
    if (val >= 1000) {
        return (val / 1000).toFixed(0) + ' k';
    }
    return val + '₫';
}

function renderRevenueChart(data) {
    const canvas = document.getElementById('revenueChartCanvas') || document.getElementById('revenueAnalyticsChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.35)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.00)');

    const isLine = currentChartType === 'line';

    revenueChartInstance = new Chart(ctx, {
        type: isLine ? 'line' : 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Doanh Thu',
                data: data.revenues,
                borderColor: '#4f46e5',
                borderWidth: isLine ? 3 : 1,
                backgroundColor: isLine ? gradient : 'rgba(79, 70, 229, 0.85)',
                fill: isLine,
                tension: 0.35,
                borderRadius: isLine ? 0 : 6,
                pointRadius: data.labels.length > 31 ? 1 : 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const rev = context.parsed.y || 0;
                            const idx = context.dataIndex;
                            const count = data.orderCounts && data.orderCounts[idx] !== undefined ? data.orderCounts[idx] : 0;
                            return [
                                ` Doanh thu: ${formatCurrency(rev)}`,
                                ` Số đơn hàng: ${count} đơn`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.7)'
                    },
                    ticks: {
                        font: { size: 11 },
                        callback: function (val) {
                            return formatShortCurrency(val);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 11 },
                        maxRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 15
                    }
                }
            }
        }
    });
}

function renderRevenueDetailTable(details) {
    const tbody = document.getElementById('revenueDetailTableBody');
    if (!tbody) return;

    if (!details || details.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">Không có số liệu trong kỳ này</td></tr>`;
        return;
    }

    tbody.innerHTML = details.map(item => `
        <tr>
            <td class="fw-semibold text-dark">${escapeHtml(item.timeLabel)}</td>
            <td class="text-center">${item.orderCount} đơn</td>
            <td class="text-end fw-bold text-primary">${formatCurrency(item.revenue)}</td>
            <td class="text-end">
                <div class="d-flex align-items-center justify-content-end gap-2">
                    <span style="min-width: 45px;">${(item.percentage || 0).toFixed(1)}%</span>
                    <div class="progress" style="width: 50px; height: 6px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${item.percentage || 0}%;"></div>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleRevenueDetailTable() {
    const container = document.getElementById('revenueDetailTableCollapse');
    const textEl = document.getElementById('toggleRevenueDetailText');
    if (!container || !textEl) return;

    const isHidden = container.classList.contains('d-none');
    if (isHidden) {
        container.classList.remove('d-none');
        textEl.innerHTML = `Thu gọn bảng chi tiết <i class="fas fa-chevron-up ms-1"></i>`;
    } else {
        container.classList.add('d-none');
        textEl.innerHTML = `Xem bảng chi tiết số liệu <i class="fas fa-chevron-down ms-1"></i>`;
    }
}

// =====================================================
// 1.2 EXPORT REVENUE REPORT TO PDF & PRINT PREVIEW
// =====================================================
function exportRevenueReportPdf() {
    if (!currentRevenueData) {
        showAdminToast('Chưa có dữ liệu thống kê để xuất báo cáo!', 'error');
        return;
    }

    // Populate PDF elements in the preview modal
    populateRevenuePdfData();

    // Open the preview modal
    openAdminModal('revenueReportModal');
}

function populateRevenuePdfData() {
    if (!currentRevenueData) return;

    const now = new Date();
    const exportDateStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const adminName = (currentAdminUser && (currentAdminUser.fullName || currentAdminUser.email)) || 'Admin BookMind';

    const pdfDateEl = document.getElementById('pdfExportDate');
    const pdfAdminEl = document.getElementById('pdfExportAdmin');
    const pdfSignAdminEl = document.getElementById('pdfSignAdminName');
    const pdfScopeEl = document.getElementById('pdfPeriodScope');
    const pdfRevEl = document.getElementById('pdfTotalRevenue');
    const pdfOrdersEl = document.getElementById('pdfTotalOrders');
    const pdfAovEl = document.getElementById('pdfAverageOrderValue');
    const pdfChartImg = document.getElementById('pdfChartImage');
    const pdfTableBody = document.getElementById('pdfDetailTableBody');
    const modalSubtitle = document.getElementById('modalReportSubtitle');

    if (pdfDateEl) pdfDateEl.textContent = exportDateStr;
    if (pdfAdminEl) pdfAdminEl.textContent = adminName;
    if (pdfSignAdminEl) pdfSignAdminEl.textContent = adminName;
    if (pdfScopeEl) pdfScopeEl.textContent = currentRevenueData.filterTitle || 'Thống Kê Doanh Thu';
    if (pdfRevEl) pdfRevEl.textContent = formatCurrency(currentRevenueData.totalRevenue || 0);
    if (pdfOrdersEl) pdfOrdersEl.textContent = (currentRevenueData.totalOrders || 0) + ' đơn';
    if (pdfAovEl) pdfAovEl.textContent = formatCurrency(currentRevenueData.averageOrderValue || 0);
    if (modalSubtitle) modalSubtitle.textContent = `Kỳ báo cáo: ${currentRevenueData.filterTitle || ''} (Người lập: ${adminName})`;

    // Chart snapshot
    if (revenueChartInstance && pdfChartImg) {
        try {
            pdfChartImg.src = revenueChartInstance.toBase64Image('image/png', 1.0);
        } catch (e) {
            console.error('Error generating chart image for PDF:', e);
        }
    }

    // Detail table rows in PDF
    if (pdfTableBody && currentRevenueData.details) {
        pdfTableBody.innerHTML = currentRevenueData.details.map((row, idx) => `
            <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 10px; font-weight: 600;">${escapeHtml(row.timeLabel)}</td>
                <td style="padding: 6px 10px; text-align: center;">${row.orderCount} đơn</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: 700; color: #4f46e5;">${formatCurrency(row.revenue)}</td>
                <td style="padding: 6px 10px; text-align: right;">${(row.percentage || 0).toFixed(1)}%</td>
            </tr>
        `).join('');
    }
}

function downloadRevenuePdfFile() {
    if (!currentRevenueData) {
        showAdminToast('Chưa có dữ liệu thống kê để xuất PDF!', 'error');
        return;
    }

    if (typeof html2pdf === 'undefined') {
        showAdminToast('Thư viện tạo PDF đang tải, vui lòng thử lại sau 2 giây!', 'error');
        return;
    }

    const btn = document.getElementById('btnDownloadPdfFile');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i> Đang xuất PDF...`;
    }

    populateRevenuePdfData();

    const element = document.getElementById('revenuePdfContent');
    const cleanPeriod = currentRevenuePeriod.toLowerCase();
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Bao-Cao-Doanh-Thu-NhaNam-${cleanPeriod}-${dateStr}.pdf`;

    const opt = {
        margin: [6, 6, 6, 6],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
            showAdminToast('Đã tải xuống file PDF: ' + filename, 'success');
        })
        .catch(err => {
            console.error('PDF export error:', err);
            showAdminToast('Không thể tạo file PDF: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="fas fa-download me-1"></i> Tải File PDF (.pdf)`;
            }
        });

}

function printRevenueReport() {
    populateRevenuePdfData();
    const content = document.getElementById('revenuePdfContent');
    if (!content) return;

    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
        window.print();
        return;
    }

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Báo Cáo Doanh Thu - Nhã Nam Book Store</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; background: #fff; }
                @media print {
                    body { margin: 0; padding: 0; }
                    @page { size: A4 portrait; margin: 10mm; }
                }
            </style>
        </head>
        <body>
            ${content.outerHTML}
            <script>
                window.onload = function() {
                    window.focus();
                    window.print();
                };
            </script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// =====================================================
// 2. BOOK MANAGEMENT (CRUD)
// =====================================================
let booksCurrentPage = 1;
const booksPerPage = 15;
let bookSearchTimeout = null;

function onBookSearchInput() {
    clearTimeout(bookSearchTimeout);
    bookSearchTimeout = setTimeout(() => {
        booksCurrentPage = 1;
        loadBooks();
    }, 250);
}

function loadBooks() {
    const search = document.getElementById('bookSearchInput')?.value.trim() || '';
    const catId = document.getElementById('bookCategoryFilter')?.value || '';
    const status = document.getElementById('bookStatusFilter')?.value || '';

    let url = '/api/admin/books?';
    if (search) url += 'search=' + encodeURIComponent(search) + '&';
    if (catId) url += 'categoryId=' + encodeURIComponent(catId) + '&';
    if (status) url += 'status=' + encodeURIComponent(status) + '&';

    fetch(url)
        .then(res => res.json())
        .then(books => {
            allBooksData = books;
            renderBooksTable(books);
        })
        .catch(err => {
            console.error('Error loading books:', err);
            showAdminToast('Lỗi tải danh sách sách!', 'error');
        });
}

function renderBooksTable(books) {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;

    const badge = document.getElementById('adminBooksCountBadge');
    if (badge) badge.textContent = `${books ? books.length : 0} cuốn`;

    if (!books || books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Không tìm thấy cuốn sách nào</td></tr>`;
        const showingText = document.getElementById('booksShowingText');
        if (showingText) showingText.textContent = 'Hiển thị 0 cuốn sách';
        const pageControls = document.getElementById('booksPageControls');
        if (pageControls) pageControls.innerHTML = '';
        return;
    }

    const totalItems = books.length;
    const totalPages = Math.ceil(totalItems / booksPerPage) || 1;
    if (booksCurrentPage > totalPages) booksCurrentPage = 1;
    if (booksCurrentPage < 1) booksCurrentPage = 1;

    const startIdx = (booksCurrentPage - 1) * booksPerPage;
    const endIdx = Math.min(startIdx + booksPerPage, totalItems);
    const pagedBooks = books.slice(startIdx, endIdx);

    const showingText = document.getElementById('booksShowingText');
    if (showingText) {
        showingText.textContent = `Hiển thị ${startIdx + 1} - ${endIdx} trên tổng số ${totalItems} cuốn sách`;
    }

    renderBooksPaginationControls(totalPages);

    tbody.innerHTML = pagedBooks.map(b => {
        const thumb = b.imageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80';
        const isLowStock = b.stockQuantity <= 10;
        const isStopped = b.status === 'STOPPED';

        const toggleBtn = isStopped ? `
            <button class="btn-action view" onclick="toggleBookStatus(${b.id})" title="Mở bán lại cuốn sách này" style="background:#ecfdf5; color:#059669;">
                <i class="fas fa-play"></i>
            </button>
        ` : `
            <button class="btn-action warning" onclick="toggleBookStatus(${b.id})" title="Ngưng kinh doanh cuốn sách này">
                <i class="fas fa-ban"></i>
            </button>
        `;

        return `
            <tr>
                <td style="width: 60px;">
                    <img src="${thumb}" alt="${escapeHtml(b.title)}" class="table-book-thumb" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'">
                </td>
                <td>
                    <strong class="text-dark">${escapeHtml(b.title)}</strong><br>
                    <small class="text-muted"><i class="fas fa-barcode me-1"></i>${b.isbn || 'N/A'}</small>
                </td>
                <td>${escapeHtml(b.author || 'N/A')}</td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(b.categoryName || 'Chưa phân loại')}</span></td>
                <td>
                    <strong class="text-danger">${formatCurrency(b.salePrice)}</strong>
                    ${b.originalPrice && b.originalPrice > b.salePrice ? `<br><small class="text-muted text-decoration-line-through">${formatCurrency(b.originalPrice)}</small>` : ''}
                </td>
                <td>
                    <span class="fw-bold ${isLowStock ? 'text-danger' : 'text-success'}">
                        ${b.stockQuantity} ${isLowStock ? '<i class="fas fa-exclamation-triangle ms-1" title="Sắp hết hàng"></i>' : ''}
                    </span>
                </td>
                <td>${renderBookStatusBadge(b.status)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-action edit" onclick="openBookEditModal(${b.id})" title="Chỉnh sửa thông tin">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${toggleBtn}
                        <button class="btn-action delete" onclick="confirmDeleteBook(${b.id})" title="Xóa cuốn sách">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderBooksPaginationControls(totalPages) {
    const container = document.getElementById('booksPageControls');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button class="btn btn-sm btn-outline-secondary ${booksCurrentPage === 1 ? 'disabled' : ''}" 
            onclick="changeBooksPage(${booksCurrentPage - 1})" ${booksCurrentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= booksCurrentPage - 2 && p <= booksCurrentPage + 2)) {
            html += `
                <button class="btn btn-sm ${p === booksCurrentPage ? 'btn-primary fw-bold' : 'btn-outline-secondary'}" 
                    onclick="changeBooksPage(${p})" style="min-width: 32px;">
                    ${p}
                </button>
            `;
        } else if (p === booksCurrentPage - 3 || p === booksCurrentPage + 3) {
            html += `<span class="px-1 text-muted">...</span>`;
        }
    }

    html += `
        <button class="btn btn-sm btn-outline-secondary ${booksCurrentPage === totalPages ? 'disabled' : ''}" 
            onclick="changeBooksPage(${booksCurrentPage + 1})" ${booksCurrentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    container.innerHTML = html;
}

function changeBooksPage(page) {
    booksCurrentPage = page;
    renderBooksTable(allBooksData);
}

function openBookAddModal() {
    document.getElementById('bookModalTitle').textContent = 'Thêm Sách Mới';
    document.getElementById('bookForm').reset();
    document.getElementById('bookIdInput').value = '';
    loadCategoryOptionsForForm();
    openAdminModal('bookModal');
}

function openBookEditModal(bookId) {
    const book = allBooksData.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('bookModalTitle').textContent = 'Chỉnh Sửa Sách #' + book.id;
    document.getElementById('bookIdInput').value = book.id;
    document.getElementById('bookTitleInput').value = book.title || '';
    document.getElementById('bookAuthorInput').value = book.author || '';
    document.getElementById('bookPublisherInput').value = book.publisher || '';
    document.getElementById('bookYearInput').value = book.publicationYear || '';
    document.getElementById('bookPagesInput').value = book.pages || '';
    document.getElementById('bookIsbnInput').value = book.isbn || '';
    document.getElementById('bookOriginalPriceInput').value = book.originalPrice || '';
    document.getElementById('bookSalePriceInput').value = book.salePrice || '';
    document.getElementById('bookStockInput').value = book.stockQuantity || 0;
    document.getElementById('bookStatusInput').value = book.status || 'AVAILABLE';
    document.getElementById('bookImageInput').value = book.imageUrl || '';
    document.getElementById('bookDescInput').value = book.description || '';

    loadCategoryOptionsForForm(book.categoryId);
    openAdminModal('bookModal');
}

function handleSaveBook(e) {
    e.preventDefault();
    const id = document.getElementById('bookIdInput').value;
    const isEdit = !!id;

    const payload = {
        title: document.getElementById('bookTitleInput').value.trim(),
        author: document.getElementById('bookAuthorInput').value.trim(),
        publisher: document.getElementById('bookPublisherInput').value.trim(),
        publicationYear: parseInt(document.getElementById('bookYearInput').value) || null,
        pages: parseInt(document.getElementById('bookPagesInput').value) || null,
        isbn: document.getElementById('bookIsbnInput').value.trim(),
        categoryId: parseInt(document.getElementById('bookCategorySelect').value) || null,
        originalPrice: parseFloat(document.getElementById('bookOriginalPriceInput').value) || 0,
        salePrice: parseFloat(document.getElementById('bookSalePriceInput').value) || 0,
        stockQuantity: parseInt(document.getElementById('bookStockInput').value) || 0,
        status: document.getElementById('bookStatusInput').value,
        imageUrl: document.getElementById('bookImageInput').value.trim(),
        description: document.getElementById('bookDescInput').value.trim()
    };

    const url = isEdit ? '/api/admin/books/' + id : '/api/admin/books';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error('Không thể lưu sách');
            return res.json();
        })
        .then(() => {
            closeAdminModal('bookModal');
            showAdminToast(isEdit ? 'Cập nhật sách thành công!' : 'Thêm sách mới thành công!', 'success');
            loadBooks();
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function toggleBookStatus(bookId) {
    const book = allBooksData.find(b => b.id === bookId);
    const isCurrentlyStopped = book && book.status === 'STOPPED';
    const targetStatus = isCurrentlyStopped ? 'AVAILABLE' : 'STOPPED';
    const actionName = isCurrentlyStopped ? 'mở bán lại' : 'ngưng kinh doanh';

    fetch(`/api/admin/books/${bookId}/status?status=${targetStatus}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (!res.ok) throw new Error('Không thể cập nhật trạng thái sách');
            return res.json();
        })
        .then(() => {
            showAdminToast(`Đã ${actionName} sách "${book ? book.title : '#' + bookId}" thành công!`, 'success');
            loadBooks();
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        })
        .catch(err => {
            showAdminToast('Lỗi cập nhật trạng thái: ' + err.message, 'error');
        });
}

let bookToDeleteId = null;

function confirmDeleteBook(bookId) {
    const book = allBooksData.find(b => b.id === bookId);
    bookToDeleteId = bookId;

    const titleEl = document.getElementById('deleteBookTitleDisplay');
    const idEl = document.getElementById('deleteBookIdDisplay');

    if (titleEl) titleEl.textContent = book ? book.title : 'Cuốn sách #' + bookId;
    if (idEl) idEl.textContent = '#' + bookId;

    openAdminModal('deleteBookModal');
}

function executeDeleteBook() {
    if (!bookToDeleteId) return;

    const btn = document.getElementById('btnConfirmDeleteBook');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    }

    fetch(`/api/admin/books/${bookToDeleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            closeAdminModal('deleteBookModal');
            if (data.warning) {
                showAdminToast(data.message, 'info');
            } else if (data.success) {
                showAdminToast(data.message || 'Đã xóa sách thành công!', 'success');
            } else {
                showAdminToast(data.message || 'Không thể xóa cuốn sách này!', 'error');
            }
            loadBooks();
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        })
        .catch(err => {
            showAdminToast('Lỗi khi xóa sách: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-trash-alt"></i> Xóa Vĩnh Viễn';
            }
            bookToDeleteId = null;
        });
}

function deleteBook(bookId) {
    confirmDeleteBook(bookId);
}

// =====================================================
// 3. ORDER MANAGEMENT
// =====================================================
function loadOrders() {
    const status = document.getElementById('orderStatusFilter')?.value || '';
    const search = document.getElementById('orderSearchInput')?.value || '';

    let url = '/api/admin/orders?';
    if (status) url += 'status=' + encodeURIComponent(status) + '&';
    if (search) url += 'search=' + encodeURIComponent(search) + '&';

    fetch(url)
        .then(res => res.json())
        .then(orders => {
            allOrdersData = orders;
            renderOrdersTable(orders);
        })
        .catch(err => {
            console.error('Error loading orders:', err);
            showAdminToast('Lỗi tải danh sách đơn hàng!', 'error');
        });
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy đơn hàng nào</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong>#${o.trackingNumber || o.id}</strong></td>
            <td>
                <strong>${escapeHtml(o.receiverName || 'Khách hàng')}</strong><br>
                <small class="text-muted">${escapeHtml(o.receiverPhone || '')}</small>
            </td>
            <td><small class="text-muted">${formatDateTime(o.createdAt)}</small></td>
            <td>
                <span class="badge ${o.paymentMethod === 'BANK_TRANSFER' ? 'bg-info' : 'bg-secondary'}">
                    ${o.paymentMethod || 'COD'}
                </span>
            </td>
            <td><strong class="text-primary">${formatCurrency(o.totalAmount)}</strong></td>
            <td>${renderOrderStatusBadge(o.status)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action view" onclick="openOrderDetailModal(${o.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action view text-success" onclick="window.open('/api/orders/' + ${o.id} + '/invoice/print', '_blank')" title="In Hóa Đơn Điện Tử">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </button>
                    <select class="form-select form-select-sm fs-8 py-1" style="width: 130px;" onchange="updateOrderStatus(${o.id}, this.value)">
                        <option value="PENDING" ${o.status === 'PENDING' ? 'selected' : ''}>Chờ duyệt</option>
                        <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>Đã duyệt</option>
                        <option value="SHIPPING" ${o.status === 'SHIPPING' ? 'selected' : ''}>Đang giao</option>
                        <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>Đã giao</option>
                        <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>Hủy đơn</option>
                    </select>
                </div>
            </td>
        </tr>
    `).join('');
}

let currentAdminDetailOrderId = null;

function printCurrentAdminOrderInvoice() {
    if (currentAdminDetailOrderId) {
        window.open('/api/orders/' + currentAdminDetailOrderId + '/invoice/print', '_blank');
    }
}

function updateOrderStatus(orderId, newStatus) {
    fetch('/api/admin/orders/' + orderId + '/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
        .then(res => {
            if (!res.ok) throw new Error('Không thể cập nhật trạng thái đơn');
            return res.json();
        })
        .then(() => {
            showAdminToast('Cập nhật trạng thái đơn hàng #' + orderId + ' thành công!', 'success');
            loadOrders();
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function openOrderDetailModal(orderId) {
    currentAdminDetailOrderId = orderId;
    fetch('/api/admin/orders/' + orderId)
        .then(res => res.json())
        .then(order => {
            document.getElementById('detailOrderTracking').textContent = '#' + (order.trackingNumber || order.id);
            document.getElementById('detailReceiverName').textContent = order.receiverName || 'N/A';
            document.getElementById('detailReceiverPhone').textContent = order.receiverPhone || 'N/A';
            document.getElementById('detailShippingAddress').textContent = order.shippingAddress || 'N/A';
            document.getElementById('detailPaymentMethod').textContent = order.paymentMethod || 'COD';
            document.getElementById('detailPaymentStatus').textContent = order.paymentStatus || 'CHƯA THANH TOÁN';
            document.getElementById('detailOrderDate').textContent = formatDateTime(order.createdAt);
            document.getElementById('detailOrderStatus').innerHTML = renderOrderStatusBadge(order.status);
            document.getElementById('detailSubtotal').textContent = formatCurrency(order.subtotal);
            document.getElementById('detailShippingFee').textContent = formatCurrency(order.shippingFee);
            document.getElementById('detailTotalAmount').textContent = formatCurrency(order.totalAmount);

            const itemsTbody = document.getElementById('detailOrderItemsBody') || document.getElementById('detailItemsTableBody');
            if (itemsTbody) {
                if (!order.items || order.items.length === 0) {
                    itemsTbody.innerHTML = `<tr><td colspan="4" class="text-center py-2 text-muted">Không có dữ liệu sản phẩm</td></tr>`;
                } else {
                    itemsTbody.innerHTML = order.items.map(item => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <img src="${item.bookImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80'}" width="36" height="50" class="rounded object-fit-cover">
                                    <strong>${escapeHtml(item.bookTitle)}</strong>
                                </div>
                            </td>
                            <td>${formatCurrency(item.unitPrice)}</td>
                            <td>x${item.quantity}</td>
                            <td><strong class="text-primary">${formatCurrency(item.subtotal)}</strong></td>
                        </tr>
                    `).join('');
                }
            }

            openAdminModal('orderDetailModal');
        })
        .catch(err => {
            showAdminToast('Lỗi tải chi tiết đơn: ' + err.message, 'error');
        });
}

// =====================================================
// 4. CATEGORY MANAGEMENT
// =====================================================
function loadCategories() {
    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(categories => {
            allCategoriesData = categories;
            renderCategoriesTable(categories);
        })
        .catch(err => {
            console.error('Error loading categories:', err);
        });
}

function renderCategoriesTable(categories) {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    const badge = document.getElementById('adminCategoriesCountBadge');
    if (badge) badge.textContent = `${categories ? categories.length : 0} thể loại`;

    if (!categories || categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có danh mục nào</td></tr>`;
        return;
    }

    tbody.innerHTML = categories.map((cat, index) => `
        <tr>
            <td><strong class="text-muted">${index + 1}</strong></td>
            <td><span class="badge bg-light text-primary border">#${cat.id}</span></td>
            <td><strong class="text-dark">${escapeHtml(cat.name)}</strong></td>
            <td><code class="text-secondary">${escapeHtml(cat.slug)}</code></td>
            <td>
                <div class="table-actions">
                    <button class="btn-action delete" onclick="deleteCategory(${cat.id})" title="Xóa thể loại này">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openCategoryAddModal() {
    document.getElementById('categoryNameInput').value = '';
    openAdminModal('categoryModal');
}

function handleSaveCategory(e) {
    e.preventDefault();
    const name = document.getElementById('categoryNameInput').value.trim();
    if (!name) return;

    fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(res => {
            if (!res.ok) throw new Error('Không thể thêm thể loại');
            return res.json();
        })
        .then(() => {
            closeAdminModal('categoryModal');
            showAdminToast('Thêm thể loại thành công!', 'success');
            loadCategories();
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function deleteCategory(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa thể loại này?')) return;
    fetch('/api/admin/categories/' + id, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Không thể xóa thể loại');
            showAdminToast('Đã xóa thể loại!', 'success');
            loadCategories();
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

// =====================================================
// 5. USER MANAGEMENT
// =====================================================
function formatAdminDateTime(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN');
    } catch (e) {
        return dateStr;
    }
}

function loadUsers() {
    fetch('/api/admin/users')
        .then(res => res.json())
        .then(users => {
            allUsersData = users || [];
            updateDeleteRequestBadges();
            filterUsers();
        })
        .catch(err => {
            console.error('Error loading users:', err);
            showAdminToast('Lỗi tải danh sách người dùng!', 'error');
        });
}

function updateDeleteRequestBadges() {
    const deleteRequests = (allUsersData || []).filter(u => u.deleteRequested === true);
    const count = deleteRequests.length;

    const sidebarBadge = document.getElementById('sidebarUserDeleteBadge');
    if (sidebarBadge) {
        if (count > 0) {
            sidebarBadge.textContent = `${count} yêu cầu`;
            sidebarBadge.classList.remove('d-none');
        } else {
            sidebarBadge.classList.add('d-none');
        }
    }

    const alertBanner = document.getElementById('userDeleteAlertBanner');
    const alertCountText = document.getElementById('deleteRequestCountText');
    if (alertBanner && alertCountText) {
        if (count > 0) {
            alertCountText.textContent = count;
            alertBanner.classList.remove('d-none');
        } else {
            alertBanner.classList.add('d-none');
        }
    }
}

function filterOnlyDeleteRequests() {
    const select = document.getElementById('userRoleFilter');
    if (select) {
        select.value = 'DELETE_REQUESTED';
        filterUsers();
    }
}

function filterUsers() {
    const search = document.getElementById('userSearchInput')?.value.trim().toLowerCase() || '';
    const roleFilter = document.getElementById('userRoleFilter')?.value || '';

    let filtered = allUsersData.filter(u => {
        const matchesSearch = !search ||
            (u.fullName && u.fullName.toLowerCase().includes(search)) ||
            (u.email && u.email.toLowerCase().includes(search)) ||
            (u.phone && u.phone.includes(search));

        let matchesRole = true;
        if (roleFilter === 'DELETE_REQUESTED') {
            matchesRole = u.deleteRequested === true;
        } else if (roleFilter) {
            const userRoles = u.roles || [];
            matchesRole = userRoles.includes(roleFilter);
        }

        return matchesSearch && matchesRole;
    });

    renderUsersTable(filtered);
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const badge = document.getElementById('adminUsersCountBadge');
    if (badge) badge.textContent = `${users ? users.length : 0} tài khoản`;

    if (!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy tài khoản nào</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map((u, index) => {
        const roles = u.roles || [];
        let roleBadge = '<span class="badge bg-secondary">Khách Hàng</span>';
        if (roles.includes('ROLE_ADMIN')) {
            roleBadge = '<span class="badge bg-danger shadow-sm"><i class="fas fa-shield-alt me-1"></i> Quản Trị Viên</span>';
        } else if (roles.includes('ROLE_STAFF')) {
            roleBadge = '<span class="badge bg-info text-dark shadow-sm"><i class="fas fa-user-tie me-1"></i> Nhân Viên</span>';
        }

        const isSelf = currentAdminUser && currentAdminUser.id === u.id;
        const isDeleteRequested = u.deleteRequested === true;

        let actionBtn = '';
        if (isSelf) {
            actionBtn = `
                <span class="badge bg-light text-muted border py-1.5 px-2">
                    <i class="fas fa-user-shield me-1 text-primary"></i> Chính bạn
                </span>
            `;
        } else if (isDeleteRequested) {
            actionBtn = `
                <div class="d-flex align-items-center gap-1">
                    <button class="btn btn-sm btn-danger rounded-pill px-2.5 py-1 fs-8 fw-bold shadow-sm" onclick="confirmDeleteUser(${u.id})" title="Duyệt và xóa vĩnh viễn tài khoản này">
                        <i class="fas fa-trash-alt me-1"></i> Duyệt Xóa
                    </button>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1 fs-8" onclick="rejectDeleteRequest(${u.id})" title="Bác bỏ / Hủy yêu cầu xóa">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        } else {
            actionBtn = `
                <button class="btn-action delete" onclick="confirmDeleteUser(${u.id})" title="Xóa hoàn toàn tài khoản này">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
        }

        const rowBgStyle = isDeleteRequested ? 'background-color: #fff8f8;' : '';

        return `
            <tr style="${rowBgStyle}">
                <td><strong class="text-muted">${index + 1}</strong></td>
                <td><span class="badge bg-light text-primary border">#${u.id}</span></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img src="${u.avatarUrl || 'images/book_ai.png'}" width="36" height="36" class="rounded-circle object-fit-cover border">
                        <div>
                            <div class="d-flex align-items-center gap-1.5 flex-wrap">
                                <strong class="text-dark">${escapeHtml(u.fullName || 'Chưa cập nhật')}</strong>
                                ${isDeleteRequested ? `
                                    <span class="badge bg-danger text-white rounded-pill px-2 py-0.5" style="font-size: 0.65rem;">
                                        <i class="fas fa-exclamation-circle me-0.5"></i> Yêu cầu xóa
                                    </span>
                                ` : ''}
                            </div>
                            <small class="text-muted">${escapeHtml(u.email)}</small>
                            ${isDeleteRequested ? `
                                <div class="mt-1 p-1.5 rounded-2 bg-danger bg-opacity-10 border border-danger-subtle text-danger" style="font-size: 0.73rem; max-width: 280px;">
                                    <div><i class="fas fa-comment-dots me-1"></i><strong>Lý do:</strong> ${escapeHtml(u.deleteRequestReason || 'Khách hàng gửi yêu cầu xóa')}</div>
                                    ${u.deleteRequestedAt ? `<div class="text-muted fs-8 mt-0.5"><i class="fas fa-clock me-1"></i>${formatAdminDateTime(u.deleteRequestedAt)}</div>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(u.phone || 'Chưa có')}</td>
                <td>${roleBadge}</td>
                <td>
                    <span class="badge bg-light text-dark border">
                        <i class="fas fa-shopping-bag me-1 text-primary"></i>${u.totalOrders || 0} đơn
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        ${actionBtn}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function rejectDeleteRequest(userId) {
    const user = allUsersData.find(u => u.id === userId);
    const userName = user ? user.fullName : '#' + userId;
    if (!confirm(`Bạn có chắc chắn muốn từ chối / hủy yêu cầu xóa tài khoản của "${userName}" không?`)) return;

    fetch(`/api/admin/users/${userId}/reject-delete-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Đã hủy yêu cầu xóa tài khoản!', 'success');
                loadUsers();
            } else {
                showAdminToast(result.message || 'Thao tác thất bại!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function openAdminAddModal() {
    document.getElementById('adminUserNameInput').value = '';
    document.getElementById('adminUserEmailInput').value = '';
    document.getElementById('adminUserPhoneInput').value = '';
    document.getElementById('adminUserPasswordInput').value = '123456';
    openAdminModal('adminUserModal');
}

function openUserAddModal() {
    openAdminAddModal();
}

function handleSaveAdminUser(e) {
    e.preventDefault();
    const fullName = document.getElementById('adminUserNameInput').value.trim();
    const email = document.getElementById('adminUserEmailInput').value.trim();
    const phone = document.getElementById('adminUserPhoneInput').value.trim();
    const password = document.getElementById('adminUserPasswordInput').value.trim();

    if (!fullName || !email || !password) {
        showAdminToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
        return;
    }

    const payload = { fullName, email, phone, password };

    fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(result => {
            if (!result.ok || !result.data.success) {
                throw new Error(result.data.message || 'Không thể tạo tài khoản Admin');
            }
            closeAdminModal('adminUserModal');
            showAdminToast(result.data.message || 'Tạo tài khoản Admin thành công!', 'success');
            loadUsers();
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function handleSaveUser(e) {
    handleSaveAdminUser(e);
}

let userToDeleteId = null;

function confirmDeleteUser(userId) {
    const user = allUsersData.find(u => u.id === userId);
    userToDeleteId = userId;

    const nameEl = document.getElementById('deleteUserNameDisplay');
    const emailEl = document.getElementById('deleteUserEmailDisplay');
    const idEl = document.getElementById('deleteUserIdDisplay');

    if (nameEl) nameEl.textContent = user ? user.fullName : 'Người dùng #' + userId;
    if (emailEl) emailEl.textContent = user ? user.email : 'N/A';
    if (idEl) idEl.textContent = '#' + userId;

    openAdminModal('deleteUserModal');
}

function executeDeleteUser() {
    if (!userToDeleteId) return;

    const btn = document.getElementById('btnConfirmDeleteUser');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    }

    fetch('/api/admin/users/' + userToDeleteId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(result => {
            closeAdminModal('deleteUserModal');
            if (result.data && result.data.success) {
                showAdminToast(result.data.message || 'Đã xóa hoàn toàn tài khoản!', 'success');
            } else {
                showAdminToast(result.data?.message || 'Không thể xóa tài khoản này!', 'error');
            }
            loadUsers();
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        })
        .catch(err => {
            showAdminToast('Lỗi khi xóa tài khoản: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-trash-alt"></i> Xóa Vĩnh Viễn';
            }
            userToDeleteId = null;
        });
}

// =====================================================
// 6. PROMOTIONS & DISCOUNT MANAGEMENT
// =====================================================
let allCouponsData = [];
let couponToDeleteId = null;

function loadCoupons() {
    fetch('/api/admin/coupons')
        .then(res => res.json())
        .then(coupons => {
            allCouponsData = coupons || [];
            const badge = document.getElementById('adminCouponsCountBadge');
            if (badge) badge.textContent = `${allCouponsData.length} mã`;
            filterCoupons();
        })
        .catch(err => {
            console.error('Error loading coupons:', err);
            showAdminToast('Lỗi tải danh sách mã khuyến mãi!', 'error');
        });
}

function filterCoupons() {
    const search = document.getElementById('couponSearchInput')?.value.trim().toLowerCase() || '';
    const statusFilter = document.getElementById('couponStatusFilter')?.value || '';

    let filtered = allCouponsData.filter(c => {
        const matchesSearch = !search ||
            (c.code && c.code.toLowerCase().includes(search)) ||
            (c.title && c.title.toLowerCase().includes(search)) ||
            (c.description && c.description.toLowerCase().includes(search));

        let matchesStatus = true;
        if (statusFilter === 'ACTIVE') matchesStatus = c.isActive === true;
        if (statusFilter === 'INACTIVE') matchesStatus = c.isActive === false;

        return matchesSearch && matchesStatus;
    });

    renderCouponsTable(filtered);
}

function renderCouponsTable(coupons) {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;

    if (!coupons || coupons.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy mã voucher nào</td></tr>`;
        return;
    }

    tbody.innerHTML = coupons.map((c, index) => {
        const isPercent = c.discountType === 'PERCENT';
        const discountText = isPercent ? `<strong>${c.discountValue}%</strong>` : `<strong>${formatCurrency(c.discountValue)}</strong>`;
        const minOrderText = c.minOrderAmount && c.minOrderAmount > 0 ? `Đơn từ ${formatCurrency(c.minOrderAmount)}` : 'Mọi đơn hàng';
        const maxDiscountText = isPercent && c.maxDiscountAmount ? `<br><small class="text-muted">Tối đa ${formatCurrency(c.maxDiscountAmount)}</small>` : '';

        let scopeText = '<span class="badge bg-secondary-subtle text-secondary fs-9">Toàn đơn</span>';
        if (c.applicableType === 'CATEGORY') {
            scopeText = `<span class="badge bg-info-subtle text-info fs-9">📁 ${escapeHtml(c.applicableCategoryName || 'Danh mục')}</span>`;
        } else if (c.applicableType === 'BOOK') {
            scopeText = `<span class="badge bg-warning-subtle text-dark fs-9 text-truncate" style="max-width: 150px;" title="${escapeHtml(c.applicableBookTitle || 'Sách cụ thể')}">📖 ${escapeHtml(c.applicableBookTitle || 'Sách cụ thể')}</span>`;
        }

        const badgeColor = c.badgeColor || 'danger';
        const badgeTag = `<span class="badge bg-${badgeColor} text-white fs-9 me-1">${escapeHtml(c.badgeText || 'ƯU ĐÃI')}</span>`;

        const statusSwitch = `
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" role="switch" ${c.isActive ? 'checked' : ''} onchange="toggleCouponActive(${c.id})">
                <label class="form-check-label fs-8 ${c.isActive ? 'text-success fw-bold' : 'text-muted'}">
                    ${c.isActive ? 'Đang chạy' : 'Tạm dừng'}
                </label>
            </div>
        `;

        return `
            <tr>
                <td><strong class="text-muted">${index + 1}</strong></td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold fs-7 font-monospace px-2.5 py-1">
                        ${escapeHtml(c.code)}
                    </span>
                </td>
                <td>
                    <div>
                        ${badgeTag}
                        <strong class="text-dark fs-8">${escapeHtml(c.title)}</strong>
                        ${c.description ? `<div class="text-muted fs-9 mt-0.5">${escapeHtml(c.description)}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div class="text-danger fs-7">${discountText}</div>
                    <small class="text-muted fs-9">${isPercent ? 'Giảm theo %' : 'Giảm tiền mặt'}</small>
                </td>
                <td>
                    <div class="fs-8 text-dark">${minOrderText}</div>
                    ${maxDiscountText}
                    <div class="mt-1">${scopeText}</div>
                </td>
                <td>${statusSwitch}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-action edit" onclick="openCouponModal(${c.id})" title="Chỉnh sửa voucher">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete" onclick="confirmDeleteCoupon(${c.id})" title="Xóa voucher">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadCategoriesForCouponModal() {
    const select = document.getElementById('couponCategorySelect');
    if (!select) return;
    fetch('/api/admin/categories')
        .then(r => r.json())
        .then(cats => {
            select.innerHTML = '<option value="">-- Chọn danh mục --</option>' +
                cats.map(c => `<option value="${c.id}" data-name="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
        })
        .catch(err => console.warn('Could not load categories for coupon modal:', err));
}

function loadBooksForCouponModal() {
    const select = document.getElementById('couponBookSelect');
    if (!select) return;
    fetch('/api/admin/books')
        .then(r => r.json())
        .then(books => {
            select.innerHTML = '<option value="">-- Chọn cuốn sách --</option>' +
                books.map(b => `<option value="${b.id}" data-title="${escapeHtml(b.title)}">[#${b.id}] ${escapeHtml(b.title)}</option>`).join('');
        })
        .catch(err => console.warn('Could not load books for coupon modal:', err));
}

function openCouponModal(couponId = null) {
    const isEdit = !!couponId;
    const titleEl = document.getElementById('couponModalTitle');
    const form = document.getElementById('couponForm');
    if (form) form.reset();

    loadCategoriesForCouponModal();
    loadBooksForCouponModal();

    document.getElementById('couponIdInput').value = couponId || '';

    if (isEdit) {
        const coupon = allCouponsData.find(c => c.id === couponId);
        if (!coupon) return;

        if (titleEl) titleEl.textContent = 'Chỉnh Sửa Mã Voucher: ' + coupon.code;
        document.getElementById('couponCodeInput').value = coupon.code || '';
        document.getElementById('couponTitleInput').value = coupon.title || '';
        document.getElementById('couponTypeSelect').value = coupon.discountType || 'PERCENT';
        document.getElementById('couponValueInput').value = coupon.discountValue || '';
        document.getElementById('couponMinOrderInput').value = coupon.minOrderAmount || '';
        document.getElementById('couponMaxDiscountInput').value = coupon.maxDiscountAmount || '';
        document.getElementById('couponBadgeTextInput').value = coupon.badgeText || 'HOT 🔥';
        document.getElementById('couponBadgeColorSelect').value = coupon.badgeColor || 'danger';
        document.getElementById('couponScopeSelect').value = coupon.applicableType || 'ALL';
        setTimeout(() => {
            if (coupon.applicableCategoryId && document.getElementById('couponCategorySelect')) {
                document.getElementById('couponCategorySelect').value = coupon.applicableCategoryId;
            }
            if (coupon.applicableBookId && document.getElementById('couponBookSelect')) {
                document.getElementById('couponBookSelect').value = coupon.applicableBookId;
            }
        }, 300);
        document.getElementById('couponDescInput').value = coupon.description || '';
        document.getElementById('couponActiveCheck').checked = coupon.isActive !== false;
    } else {
        if (titleEl) titleEl.textContent = 'Thêm Mã Voucher Mới';
        document.getElementById('couponCodeInput').value = '';
        document.getElementById('couponTitleInput').value = '';
        document.getElementById('couponTypeSelect').value = 'PERCENT';
        document.getElementById('couponValueInput').value = '10';
        document.getElementById('couponMinOrderInput').value = '0';
        document.getElementById('couponMaxDiscountInput').value = '50000';
        document.getElementById('couponBadgeTextInput').value = 'HOT 🔥';
        document.getElementById('couponBadgeColorSelect').value = 'danger';
        document.getElementById('couponScopeSelect').value = 'ALL';
        document.getElementById('couponDescInput').value = 'Áp dụng cho mọi giá trị đơn hàng';
        document.getElementById('couponActiveCheck').checked = true;
    }

    handleCouponTypeChange();
    if (typeof handleCouponScopeChange === 'function') handleCouponScopeChange();
    updateCouponPreview();
    openAdminModal('couponModal');
}

function handleCouponTypeChange() {
    const type = document.getElementById('couponTypeSelect')?.value;
    const valLabel = document.getElementById('couponValueLabel');
    const maxCol = document.getElementById('couponMaxDiscountCol');

    if (type === 'PERCENT') {
        if (valLabel) valLabel.textContent = 'Mức Giảm (%) *';
        if (maxCol) maxCol.classList.remove('d-none');
    } else {
        if (valLabel) valLabel.textContent = 'Số Tiền Giảm (₫) *';
        if (maxCol) maxCol.classList.add('d-none');
    }
    updateCouponPreview();
}

function updateCouponPreview() {
    const code = document.getElementById('couponCodeInput')?.value.trim().toUpperCase() || 'CODE';
    const title = document.getElementById('couponTitleInput')?.value.trim() || 'Tên chương trình ưu đãi';
    const badgeText = document.getElementById('couponBadgeTextInput')?.value.trim() || 'HOT 🔥';
    const badgeColor = document.getElementById('couponBadgeColorSelect')?.value || 'danger';
    const desc = document.getElementById('couponDescInput')?.value.trim() || 'Mô tả điều kiện áp dụng';

    const pCode = document.getElementById('previewCouponCode');
    const pTitle = document.getElementById('previewCouponTitle');
    const pBadge = document.getElementById('previewCouponBadge');
    const pDesc = document.getElementById('previewCouponDesc');

    if (pCode) pCode.textContent = code;
    if (pTitle) pTitle.textContent = title;
    if (pBadge) {
        pBadge.textContent = badgeText;
        pBadge.className = `badge bg-${badgeColor} text-white fs-9`;
    }
    if (pDesc) pDesc.textContent = desc;
}

function handleSaveCoupon(e) {
    if (e && e.preventDefault) e.preventDefault();
    const id = document.getElementById('couponIdInput')?.value;
    const isEdit = !!id;

    const code = document.getElementById('couponCodeInput')?.value.trim().toUpperCase();
    const title = document.getElementById('couponTitleInput')?.value.trim();

    if (!code) {
        showAdminToast('Vui lòng nhập mã Code voucher (ví dụ: AI10)!', 'error');
        return;
    }
    if (!title) {
        showAdminToast('Vui lòng nhập tiêu đề voucher!', 'error');
        return;
    }

    const discountType = document.getElementById('couponTypeSelect')?.value || 'PERCENT';
    const discountValue = parseFloat(document.getElementById('couponValueInput')?.value) || 0;

    if (discountValue <= 0) {
        showAdminToast('Mức giảm giá phải lớn hơn 0!', 'error');
        return;
    }

    if (discountType === 'PERCENT' && discountValue > 100) {
        showAdminToast('Phần trăm giảm giá không được vượt quá 100%!', 'error');
        return;
    }

    const scope = document.getElementById('couponScopeSelect')?.value || 'ALL';
    const catSelect = document.getElementById('couponCategorySelect');
    const bookSelect = document.getElementById('couponBookSelect');

    let applicableCategoryId = null;
    let applicableCategoryName = null;
    if (scope === 'CATEGORY') {
        if (!catSelect || !catSelect.value) {
            showAdminToast('Vui lòng chọn danh mục áp dụng voucher!', 'error');
            return;
        }
        applicableCategoryId = parseInt(catSelect.value);
        applicableCategoryName = catSelect.options[catSelect.selectedIndex]?.text || '';
    }

    let applicableBookId = null;
    let applicableBookTitle = null;
    if (scope === 'BOOK') {
        if (!bookSelect || !bookSelect.value) {
            showAdminToast('Vui lòng chọn cuốn sách áp dụng voucher!', 'error');
            return;
        }
        applicableBookId = parseInt(bookSelect.value);
        applicableBookTitle = bookSelect.options[bookSelect.selectedIndex]?.text || '';
    }

    const badgeText = document.getElementById('couponBadgeTextInput')?.value.trim() || 'HOT 🔥';
    const badgeColor = document.getElementById('couponBadgeColorSelect')?.value || 'danger';
    const description = document.getElementById('couponDescInput')?.value.trim() || '';
    const minOrderAmount = parseFloat(document.getElementById('couponMinOrderInput')?.value) || 0;
    const maxDiscountAmount = parseFloat(document.getElementById('couponMaxDiscountInput')?.value) || null;
    const isActive = document.getElementById('couponActiveCheck') ? document.getElementById('couponActiveCheck').checked : true;

    const payload = {
        code: code,
        title: title,
        discountType: discountType,
        discountValue: discountValue,
        minOrderAmount: minOrderAmount,
        maxDiscountAmount: maxDiscountAmount,
        badgeText: badgeText,
        badgeColor: badgeColor,
        applicableType: scope,
        applicableCategoryId: applicableCategoryId,
        applicableCategoryName: applicableCategoryName,
        applicableBookId: applicableBookId,
        applicableBookTitle: applicableBookTitle,
        description: description,
        isActive: isActive
    };

    const url = isEdit ? '/api/admin/coupons/' + id : '/api/admin/coupons';
    const method = isEdit ? 'PUT' : 'POST';

    const btn = document.getElementById('btnSaveCoupon');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang lưu...';
    }

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                closeAdminModal('couponModal');
                showAdminToast(result.message || 'Lưu mã khuyến mãi thành công!', 'success');
                loadCoupons();
            } else {
                showAdminToast(result.message || 'Lỗi lưu voucher!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi kết nối: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-save me-1"></i> Lưu Voucher';
            }
        });
}

function toggleCouponActive(couponId) {
    fetch(`/api/admin/coupons/${couponId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Đã cập nhật trạng thái voucher!', 'success');
                loadCoupons();
            } else {
                showAdminToast(result.message || 'Thao tác thất bại!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        });
}

function confirmDeleteCoupon(couponId) {
    const coupon = allCouponsData.find(c => c.id === couponId);
    couponToDeleteId = couponId;

    const titleEl = document.getElementById('deleteCouponTitleDisplay');
    const codeEl = document.getElementById('deleteCouponCodeDisplay');

    if (titleEl) titleEl.textContent = coupon ? coupon.title : 'Voucher #' + couponId;
    if (codeEl) codeEl.textContent = coupon ? coupon.code : 'CODE';

    openAdminModal('deleteCouponModal');
}

function executeDeleteCoupon() {
    if (!couponToDeleteId) return;

    const btn = document.getElementById('btnConfirmDeleteCoupon');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    }

    fetch('/api/admin/coupons/' + couponToDeleteId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(result => {
            closeAdminModal('deleteCouponModal');
            if (result.success) {
                showAdminToast(result.message || 'Đã xóa mã voucher thành công!', 'success');
                loadCoupons();
            } else {
                showAdminToast(result.message || 'Không thể xóa voucher!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi khi xóa voucher: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-trash-alt"></i> Xóa Voucher';
            }
            couponToDeleteId = null;
        });
}

// =====================================================
// INDIVIDUAL BOOK DISCOUNT
// =====================================================
let selectedSingleDiscountBook = null;

function loadBooksForSingleDiscount() {
    const select = document.getElementById('singleDiscountBookSelect');
    if (!select) return;

    fetch('/api/admin/books')
        .then(res => res.json())
        .then(books => {
            allBooksData = books || [];
            select.innerHTML = '<option value="">-- Chọn cuốn sách từ kho (' + allBooksData.length + ' cuốn) --</option>' +
                allBooksData.map(b => {
                    const priceStr = formatCurrency(b.salePrice);
                    const origStr = b.originalPrice && b.originalPrice > b.salePrice ? ` (Gốc: ${formatCurrency(b.originalPrice)})` : '';
                    return `<option value="${b.id}">[#${b.id}] ${escapeHtml(b.title)} - ${priceStr}${origStr}</option>`;
                }).join('');

            if (selectedSingleDiscountBook) {
                const refreshed = allBooksData.find(b => b.id === selectedSingleDiscountBook.id);
                if (refreshed) {
                    selectedSingleDiscountBook = refreshed;
                }
                select.value = selectedSingleDiscountBook.id;
                onSelectBookForSingleDiscount();
            }
        })
        .catch(err => console.warn('Cannot load books for single discount:', err));
}

function onSelectBookForSingleDiscount() {
    const select = document.getElementById('singleDiscountBookSelect');
    const detailBox = document.getElementById('singleBookDiscountDetail');
    if (!select || !detailBox) return;

    const bookId = parseInt(select.value);
    if (!bookId) {
        selectedSingleDiscountBook = null;
        detailBox.classList.add('d-none');
        return;
    }

    const book = allBooksData.find(b => b.id === bookId);
    if (!book) {
        detailBox.classList.add('d-none');
        return;
    }

    selectedSingleDiscountBook = book;
    detailBox.classList.remove('d-none');

    // Display fields
    const coverEl = document.getElementById('singleBookCoverPreview');
    const titleEl = document.getElementById('singleBookTitleDisplay');
    const catEl = document.getElementById('singleBookCategoryDisplay');
    const origEl = document.getElementById('singleBookOriginalPriceDisplay');
    const saleEl = document.getElementById('singleBookSalePriceDisplay');
    const badgeEl = document.getElementById('singleBookCurrentBadge');

    if (coverEl) coverEl.src = book.imageUrl || (book.images && book.images[0] ? book.images[0].imageUrl : '/images/book_ai.png');
    if (titleEl) titleEl.textContent = book.title;
    if (catEl) catEl.textContent = 'Thể loại: ' + (book.categoryName || 'Sách');

    const basePrice = book.originalPrice && book.originalPrice > 0 ? book.originalPrice : book.salePrice;
    if (origEl) origEl.textContent = formatCurrency(basePrice);
    if (saleEl) saleEl.textContent = formatCurrency(book.salePrice);

    let currentDiscountPct = 0;
    if (basePrice && basePrice > book.salePrice) {
        currentDiscountPct = Math.round((basePrice - book.salePrice) / basePrice * 100);
    }
    if (badgeEl) {
        if (currentDiscountPct > 0) {
            badgeEl.textContent = `-${currentDiscountPct}%`;
            badgeEl.classList.remove('d-none');
        } else {
            badgeEl.classList.add('d-none');
        }
    }

    // Reset inputs
    document.getElementById('singleDiscountPercentInput').value = currentDiscountPct > 0 ? currentDiscountPct : '';
    document.getElementById('singleDiscountCustomPriceInput').value = book.salePrice;
}

function calculateSingleBookNewPrice(source) {
    if (!selectedSingleDiscountBook) return;
    const basePrice = selectedSingleDiscountBook.originalPrice && selectedSingleDiscountBook.originalPrice > 0
        ? selectedSingleDiscountBook.originalPrice
        : selectedSingleDiscountBook.salePrice;

    const pctInput = document.getElementById('singleDiscountPercentInput');
    const priceInput = document.getElementById('singleDiscountCustomPriceInput');

    if (source === 'percent') {
        const pct = parseFloat(pctInput.value) || 0;
        if (pct >= 0 && pct <= 90) {
            const newPrice = Math.round(basePrice * (1 - pct / 100));
            priceInput.value = newPrice;
        }
    } else if (source === 'price') {
        const customPrice = parseFloat(priceInput.value) || 0;
        if (customPrice > 0 && basePrice > 0) {
            const calcPct = Math.max(0, Math.round((basePrice - customPrice) / basePrice * 100));
            pctInput.value = calcPct;
        }
    }
}

function setQuickSingleDiscount(percent) {
    const input = document.getElementById('singleDiscountPercentInput');
    if (input) {
        input.value = percent;
        calculateSingleBookNewPrice('percent');
    }
}

function handleApplySingleBookDiscount() {
    if (!selectedSingleDiscountBook) {
        showAdminToast('Vui lòng chọn một cuốn sách trước!', 'error');
        return;
    }

    const discountPercent = parseInt(document.getElementById('singleDiscountPercentInput').value) || null;
    const customSalePrice = parseFloat(document.getElementById('singleDiscountCustomPriceInput').value) || null;

    if (!discountPercent && !customSalePrice) {
        showAdminToast('Vui lòng nhập % giảm giá hoặc giá bán mới!', 'error');
        return;
    }

    const btn = document.getElementById('btnApplySingleBookDiscount');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang lưu...';
    }

    fetch('/api/admin/coupons/single-book-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookId: selectedSingleDiscountBook.id,
            discountPercent: discountPercent,
            customSalePrice: customSalePrice
        })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Đã áp dụng giảm giá sách thành công!', 'success');
                if (result.salePrice !== undefined) {
                    selectedSingleDiscountBook.salePrice = result.salePrice;
                }
                if (result.originalPrice !== undefined) {
                    selectedSingleDiscountBook.originalPrice = result.originalPrice;
                }
                loadBooksForSingleDiscount();
                if (typeof loadBooks === 'function') loadBooks();
                if (typeof loadDashboardStats === 'function') loadDashboardStats();
            } else {
                showAdminToast(result.message || 'Không thể lưu giảm giá sách!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check-circle me-1"></i> Lưu Giảm Giá Cho Sách Này';
            }
        });
}

function handleResetSingleBookDiscount() {
    if (!selectedSingleDiscountBook) {
        showAdminToast('Vui lòng chọn một cuốn sách trước!', 'error');
        return;
    }

    const btn = document.getElementById('btnResetSingleBookDiscount');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang xử lý...';
    }

    fetch('/api/admin/coupons/single-book-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: selectedSingleDiscountBook.id })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Đã khôi phục giá gốc cho cuốn sách!', 'success');
                if (result.salePrice !== undefined) {
                    selectedSingleDiscountBook.salePrice = result.salePrice;
                }
                loadBooksForSingleDiscount();
                if (typeof loadBooks === 'function') loadBooks();
                if (typeof loadDashboardStats === 'function') loadDashboardStats();
            } else {
                showAdminToast(result.message || 'Không thể khôi phục giá!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-undo me-1"></i> Khôi Phục Giá Gốc Cuốn Này';
            }
        });
}

// BATCH DISCOUNT FOR BOOKS
function loadCategoriesForBatchDiscount() {
    const select = document.getElementById('batchDiscountCategorySelect');
    if (!select) return;

    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(categories => {
            select.innerHTML = '<option value="">🔥 Tất cả sách trong kho</option>' +
                categories.map(c => `<option value="${c.id}">📁 ${escapeHtml(c.name)}</option>`).join('');
        })
        .catch(err => console.warn('Cannot load categories for discount tool:', err));
}

function setQuickDiscount(percent) {
    const input = document.getElementById('batchDiscountPercentInput');
    if (input) input.value = percent;
}

function handleApplyBatchDiscount(e) {
    if (e && e.preventDefault) e.preventDefault();
    const select = document.getElementById('batchDiscountCategorySelect');
    const categoryId = select && select.value ? select.value : null;
    const discountPercent = parseInt(document.getElementById('batchDiscountPercentInput')?.value) || 0;

    if (discountPercent <= 0 || discountPercent > 90) {
        showAdminToast('Vui lòng nhập phần trăm giảm giá hợp lệ từ 1% đến 90%', 'error');
        return;
    }

    const btn = document.getElementById('btnApplyBatchDiscount');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang áp dụng...';
    }

    fetch('/api/admin/coupons/batch-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: categoryId, discountPercent: discountPercent })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Áp dụng giảm giá sách thành công!', 'success');
                if (typeof loadBooksForSingleDiscount === 'function') loadBooksForSingleDiscount();
                if (typeof loadBooks === 'function') loadBooks();
                if (typeof loadDashboardStats === 'function') loadDashboardStats();
            } else {
                showAdminToast(result.message || 'Không thể áp dụng giảm giá!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi kết nối: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-bolt me-1"></i> Áp Dụng Giảm Giá Hàng Loạt';
            }
        });
}

function handleResetBatchDiscount() {
    const select = document.getElementById('batchDiscountCategorySelect');
    const categoryId = select && select.value ? select.value : null;

    const btn = document.getElementById('btnResetBatchDiscount');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang xử lý...';
    }

    fetch('/api/admin/coupons/reset-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: categoryId })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAdminToast(result.message || 'Khôi phục giá gốc thành công!', 'success');
                if (typeof loadBooksForSingleDiscount === 'function') loadBooksForSingleDiscount();
                if (typeof loadBooks === 'function') loadBooks();
                if (typeof loadDashboardStats === 'function') loadDashboardStats();
            } else {
                showAdminToast(result.message || 'Không thể khôi phục giá!', 'error');
            }
        })
        .catch(err => {
            showAdminToast('Lỗi kết nối: ' + err.message, 'error');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-undo me-1"></i> Khôi Phục Giá Gốc Danh Mục';
            }
        });
}

// =====================================================
// HELPER FUNCTIONS & OPTIONS
// =====================================================
function loadCategoryOptions() {
    const select = document.getElementById('bookCategoryFilter');
    if (!select) return;

    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(categories => {
            select.innerHTML = '<option value="">Tất cả thể loại</option>' +
                categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
        });
}

function loadCategoryOptionsForForm(selectedId = null) {
    const select = document.getElementById('bookCategorySelect');
    if (!select) return;

    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(categories => {
            select.innerHTML = '<option value="">-- Chọn thể loại --</option>' +
                categories.map(c => `
                    <option value="${c.id}" ${selectedId && selectedId === c.id ? 'selected' : ''}>
                        ${escapeHtml(c.name)}
                    </option>
                `).join('');
        });
}

function renderBookStatusBadge(status) {
    if (!status || status === 'AVAILABLE') return '<span class="status-pill success"><i class="fas fa-check-circle"></i> Đang bán</span>';
    if (status === 'OUT_OF_STOCK') return '<span class="status-pill warning"><i class="fas fa-exclamation-circle"></i> Hết hàng</span>';
    if (status === 'STOPPED') return '<span class="status-pill danger"><i class="fas fa-times-circle"></i> Ngưng bán</span>';
    return '<span class="status-pill success"><i class="fas fa-check-circle"></i> Đang bán</span>';
}

function renderOrderStatusBadge(status) {
    const map = {
        'PENDING': '<span class="status-pill warning"><i class="fas fa-clock"></i> Chờ duyệt</span>',
        'CONFIRMED': '<span class="status-pill info"><i class="fas fa-clipboard-check"></i> Đã duyệt</span>',
        'SHIPPING': '<span class="status-pill primary" style="background:#e0e7ff; color:#4338ca;"><i class="fas fa-truck"></i> Đang giao</span>',
        'DELIVERED': '<span class="status-pill success"><i class="fas fa-check-circle"></i> Đã giao</span>',
        'CANCELLED': '<span class="status-pill danger"><i class="fas fa-times-circle"></i> Đã hủy</span>'
    };
    return map[status] || `<span class="status-pill secondary">${status}</span>`;
}

function openAdminModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
}

function closeAdminModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
}

function showAdminLoginModal() {
    openAdminModal('adminLoginModal');
}

function formatCurrency(amount) {
    return (amount || 0).toLocaleString('vi-VN') + '₫';
}

function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        let str = String(dateStr).trim();
        let d;
        if (!str.includes('Z') && !str.includes('+') && !str.includes('-0')) {
            d = new Date(str.replace(' ', 'T'));
        } else {
            d = new Date(str);
        }
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

function showAdminToast(message, type = 'info') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'adminToastContainer';
        container.className = 'admin-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}
