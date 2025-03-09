<template>
    <div class="statistics-container">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Báo cáo doanh thu</h2>
            <div class="filter-section d-flex gap-3">
                <!-- Date Range Picker -->
                <div class="date-range d-flex align-items-center gap-2">
                    <input type="date" class="form-control" v-model="startDate">
                    <span>đến</span>
                    <input type="date" class="form-control" v-model="endDate">
                </div>
                <!-- Quick Filter -->
                <select class="form-select" v-model="timeFilter" @change="handleTimeFilterChange">
                    <option value="today">Hôm nay</option>
                    <option value="yesterday">Hôm qua</option>
                    <option value="thisWeek">Tuần này</option>
                    <option value="thisMonth">Tháng này</option>
                    <option value="lastMonth">Tháng trước</option>
                    <option value="thisYear">Năm nay</option>
                    <option value="custom">Tùy chọn</option>
                </select>
                <!-- Export Options -->
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-download me-2"></i>Xuất báo cáo
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click="exportToExcel">Xuất Excel</a></li>
                        <li><a class="dropdown-item" href="#" @click="exportToPDF">Xuất PDF</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div class="loading-overlay" v-if="isLoading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <!-- Dashboard Cards -->
        <div class="row g-4 mb-4">
            <!-- Tổng doanh thu -->
            <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-primary text-white">
                    <div class="stat-card-body">
                        <h5>Tổng doanh thu</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <h2 class="mb-0">{{ formatCurrency(statistics.totalRevenue) }}</h2>
                            <i class="fas fa-dollar-sign fa-2x"></i>
                        </div>
                        <div class="stat-percentage">
                            <i :class="statistics.revenueGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                            {{ Math.abs(statistics.revenueGrowth) }}% so với kỳ trước
                        </div>
                    </div>
                </div>
            </div>

            <!-- Đơn hàng -->
            <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-success text-white">
                    <div class="stat-card-body">
                        <h5>Đơn hàng thành công</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 class="mb-0">{{ statistics.completedOrders }}</h2>
                                <small>Tổng: {{ statistics.totalOrders }} đơn</small>
                            </div>
                            <i class="fas fa-shopping-cart fa-2x"></i>
                        </div>
                        <div class="stat-percentage">
                            Tỷ lệ thành công: {{ calculateSuccessRate() }}%
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sản phẩm -->
            <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-warning text-white">
                    <div class="stat-card-body">
                        <h5>Sản phẩm bán ra</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 class="mb-0">{{ statistics.soldProducts }}</h2>
                                <small>{{ statistics.topProduct }}</small>
                            </div>
                            <i class="fas fa-box fa-2x"></i>
                        </div>
                        <div class="stat-percentage">
                            Sản phẩm bán chạy nhất
                        </div>
                    </div>
                </div>
            </div>

            <!-- Khách hàng -->
            <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-info text-white">
                    <div class="stat-card-body">
                        <h5>Khách hàng mới</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 class="mb-0">{{ statistics.newCustomers }}</h2>
                                <small>Tổng: {{ statistics.totalCustomers }}</small>
                            </div>
                            <i class="fas fa-users fa-2x"></i>
                        </div>
                        <div class="stat-percentage">
                            <i :class="statistics.customerGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                            {{ Math.abs(statistics.customerGrowth) }}% so với kỳ trước
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="row g-4 mb-4">
            <!-- Revenue Chart -->
            <div class="col-xl-8">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title">Biểu đồ doanh thu</h5>
                            <div class="chart-filters d-flex gap-2">
                                <select class="form-select form-select-sm" v-model="chartView">
                                    <option value="daily">Theo ngày</option>
                                    <option value="weekly">Theo tuần</option>
                                    <option value="monthly">Theo tháng</option>
                                </select>
                                <select class="form-select form-select-sm" v-model="chartMetric">
                                    <option value="revenue">Doanh thu</option>
                                    <option value="orders">Đơn hàng</option>
                                    <option value="products">Sản phẩm</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas ref="revenueChartRef"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Category Distribution -->
            <div class="col-xl-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title">Phân bố theo danh mục</h5>
                            <select class="form-select form-select-sm" v-model="distributionMetric">
                                <option value="revenue">Doanh thu</option>
                                <option value="orders">Đơn hàng</option>
                                <option value="products">Sản phẩm</option>
                            </select>
                        </div>
                        <div class="chart-container">
                            <canvas ref="categoryChartRef"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Analysis -->
        <div class="row g-4 mb-4">
            <!-- Top Products -->
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title">Top sản phẩm bán chạy</h5>
                            <select class="form-select form-select-sm w-auto" v-model="topProductsLimit">
                                <option value="5">Top 5</option>
                                <option value="10">Top 10</option>
                                <option value="20">Top 20</option>
                            </select>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Danh mục</th>
                                        <th>Số lượng bán</th>
                                        <th>Doanh thu</th>
                                        <th>Tỷ lệ hoàn trả</th>
                                        <th>Đánh giá TB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="product in topProducts" :key="product.id">
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img :src="product.image" class="product-thumb me-2">
                                                {{ product.name }}
                                            </div>
                                        </td>
                                        <td>{{ product.category }}</td>
                                        <td>{{ product.soldQuantity }}</td>
                                        <td>{{ formatCurrency(product.revenue) }}</td>
                                        <td>
                                            <div class="progress" style="height: 6px;">
                                                <div class="progress-bar bg-danger" 
                                                    :style="`width: ${product.returnRate}%`">
                                                </div>
                                            </div>
                                            <small>{{ product.returnRate }}%</small>
                                        </td>
                                        <td>
                                            <div class="stars">
                                                <i v-for="n in 5" :key="n"
                                                    :class="['fas', n <= product.rating ? 'fa-star' : 'fa-star-o']">
                                                </i>
                                                <small>({{ product.reviewCount }})</small>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sales by Category -->
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title">Thống kê theo danh mục</h5>
                            <div class="d-flex gap-2">
                                <input type="text" class="form-control form-control-sm" 
                                    v-model="categorySearch" placeholder="Tìm kiếm...">
                                <select class="form-select form-select-sm" v-model="categorySortBy">
                                    <option value="revenue">Doanh thu</option>
                                    <option value="orders">Đơn hàng</option>
                                    <option value="products">Sản phẩm</option>
                                </select>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Danh mục</th>
                                        <th>Doanh thu</th>
                                        <th>Đơn hàng</th>
                                        <th>Sản phẩm bán ra</th>
                                        <th>Giá trị TB/đơn</th>
                                        <th>Xu hướng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="category in filteredCategories" :key="category.id">
                                        <td>{{ category.name }}</td>
                                        <td>{{ formatCurrency(category.revenue) }}</td>
                                        <td>{{ category.orders }}</td>
                                        <td>{{ category.products }}</td>
                                        <td>{{ formatCurrency(category.avgOrderValue) }}</td>
                                        <td>
                                            <div class="trend-indicator">
                                                <i :class="['fas', category.trend >= 0 ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger']"></i>
                                                {{ Math.abs(category.trend) }}%
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr class="table-active">
                                        <td><strong>Tổng cộng</strong></td>
                                        <td><strong>{{ formatCurrency(totalRevenue) }}</strong></td>
                                        <td><strong>{{ totalOrders }}</strong></td>
                                        <td><strong>{{ totalProducts }}</strong></td>
                                        <td><strong>{{ formatCurrency(averageOrderValue) }}</strong></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import dayjs from 'dayjs';

