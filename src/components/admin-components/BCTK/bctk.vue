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

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { storeToRefs } from 'pinia';
import viVN from 'ant-design-vue/es/date-picker/locale/vi_VN';

const store = useGbStore();
const { thongKe} = storeToRefs(store);

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
    selectedFilter.value = value;
    if (value === 'tuy-chon') {
        dateRange.value = null; // Reset date range khi chọn tùy chọn
    } else {
        await store.getSoLieu(value);
    }
};

// Xử lý khi thay đổi ngày
const handleDateChange = async (dates) => {
    if (dates && dates[0] && dates[1]) {
        const startDate = dates[0].format('YYYY-MM-DD');
        const endDate = dates[1].format('YYYY-MM-DD');
        await store.getSoLieu('tuy-chon', startDate, endDate);
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0);
};

onMounted(async () => {
    // Gọi API lấy dữ liệu khi component được mount
    await store.getSoLieu('hom-nay');
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart-header h3 {
    font-size: 1.2rem;
    margin: 0;
    color: #374151;
}
</style>