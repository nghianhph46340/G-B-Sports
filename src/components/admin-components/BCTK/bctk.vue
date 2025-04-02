<template>
    <div class="statistics-container">
        <div class="row">
            <h4 class="col-md-6 d-flex justify-content-start">📑 Thống kê doanh thu</h4>
            <div class="filter-section col-md-6 d-flex justify-content-end gap-3 mb-4">
                <!-- Date Range Picker -->
                <template v-if="selectedFilter === 'tuy-chon'">
                    <a-range-picker v-model:value="dateRange" @change="handleDateChange"
                        :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']" :locale="locale" />
                </template>
                <!-- Filter Select -->
                <a-select v-model:value="selectedFilter" show-search placeholder="Chọn thời gian cần thống kê"
                    style="width: 250px;" :options="options" :filter-option="filterOption"
                    @change="handleFilterChange"></a-select>

            </div>
        </div>

        <!-- Thống kê cards -->
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card revenue-card">
                    <div class="card-body row">
                        <div class="col-md-3" style="font-size: 3rem;">💰</div>
                        <div class="col-md-8">
                            <h5 class="card-title">Doanh thu</h5>
                            <p class="card-text">{{ formatCurrency(thongKe.doanhThu) }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card orders-card">
                    <div class="card-body row">
                        <div class="col-md-3" style="font-size: 3rem;">📦</div>
                        <div class="col-md-8">
                            <h5 class="card-title">Tổng đơn hàng</h5>
                            <p class="card-text">{{ thongKe.tongDonHang }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card products-card">
                    <div class="card-body row">
                        <div class="col-md-3" style="font-size: 3rem;">🏷️</div>
                        <div class="col-md-8">
                            <h5 class="card-title">Tổng sản phẩm</h5>
                            <p class="card-text">{{ thongKe.tongSanPham }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chart-container mt-4">
            <div class="chart-header d-flex justify-content-between align-items-center mb-3">
                <h3>Biểu đồ doanh thu</h3>
                <div class="chart-controls d-flex gap-2">
                    <a-select v-model:value="timeUnit" style="width: 120px">
                        <!-- <a-select-option value="day">Theo ngày</a-select-option> -->
                        <a-select-option value="week">Theo tuần</a-select-option>
                        <a-select-option value="month">Theo tháng</a-select-option>
                        <a-select-option value="year">Theo năm</a-select-option>
                    </a-select>
                    <a-select v-model:value="chartType" style="width: 120px">
                        <a-select-option value="revenue">Doanh thu</a-select-option>
                        <a-select-option value="orders">Đơn hàng</a-select-option>
                        <a-select-option value="products">Sản phẩm</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="chart-body">
                <apexchart type="line" height="400" :options="chartOptions" :series="series"></apexchart>
            </div>

        </div>
        <div class="row">
            <!-- Top 3 sản phẩm bán chạy -->
            <div class="col-md-6">
                <a-card title="Top 3 Sản Phẩm Bán Chạy" :bordered="false">
                    <a-table :columns="columns" :data-source="topSellingProducts" :pagination="false" size="small">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'index'">
                                <a-tag>
                                    #{{ record.index }}
                                </a-tag>
                            </template>
                            <template v-else-if="column.key === 'doanhThu'">
                                {{ formatCurrency(record.doanhThu) }}
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </div>

            <!-- Top 3 sản phẩm bán chậm -->
            <div class="col-md-6">
                <a-card title="Top 3 Sản Phẩm Bán Chậm" :bordered="false">
                    <a-table :columns="columns" :data-source="topSlowProducts" :pagination="false" size="small">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'index'">
                                <a-tag>
                                    #{{ record.index }}
                                </a-tag>
                            </template>
                            <template v-else-if="column.key === 'doanhThu'">
                                {{ formatCurrency(record.doanhThu) }}
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { storeToRefs } from 'pinia';
import viVN from 'ant-design-vue/es/date-picker/locale/vi_VN';
import VueApexCharts from 'vue3-apexcharts';
import { bctkService } from '@/services/bctkService';
import { Card, Table, Tag } from 'ant-design-vue';

// Định nghĩa cột
const columns = [
    {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: 60,
    },
    {
        title: 'Mã sản phẩm',
        dataIndex: 'ma_san_pham',
        key: 'ma_san_pham',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
    },
    {
        title: 'Số lượng',
        dataIndex: 'so_luong',
        key: 'so_luong',
        align: 'right',
    },
    {
        title: 'Doanh thu',
        dataIndex: 'tong_tien_sau_giam',
        key: 'tong_tien_sau_giam',
        align: 'right',
    },
];

// Dữ liệu mẫu - thay thế bằng dữ liệu thực từ API
const topSellingProducts = ref([]);

const topSlowProducts = ref([]);


// Hàm lấy màu cho tag
// const getTagColor = (index) => {
//     switch (index) {
//         case 1:
//             return 'gold';
//         case 2:
//             return 'silver';
//         case 3:
//             return '#cd7f32'; // bronze
//         default:
//             return 'default';
//     }
// };
const store = useGbStore();
const { thongKe } = storeToRefs(store);

const selectedFilter = ref('hom-nay');
const dateRange = ref();
const locale = {
    ...viVN,
    lang: {
        ...viVN.lang,
        shortWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        shortMonths: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
        months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        weekDays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
        yearFormat: 'YYYY',
        monthFormat: 'TM'
    }
};

const options = [
    { value: 'hom-nay', label: 'Hôm nay' },
    { value: 'hom-qua', label: 'Hôm qua' },
    { value: 'tuan-nay', label: 'Tuần này' },
    { value: 'thang-nay', label: 'Tháng này' },
    { value: 'thang-truoc', label: 'Tháng trước' },
    { value: 'quy-nay', label: 'Quý này' },
    { value: 'quy-truoc', label: 'Quý trước' },
    { value: 'nam-nay', label: 'Năm nay' },
    { value: 'nam-ngoai', label: 'Năm ngoái' },
    { value: 'tuy-chon', label: 'Tùy chọn' }
];

const filterOption = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase());
};

// Xử lý khi thay đổi filter
const handleFilterChange = async (value) => {
    console.log('Filter được chọn:', value);
    selectedFilter.value = value;
    if (value === 'tuy-chon') {
        dateRange.value = null; // Reset date range
    } else {
        console.log('Gửi request với filter:', value);
        await store.getSoLieu(value);
    }
};

// Xử lý khi thay đổi ngày
const handleDateChange = async (dates) => {
    console.log('Selected dates:', dates);
    if (dates && dates[0] && dates[1]) {
        const startDate = dates[0].format('YYYY-MM-DD');
        const endDate = dates[1].format('YYYY-MM-DD');
        console.log('Gửi request với ngày:', { startDate, endDate });
        await store.getSoLieu('tuy-chon', startDate, endDate);
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0);
};

// Thêm state cho biểu đồ
const timeUnit = ref('month');
const chartType = ref('revenue');
const chartData = ref(null);

const series = ref([{
    name: 'Doanh thu',
    data: []
}]);

const chartOptions = ref({
    chart: {
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    grid: {
        borderColor: '#f1f1f1',
    },
    xaxis: {
        categories: [],
        labels: {
            style: { fontSize: '12px' }
        }
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                if (chartType.value === 'revenue') {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0
                    }).format(value);
                }
                return value.toFixed(0);
            }
        }
    },
    colors: ['#0ea5e9'],
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            opacityFrom: 0.7,
            opacityTo: 0.2,
        }
    },
    dataLabels: { enabled: false },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function (value) {
                if (chartType.value === 'revenue') {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0
                    }).format(value);
                }
                return value;
            }
        }
    }
});

