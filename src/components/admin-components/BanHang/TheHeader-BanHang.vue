<template>
    <div class="header-container">
        <!-- Search Combo Box -->
        <div class="search-section">
            <a-select show-search v-model:value="selectedProduct" placeholder="Tìm kiếm sản phẩm"
                :options="productOptions" :filter-option="filterOption" style="width: 250px" @search="handleSearch">
                <template #suffixIcon><search-outlined /></template>
            </a-select>
        </div>

        <!-- Invoice Tabs -->
        <div class="invoice-tabs">
            <div class="tabs-container">
                <a-tabs v-model:activeKey="activeInvoice" type="card">
                    <a-tab-pane v-for="invoice in invoices" :key="invoice.id">
                        <template #tab>
                            <div class="custom-tab">
                                <span>{{ invoice.name }}</span>
                                <close-outlined v-if="invoices.length > 1" class="close-icon"
                                    @click.stop="deleteInvoice(invoice.id)" />
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
                <a-tooltip title="Thêm hóa đơn mới">
                    <a-button type="primary" shape="circle"
                        class="add-invoice-btn d-flex align-items-center justify-content-center" @click="addInvoice"
                        :disabled="invoices.length >= 5">
                        <template #icon><plus-outlined /></template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <a-tooltip title="Tra cứu đơn hàng">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><file-search-outlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip title="Trả hàng">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><rollback-outlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip title="Báo cáo thống kê">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><bar-chart-outlined /></template>
                </a-button>
            </a-tooltip>
        </div>
    </div>

    <div class="text-center">
        <div class="row">
            <div class="col-8">
                <tableSPHD/>
            </div>
            <div class="col-4">

            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import {
    SearchOutlined,
    FileSearchOutlined,
    RollbackOutlined,
    BarChartOutlined,
    PlusOutlined,
    CloseOutlined
} from '@ant-design/icons-vue'
import tableSPHD from './tableSPHD.vue'

// Mocked product data
const productOptions = ref([
    { value: '1', label: 'Áo thể thao nam' },
    { value: '2', label: 'Giày bóng đá' },
    { value: '3', label: 'Quần short thể thao' },
    { value: '4', label: 'Áo khoác gió' },
    { value: '5', label: 'Balo thể thao' },
])

const selectedProduct = ref(undefined)

// Filter function for search
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// Handle search function
const handleSearch = (value) => {
    console.log('Searching:', value)
    // Implement actual search logic here
}

// Invoice management
const invoices = ref([
    { id: '1', name: 'Đơn 1' }
])
const activeInvoice = ref('1')

// Function to add new invoice
const addInvoice = () => {
    const newId = String(invoices.value.length + 1)
    invoices.value.push({
        id: newId,
        name: `Đơn ${newId}`
    })
    activeInvoice.value = newId
}

// Function to delete specific invoice
const deleteInvoice = (invoiceId) => {
    if (invoices.value.length <= 1) {
        return // At least one invoice should exist
    }

    const currentIndex = invoices.value.findIndex(inv => inv.id === invoiceId)
    const isActive = invoiceId === activeInvoice.value

    // Remove the invoice
    invoices.value.splice(currentIndex, 1)

    // If we deleted the active invoice, set a new active invoice
    if (isActive && invoices.value.length > 0) {
        const newIndex = Math.min(currentIndex, invoices.value.length - 1)
        activeInvoice.value = invoices.value[newIndex].id
    }
}
</script>

<style scoped>
.header-container {
    height: 60px;
    background-color: #343434;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.search-section {
    margin-right: 20px;
}

.invoice-tabs {
    flex: 1;
    max-width: 600px;
}

.tabs-container {
    display: flex;
    align-items: center;
}

.tabs-container .ant-tabs {
    flex: 1;
}

.add-invoice-btn {
    margin-left: 5px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}

.custom-tab {
    position: relative;
    padding-right: 4px;
    display: flex;
    align-items: center;
    color: white;
}

.close-icon {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 0px;
    opacity: 0;
    transition: opacity 0.3s;
    color: rgba(255, 255, 255, 0.65);
}

.close-icon:hover {
    color: white;
}

.custom-tab:hover .close-icon {
    opacity: 1;
}

/* Overriding Ant Design styles for dark theme */
:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab) {
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active) {
    background-color: #1890ff;
    color: white;
}

:deep(.ant-tabs-nav) {
    margin-bottom: 0;
}

:deep(.ant-select-selector) {
    background-color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.ant-tabs-content) {
    display: none;
}
</style>