// State variables
const isLoading = ref(false);
const startDate = ref(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
const endDate = ref(dayjs().format('YYYY-MM-DD'));
const timeFilter = ref('thisMonth');
const chartView = ref('daily');
const chartMetric = ref('revenue');
const distributionMetric = ref('revenue');
const topProductsLimit = ref(10);
const categorySearch = ref('');
const categorySortBy = ref('revenue');

// Chart references
const revenueChartRef = ref(null);
const categoryChartRef = ref(null);
let revenueChart = null;
let categoryChart = null;

// Mock data for testing
const mockData = {
    statistics: {
        totalRevenue: 1500000000,
        revenueGrowth: 15,
        completedOrders: 450,
        totalOrders: 500,
        soldProducts: 1200,
        topProduct: 'Giày Nike Air Max',
        newCustomers: 85,
        totalCustomers: 1000,
        customerGrowth: 8
    },
    categories: [
        {
            id: 1,
            name: 'Giày bóng đá',
            revenue: 500000000,
            orders: 150,
            products: 300,
            avgOrderValue: 3333333,
            trend: 15
        },
        {
            id: 2,
            name: 'Áo bóng đá',
            revenue: 300000000,
            orders: 200,
            products: 400,
            avgOrderValue: 1500000,
            trend: 10
        },
        {
            id: 3,
            name: 'Phụ kiện',
            revenue: 200000000,
            orders: 100,
            products: 500,
            avgOrderValue: 2000000,
            trend: -5
        }
    ],
    topProducts: [
        {
            id: 1,
            name: 'Giày Nike Air Max',
            category: 'Giày bóng đá',
            image: '/path/to/image.jpg',
            soldQuantity: 100,
            revenue: 150000000,
            returnRate: 2,
            rating: 4.5,
            reviewCount: 50
        },
        // Thêm các sản phẩm khác...
    ]
};

// Data states
const statistics = ref({...mockData.statistics});
const categories = ref([...mockData.categories]);
const topProducts = ref([...mockData.topProducts]);

// Computed properties
const filteredCategories = computed(() => {
    let result = [...categories.value];
    
    if (categorySearch.value) {
        const search = categorySearch.value.toLowerCase();
        result = result.filter(cat => 
            cat.name.toLowerCase().includes(search)
        );
    }
    
    result.sort((a, b) => b[categorySortBy.value] - a[categorySortBy.value]);
    
    return result;
});

const totalRevenue = computed(() => {
    return filteredCategories.value.reduce((sum, cat) => sum + cat.revenue, 0);
});

const totalOrders = computed(() => {
    return filteredCategories.value.reduce((sum, cat) => sum + cat.orders, 0);
});

const totalProducts = computed(() => {
    return filteredCategories.value.reduce((sum, cat) => sum + cat.products, 0);
});

const averageOrderValue = computed(() => {
    return totalRevenue.value / totalOrders.value || 0;
});

// Methods
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const calculateSuccessRate = () => {
    return ((statistics.value.completedOrders / statistics.value.totalOrders) * 100).toFixed(1);
};

const handleTimeFilterChange = () => {
    if (timeFilter.value === 'today') {
        startDate.value = dayjs().format('YYYY-MM-DD');
        endDate.value = dayjs().format('YYYY-MM-DD');
    } else if (timeFilter.value === 'yesterday') {
        startDate.value = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        endDate.value = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    } else if (timeFilter.value === 'thisWeek') {
        startDate.value = dayjs().startOf('week').format('YYYY-MM-DD');
        endDate.value = dayjs().format('YYYY-MM-DD');
    } else if (timeFilter.value === 'thisMonth') {
        startDate.value = dayjs().startOf('month').format('YYYY-MM-DD');
        endDate.value = dayjs().format('YYYY-MM-DD');
    } else if (timeFilter.value === 'lastMonth') {
        startDate.value = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate.value = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
    } else if (timeFilter.value === 'thisYear') {
        startDate.value = dayjs().startOf('year').format('YYYY-MM-DD');
        endDate.value = dayjs().format('YYYY-MM-DD');
    }
    
    fetchData();
};

const fetchData = async () => {
    try {
        isLoading.value = true;
        
        // Tạm thời dùng dữ liệu mẫu thay vì gọi API
        statistics.value = mockData.statistics;
        categories.value = mockData.categories;
        topProducts.value = mockData.topProducts;
        
        await nextTick();
        initializeCharts();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        isLoading.value = false;
    }
};

const initializeCharts = () => {
    // Destroy old charts if they exist
    if (revenueChart) revenueChart.destroy();
    if (categoryChart) categoryChart.destroy();

    // Initialize revenue chart
    if (revenueChartRef.value) {
        const ctx = revenueChartRef.value.getContext('2d');
        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Doanh thu',
                    data: [120, 125, 130, 135, 138, 142, 145, 148, 150, 148, 145, 150],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // Initialize category chart
    if (categoryChartRef.value) {
        const ctx = categoryChartRef.value.getContext('2d');
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.value.map(cat => cat.name),
                datasets: [{
                    data: categories.value.map(cat => cat.revenue),
                    backgroundColor: [
                        '#0d6efd',
                        '#198754',
                        '#ffc107',
                        '#0dcaf0',
                        '#dc3545',
                        '#6610f2'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
};

const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Add summary sheet
    const summaryData = [
        ['Báo cáo doanh thu', ''],
        ['Từ ngày', startDate.value],
        ['Đến ngày', endDate.value],
        [''],
        ['Tổng doanh thu', formatCurrency(statistics.value.totalRevenue)],
        ['Tổng đơn hàng', statistics.value.totalOrders],
        ['Đơn hàng thành công', statistics.value.completedOrders],
        ['Sản phẩm đã bán', statistics.value.soldProducts],
        ['Khách hàng mới', statistics.value.newCustomers]
    ];
    const ws_summary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws_summary, "Tổng quan");

    // Add categories sheet
    const ws_categories = XLSX.utils.json_to_sheet(categories.value);
    XLSX.utils.book_append_sheet(wb, ws_categories, "Theo danh mục");

    // Add products sheet
    const ws_products = XLSX.utils.json_to_sheet(topProducts.value);
    XLSX.utils.book_append_sheet(wb, ws_products, "Top sản phẩm");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `bao-cao-doanh-thu-${startDate.value}-${endDate.value}.xlsx`);
};

const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Báo cáo doanh thu', 14, 15);
    
    // Add date range
    doc.setFontSize(10);
    doc.text(`Từ ngày: ${startDate.value} đến ngày: ${endDate.value}`, 14, 25);
    
    // Add summary
    doc.autoTable({
        head: [['Chỉ số', 'Giá trị']],
        body: [
            ['Tổng doanh thu', formatCurrency(statistics.value.totalRevenue)],
            ['Tổng đơn hàng', statistics.value.totalOrders.toString()],
            ['Đơn hàng thành công', statistics.value.completedOrders.toString()],
            ['Sản phẩm đã bán', statistics.value.soldProducts.toString()],
            ['Khách hàng mới', statistics.value.newCustomers.toString()]
        ],
        startY: 35
    });
    
    // Add categories table
    doc.addPage();
    doc.text('Thống kê theo danh mục', 14, 15);
    doc.autoTable({
        head: [['Danh mục', 'Doanh thu', 'Đơn hàng', 'Sản phẩm']],
        body: categories.value.map(cat => [
            cat.name,
            formatCurrency(cat.revenue),
            cat.orders.toString(),
            cat.products.toString()
        ]),
        startY: 25
    });
    
    // Save PDF
    doc.save(`bao-cao-doanh-thu-${startDate.value}-${endDate.value}.pdf`);
};

// Watchers
watch([startDate, endDate], () => {
    timeFilter.value = 'custom';
    fetchData();
});

watch([chartView, chartMetric], () => {
    nextTick(() => {
        initializeCharts();
    });
});

watch([distributionMetric, topProductsLimit], fetchData);

// Lifecycle hooks
onMounted(() => {
    nextTick(() => {
        initializeCharts();
        fetchData();
    });
});

onUnmounted(() => {
    if (revenueChart) {
        revenueChart.destroy();
    }
    if (categoryChart) {
        categoryChart.destroy();
    }
});
</script>

<style scoped>
.statistics-container {
    padding: 20px;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.stat-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card-body {
    padding: 20px;
}

.stat-card h5 {
    font-size: 1rem;
    margin-bottom: 15px;
    opacity: 0.9;
}

.stat-card h2 {
    font-size: 2rem;
    font-weight: 600;
}

.stat-percentage {
    font-size: 0.875rem;
    margin-top: 10px;
    opacity: 0.9;
}

.card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: none;
    margin-bottom: 20px;
}

.card-title {
    color: #333;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
}

.chart-container {
    position: relative;
    height: 300px;
    width: 100%;
}

.product-thumb {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.stars {
    color: #ffc107;
}

.stars .fas {
    font-size: 0.875rem;
}

.progress {
    margin-top: 4px;
}

.trend-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
}

.trend-indicator i {
    font-size: 12px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .statistics-container {
        padding: 10px;
    }

    .filter-section {
        flex-direction: column;
        gap: 10px;
    }

    .date-range {
        flex-direction: column;
        width: 100%;
    }

    .chart-container {
        height: 250px;
    }
}
</style>