// Hàm helper
const getChartName = (type) => {
    switch (type) {
        case 'revenue': return 'Doanh thu';
        case 'orders': return 'Đơn hàng';
        case 'products': return 'Sản phẩm';
        default: return 'Doanh thu';
    }
};

const getChartColor = (type) => {
    switch (type) {
        case 'revenue': return '#0ea5e9';
        case 'orders': return '#f59e0b';
        case 'products': return '#10b981';
        default: return '#0ea5e9';
    }
};

// Hàm lấy dữ liệu cho biểu đồ
const fetchChartData = async (timeUnitValue) => {
    try {
        console.log('Bắt đầu fetch dữ liệu cho:', timeUnitValue);
        const data = await bctkService.getChartData(timeUnitValue);
        console.log('Nhận được dữ liệu:', data);

        if (data) {
            chartData.value = data;
            console.log('Đã cập nhật chartData:', chartData.value);
            updateChartDisplay();
        }
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        chartData.value = {
            doanhThu: Array(getDefaultLength()).fill(0),
            donHang: Array(getDefaultLength()).fill(0),
            sanPham: Array(getDefaultLength()).fill(0)
        };
        updateChartDisplay();
    }
};

// Helper function to get default array length based on timeUnit
const getDefaultLength = () => {
    switch (timeUnit.value) {
        case 'day': return 6;
        case 'week': return 7;
        case 'month': return 12;
        case 'year': return 5;
        default: return 0;
    }
};

