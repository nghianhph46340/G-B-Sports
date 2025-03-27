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
    <div class="text">
        <div class="row ">
            <div class="col-8 text-center">
                <tableSPHD />
                <tableSanPhamChiTiet/>
            </div>
            <div class="col-4">
                <form>
                    <div class="mb-3">
                        <label for="maHoaDon" class="form-label">Mã hoá đơn</label>
                        <input disabled type="text" class="form-control" id="maHoaDon">
                    </div>
                    <div class="mb-3">
                        <label for="idNhanVien" class="form-label">Tên nhân viên</label>
                        <select name="idNhanVien" id="idNhanVien" class="form-select">
                            <option value="">Chọn nhân viên</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="idKhachHang" class="form-label">Tên khách hàng</label>
                        <select name="idKhachHang" id="idKhachHang" class="form-select">
                            <option value="">Chọn khách hàng</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="phuongThucNhanHang" class="form-label" style="padding-right: 15px;">Phương thức nhận
                            hàng</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="phuongThucNhanHang" id="nhanTaiCuahang"
                                value="Nhận tại cửa hàng" v-model="phuongThucNhanHang">
                            <label class="form-check-label" for="nhanTaiCuahang">Nhận tại cửa hàng</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="phuongThucNhanHang" id="giaoHang"
                                value="Giao hàng" v-model="phuongThucNhanHang">
                            <label class="form-check-label" for="giaoHang">Giao hàng</label>
                        </div>
                        <input v-if="phuongThucNhanHang === 'Giao hàng'" name="phiVanChuyen" type="text"
                            class="form-control" id="phiVanChuyen">
                    </div>
                    <div class="mb-3">
                        <label for="tongTienTruocGiam" class="form-label">Tổng tiền trước giảm</label>
                        <input type="text" class="form-control" id="tongTienTruocGiam">
                    </div>
                    <div class="mb-3">
                        <label for="idVoucher" class="form-label">Tên voucher</label>
                        <select name="idVoucher" id="idVoucher" class="form-select">
                            <option value="">Chọn voucher</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="tongTienSauGiam" class="form-label">Tổng tiền sau giảm</label>
                        <input type="text" class="form-control" id="tongTienSauGiam">
                    </div>
                    
                    <div class="mb-3">
                        <label for="hinhThucThanhToan" class="form-label" style="padding-right: 15px;">Hình thức thanh toán</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hinhThucThanhToan" id="tienMat"
                                value="Tiền mặt" v-model="hinhThucThanhToan">
                            <label class="form-check-label" for="tienMat">Tiền mặt</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hinhThucThanhToan" id="chuyenKhoan"
                                value="Chuyển khoản" v-model="hinhThucThanhToan">
                            <label class="form-check-label" for="chuyenKhoan">Chuyển khoản</label>
                        </div>
                        <div v-if="hinhThucThanhToan === 'Tiền mặt'">
                            <label for="tienKhachDua" class="form-labels">Tiền khách đưa</label>
                            <input name="tienKhachDua" type="text"
                            class="form-control" id="tienKhachDua">
                            <label for="tienDu" class="form-labels">Tiền dư</label>
                            <input name="tienDu" type="text"
                            class="form-control" id="tienDu">
                        </div>
                    </div>
                    <div class="mb-3">
                        <div>
                            <a-switch v-model:checked="inHoaDon" checked-children="In hoá đơn"
                                un-checked-children="Không in hoá đơn" />
                        </div>
                        <p class="text-muted mt-2" hidden>
                            {{ inHoaDon ? 'IN HOÁ ĐƠN' : 'KHÔNG in hoá đơn' }}
                        </p>
                    </div>
                    <button type="submit" class="btn btn-primary">Thanh toán</button>
                </form>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
    SearchOutlined,
    FileSearchOutlined,
    RollbackOutlined,
    BarChartOutlined,
    PlusOutlined,
    CloseOutlined
} from '@ant-design/icons-vue'
import tableSPHD from './tableSPHD.vue'
import { useGbStore } from '@/stores/gbStore'
import tableSanPhamChiTiet from './tableSanPhamChiTiet.vue'

const store = useGbStore()


// Mocked product data
const productOptions = ref([
    { value: '1', label: 'Áo thể thao nam' },
    { value: '2', label: 'Giày bóng đá' },
    { value: '3', label: 'Quần short thể thao' },
    { value: '4', label: 'Áo khoác gió' },
    { value: '5', label: 'Balo thể thao' },
])

const inHoaDon = ref(false);

const hinhThucThanhToan = ref('Tiền mặt')

const phuongThucNhanHang = ref('Nhận tại cửa hàng')

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