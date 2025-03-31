<template>
    <div class="header-container">
        <!-- Search Combo Box -->
        <div class="search-section">
            <a-select show-search placeholder="Tìm kiếm sản phẩm"
                :options="productOptions" :filter-option="filterOption" style="width: 250px" @search="handleSearch">
                <template #suffixIcon><search-outlined /></template>
            </a-select>
        </div>



        <!-- Invoice Tabs -->
        <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
                {{ pane.content }}
            </a-tab-pane>
        </a-tabs>

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
            </div>
            <div class="col-4">
                <form>
                    <div class="mb-3">
                        <label for="maHoaDon" class="form-label">Mã hoá đơn: {{ hd.id_hoa_don }}</label>

                    </div>
                    <div class="mb-3">
                        <label for="idNhanVien" class="form-label">Tên nhân viên: {{ hd.id_nhan_vien }}</label>

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
                        <label for="hinhThucThanhToan" class="form-label" style="padding-right: 15px;">Hình thức thanh
                            toán</label>
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
                            <input name="tienKhachDua" type="text" class="form-control" id="tienKhachDua">
                            <label for="tienDu" class="form-labels">Tiền dư</label>
                            <input name="tienDu" type="text" class="form-control" id="tienDu">
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
import { onMounted, reactive, ref } from 'vue'
import {
    SearchOutlined,
    FileSearchOutlined,
    RollbackOutlined,
    BarChartOutlined
} from '@ant-design/icons-vue'
import tableSPHD from './tableSPHD.vue'
import { useGbStore } from '@/stores/gbStore'
const store = useGbStore()
onMounted(() => {
    store.getListHoaDon();
})


const listhdct = ref([])
const listhd = ref([])
const idhd = ref(0)
const hd = reactive({
    id_hoa_don: 0,
    ma_hoa_don: "",
    id_nhan_vien: 0,
    id_khach_hang: 0,
    ngay_tao: new Date,
    ngay_sua: "",
    trang_thai: "",
    id_voucher: 0,
    sdt_nguoi_nhan: "",
    dia_chi: "",
    email: "",
    tong_tien_truoc_giam: 0,
    phi_van_chuyen: 0,
    ho_ten: "",
    tong_tien_sau_giam: 0,
    hinh_thuc_thanh_toan: "",
    phuong_thuc_nhan_hang: "",
    loai_hoa_don: "offline",
    dia_chi: "",
    email: "",
    hinh_thuc_thanh_toan: "",
    ho_ten: "",

})
const sphdct = reactive({
    id_hoa_don_chi_tiet: 0,
    hd: hd,
    id_chi_tiet_san_pham: 0,
    so_luong: 0,
    gia_ban: 0,
    tong_tien: 0
})

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

// Filter function for search
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// Handle search function
const handleSearch = (value) => {
    console.log('Searching:', value)
    // Implement actual search logic here
}
const generateInvoiceCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const listAllHoaDon = store.getListHoaDonAll
    let result;
    let isUnique = false;
    // 
    // Lặp cho đến khi tìm được mã không trùng
    while (!isUnique) {
        result = 'HD';

        // Tạo 6 ký tự ngẫu nhiên
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Kiểm tra xem mã đã tồn tại chưa (không phân biệt hoa thường)
        const exists = listAllHoaDon.some(hoaDon =>
            hoaDon.ma_hoa_don.toLowerCase() === result.toLowerCase()
        );

        // Nếu mã là duy nhất, thoát vòng lặp
        if (!exists) {
            isUnique = true;
        }
    }

    return result;
};
const mhd = generateInvoiceCode();
console.log(mhd)
sphdct.id_hoa_don_chi_tiet = 1
hd.id_hoa_don = 1
hd.ma_hoa_don = mhd
const panes = ref([
    {
        title: 'Đơn 1',
        content: 'Content of Tab 1',
        key: '1',
        closable: false,
        sphdct: sphdct
    },
]);
console.log(panes.value)
const activeKey = ref(panes.value[0].key);
const newTabIndex = ref(0);
const add = () => {
    activeKey.value = `newTab${++newTabIndex.value}`;
    panes.value.push({
        title: 'Đơn ' + (newTabIndex.value + 1),
        content: 'Content of new Tab',
        key: activeKey.value,
    });
};
const remove = targetKey => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
            lastIndex = i - 1;
        }
    });
    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
            activeKey.value = panes.value[lastIndex].key;
        } else {
            activeKey.value = panes.value[0].key;
        }
    }
};
const onEdit = (targetKey, action) => {
    if (action === 'add') {
        add();
    } else {
        remove(targetKey);
    }
};
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