// Hàm cập nhật hiển thị biểu đồ
const updateChartDisplay = () => {
    console.log('updateChartDisplay được gọi');
    const { categories, data } = formatChartData();
    console.log('Categories:', categories);
    console.log('Data:', data);

    series.value = [{
        name: getChartName(chartType.value),
        data: data
    }];
    console.log('Series mới:', series.value);

    chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    if (chartType.value === 'revenue') {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                    return Math.round(value).toString();
                }
            }
        },
        colors: [getChartColor(chartType.value)]
    };
};

// Hàm format dữ liệu cho biểu đồ
const formatChartData = () => {
    console.log('formatChartData được gọi');
    console.log('timeUnit hiện tại:', timeUnit.value);
    console.log('chartData hiện tại:', chartData.value);

    let categories = [];
    let data = [];

    switch (timeUnit.value) {
        case 'day':
            categories = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
            break;
        case 'week':
            categories = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            break;
        case 'month':
            categories = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            break;
        case 'year':
            const currentYear = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })).getFullYear();
            categories = [
                (currentYear - 4).toString(),
                (currentYear - 3).toString(),
                (currentYear - 2).toString(),
                (currentYear - 1).toString(),
                currentYear.toString()
            ];
            console.log('Năm hiện tại (Hà Nội):', currentYear);
            console.log('Categories năm:', categories);
            break;
    }

    if (chartData.value) {
        console.log('Dữ liệu chart hiện tại:', chartData.value);
        switch (chartType.value) {
            case 'revenue':
                data = chartData.value.doanhThu || Array(categories.length).fill(0);
                break;
            case 'orders':
                data = chartData.value.donHang || Array(categories.length).fill(0);
                break;
            case 'products':
                data = chartData.value.sanPham || Array(categories.length).fill(0);
                break;
        }
    } else {
        data = Array(categories.length).fill(0);
    }

    console.log('Categories:', categories);
    console.log('Data formatted:', data);

    return { categories, data };
};

// Theo dõi thay đổi
watch([timeUnit, chartType], async ([newTimeUnit, newChartType], [oldTimeUnit, oldChartType]) => {
    console.log('Watch triggered:', { newTimeUnit, newChartType, oldTimeUnit, oldChartType });

    if (newTimeUnit !== oldTimeUnit) {
        await fetchChartData(newTimeUnit);
    } else if (newChartType !== oldChartType) {
        updateChartDisplay();
    }
});

// Khởi tạo
onMounted(async () => {
    try {
        await Promise.all([
            store.getSoLieu('hom-nay'),
            fetchChartData('month')
        ]);
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
    await store.getTopSanPhamBanChay();
    await store.getTopSanPhamBanCham();
    topSellingProducts.value = store.topSanPhamBanChay;
    topSlowProducts.value = store.topSanPhamBanCham;
});
</script>

<style scoped>
.ant-card {
    margin-bottom: 16px;
}

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

.card {
    border: none;
    border-radius: 10px;
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

.revenue-card {
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
}

.orders-card {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.products-card {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.card-body {
    padding: 1.5rem;
}

.card-title {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 8px;
    opacity: 0.9;
}

.card-text {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.col-md-3 {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Style cho a-select */
:deep(.ant-select) {
    font-size: 14px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

:deep(.ant-select-selector) {
    font-size: 14px !important;
    font-weight: 600;
}

:deep(.ant-select-selection-item) {
    font-size: 14px !important;
    font-weight: 600;
}

:deep(.ant-select-item) {
    font-size: 14px !important;
    font-weight: 600;
}

/* Style cho date range picker */
:deep(.ant-picker) {
    font-size: 14px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

:deep(.ant-picker-input) {
    font-size: 14px !important;
    font-weight: 600;
}

:deep(.ant-picker-range-separator) {
    font-size: 14px !important;
}

:deep(.ant-picker-suffix) {
    font-size: 14px !important;
    font-weight: 600;
}

.chart-container {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header h3 {
    font-size: 1.2rem;
    margin: 0;
    color: #374151;
}
</style>