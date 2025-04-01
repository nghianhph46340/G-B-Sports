<template>
    <div class="header-container">
        <!-- Search Combo Box -->
        <div class="search-section">
            <a-dropdown v-model:visible="dropdownVisible" :trigger="['click']" overlayClassName="product-dropdown">
                <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm sản phẩm theo tên..."
                    @input="handleSearchInput" @search="performSearch" @focus="showDropdown" style="width: 300px">
                    <template #enterButton>
                        <search-outlined />
                    </template>
                </a-input-search>

                <template #overlay>
                    <div class="dropdown-content">
                        <div v-if="filteredProducts.length === 0 && searchQuery.length > 0"
                            style="padding: 15px; text-align: center;">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>
                        <a-table v-else-if="filteredProducts.length > 0" :dataSource="filteredProducts"
                            :columns="productColumns" :pagination="false" size="small" bordered :scroll="{ y: 300 }"
                            rowKey="id">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'hinh_anh'">
                                    <img :src="record.hinh_anh || 'default-product.png'" alt="Product"
                                        class="product-image" />
                                </template>
                                <template v-else-if="column.key === 'gia_ban'">
                                    {{ formatCurrency(record.gia_ban) }}
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <a-button type="primary" size="small" @click="addToBill(record)"
                                        :disabled="record.so_luong_ton <= 0">
                                        Thêm
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                        <div v-else style="padding: 15px; text-align: center;">
                            Nhập tên sản phẩm để tìm kiếm.
                        </div>
                    </div>
                </template>
            </a-dropdown>
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
                <div class="table-responsive mt-4">
                    <table class="table table-hover">
                        <thead>
                            <tr class="">
                                <th scope="col">#</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Giá bán</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr v-if="!activeTabData || currentInvoiceItems.length === 0">
                            <td colspan="7" class="text-center" style="padding: 20px;">
                                {{ !activeTabData ? 'Vui lòng chọn hoặc tạo hóa đơn.' : 'Chưa có sản phẩm nào trong hóa đơn này.' }}
                            </td>
                        </tr>
                        <tr v-for="(item, index) in currentInvoiceItems" :key="item.id_chi_tiet_san_pham">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <img :src="item.hinh_anh || 'default-product.png'" alt="Item" class="invoice-item-image" />
                            </td>
                            <td>
                                {{ item.ten_san_pham }} <br/>
                                <small>({{ item.mau_sac }} - {{ item.kich_thuoc }})</small>
                            </td>
                            <td>
                                 <a-input-number
                                     v-model:value="item.so_luong"
                                     :min="1"
                                     :max="item.so_luong_ton_goc" size="small"
                                     @change="updateItemTotal(item)"
                                     style="width: 80px;"
                                 />
                            </td>
                            <td>{{ formatCurrency(item.gia_ban) }}</td>
                            <td>{{ formatCurrency(item.tong_tien) }}</td>
                            <td>
                                <a-button type="danger" shape="circle" size="small" @click="removeFromBill(item.id_chi_tiet_san_pham)">
                                     <template #icon><delete-outlined /></template>
                                </a-button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div class="col-4">
                 <form v-if="activeTabData && activeTabData.hd" @submit.prevent="handlePayment">
                    <div class="mb-3">
                        <label class="form-label">Mã hoá đơn: {{ activeTabData.hd.ma_hoa_don }}</label>
                    </div>
                    <div class="mb-3">
                         <label class="form-label">Tên nhân viên: {{ /* Lấy tên NV dựa trên activeTabData.hd.id_nhan_vien */ 'Nhân viên A' }}</label>
                    </div>
                    <div class="mb-3">
                        <label for="idKhachHang" class="form-label">Tên khách hàng</label>
                        <select name="idKhachHang" id="idKhachHang" class="form-select" v-model="activeTabData.hd.id_khach_hang">
                            <option :value="null">-- Chọn khách hàng (Khách lẻ) --</option>
                            </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label d-block mb-2">Phương thức nhận hàng</label>
                        <div class="form-check form-check-inline">
                             <input class="form-check-input" type="radio" :name="'phuongThucNhanHang_' + activeKey" :id="'nhanTaiCuahang_' + activeKey"
                                value="Nhận tại cửa hàng" v-model="activeTabData.hd.phuong_thuc_nhan_hang">
                            <label class="form-check-label" :for="'nhanTaiCuahang_' + activeKey">Tại cửa hàng</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'phuongThucNhanHang_' + activeKey" :id="'giaoHang_' + activeKey"
                                value="Giao hàng" v-model="activeTabData.hd.phuong_thuc_nhan_hang">
                            <label class="form-check-label" :for="'giaoHang_' + activeKey">Giao hàng</label>
                        </div>
                         <div v-if="activeTabData.hd.phuong_thuc_nhan_hang === 'Giao hàng'" class="mt-2">
                              <label class="form-label">Địa chỉ nhận hàng</label>
                              <input type="text" class="form-control mb-2" placeholder="Nhập địa chỉ" v-model="activeTabData.hd.dia_chi_nhan_hang">
                              <label class="form-label">Phí vận chuyển</label>
                               <a-input-number
                                   v-model:value="activeTabData.hd.phi_van_chuyen"
                                   :min="0"
                                   :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                   :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                   placeholder="Nhập phí vận chuyển"
                                   style="width: 100%"
                               />
                         </div>
                    </div>
                     <div class="mb-3">
                        <label class="form-label">Tổng tiền hàng:</label>
                        <input type="text" class="form-control" :value="formatCurrency(totalAmountBeforeDiscount)" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="idVoucher" class="form-label">Voucher</label>
                         <select name="idVoucher" id="idVoucher" class="form-select" v-model="activeTabData.hd.id_voucher">
                            <option :value="null">-- Chọn voucher --</option>
                            </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tổng tiền thanh toán:</label>
                         <input type="text" class="form-control" :value="formatCurrency(finalTotalAmount)" disabled>
                    </div>

                    <div class="mb-3">
                        <label class="form-label d-block mb-2">Hình thức thanh toán</label>
                        <div class="form-check form-check-inline">
                             <input class="form-check-input" type="radio" :name="'hinhThucThanhToan_' + activeKey" :id="'tienMat_' + activeKey"
                                value="Tiền mặt" v-model="activeTabData.hd.hinh_thuc_thanh_toan">
                            <label class="form-check-label" :for="'tienMat_' + activeKey">Tiền mặt</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'hinhThucThanhToan_' + activeKey" :id="'chuyenKhoan_' + activeKey"
                                value="Chuyển khoản" v-model="activeTabData.hd.hinh_thuc_thanh_toan">
                            <label class="form-check-label" :for="'chuyenKhoan_' + activeKey">Chuyển khoản</label>
                        </div>
                         <div v-if="activeTabData.hd.hinh_thuc_thanh_toan === 'Tiền mặt'" class="mt-2">
                            <label class="form-label">Tiền khách đưa</label>
                             <a-input-number
                                 v-model:value="activeTabData.hd.tien_khach_dua"
                                 :min="0"
                                 :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                 :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                 placeholder="Nhập số tiền khách đưa"
                                 style="width: 100%"
                                 @change="calculateChange" />
                            <label class="form-label mt-2">Tiền thừa trả khách</label>
                             <input type="text" class="form-control" :value="formatCurrency(calculatedChange)" disabled>
                        </div>
                    </div>
                     <div class="mb-3">
                         <a-switch v-model:checked="activeTabData.hd.in_hoa_don" checked-children="In hoá đơn"
                            un-checked-children="Không in hoá đơn" />
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Tạo Đơn Hàng & Thanh Toán</button>
                </form>
                 <div v-else class="text-center text-muted mt-5">
                    Vui lòng chọn hoặc tạo một hóa đơn.
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import {
    SearchOutlined,
    FileSearchOutlined,
    RollbackOutlined,
    BarChartOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// import { useProductStore } from '@/stores/productStore'; // Uncomment nếu dùng store
// import { useInvoiceStore } from '@/stores/invoiceStore'; // Uncomment nếu dùng store

// const productStore = useProductStore(); // Uncomment nếu dùng store
// const invoiceStore = useInvoiceStore(); // Uncomment nếu dùng store

// --- State cho tìm kiếm và dropdown ---
const dropdownVisible = ref(false);
const searchQuery = ref('');
const allProducts = ref([]); // Danh sách TẤT CẢ sản phẩm chi tiết lấy từ API/store
const isLoadingProducts = ref(false); // Trạng thái loading sản phẩm

// --- State cho quản lý Tab hóa đơn ---
const panes = ref([]); // Khởi tạo rỗng, sẽ tạo tab đầu tiên trong onMounted
const activeKey = ref('');
const newTabIndex = ref(0); // Chỉ dùng để tạo key duy nhất nếu cần, không dùng cho tiêu đề

// --- Dữ liệu mẫu (Thay thế bằng cách gọi API trong onMounted) ---
const dummyProducts = [
    { id: 1, hinh_anh: 'https://via.placeholder.com/50/FFA07A', ten_san_pham: 'Áo Thun Basic', so_luong_ton: 50, mau_sac: 'Trắng', kich_thuoc: 'M', gia_ban: 150000 },
    { id: 2, hinh_anh: 'https://via.placeholder.com/50/ADD8E6', ten_san_pham: 'Áo Thun Basic', so_luong_ton: 30, mau_sac: 'Đen', kich_thuoc: 'L', gia_ban: 150000 },
    { id: 3, hinh_anh: 'https://via.placeholder.com/50/90EE90', ten_san_pham: 'Quần Jeans Slimfit', so_luong_ton: 25, mau_sac: 'Xanh Đậm', kich_thuoc: '30', gia_ban: 450000 },
    { id: 4, hinh_anh: 'https://via.placeholder.com/50/FFB6C1', ten_san_pham: 'Váy Hoa Nhí', so_luong_ton: 15, mau_sac: 'Hồng', kich_thuoc: 'S', gia_ban: 350000 },
    { id: 5, hinh_anh: 'https://via.placeholder.com/50/FFFFE0', ten_san_pham: 'Áo Sơ Mi Caro', so_luong_ton: 40, mau_sac: 'Xanh Caro', kich_thuoc: 'XL', gia_ban: 280000 },
    { id: 6, hinh_anh: 'https://via.placeholder.com/50/DDA0DD', ten_san_pham: 'Quần Kaki', so_luong_ton: 0, mau_sac: 'Be', kich_thuoc: '32', gia_ban: 320000 }, // Sản phẩm hết hàng
    // Thêm nhiều sản phẩm khác...
];

// --- Định nghĩa cột cho bảng dropdown sản phẩm ---
const productColumns = [
    { title: 'Ảnh', dataIndex: 'hinh_anh', key: 'hinh_anh', width: 60 },
    { title: 'Tên sản phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham', ellipsis: true },
    { title: 'Tồn', dataIndex: 'so_luong_ton', key: 'so_luong_ton', width: 60, align: 'right' },
    { title: 'Màu', dataIndex: 'mau_sac', key: 'mau_sac', width: 80 },
    { title: 'Size', dataIndex: 'kich_thuoc', key: 'kich_thuoc', width: 60 },
    { title: 'Giá bán', dataIndex: 'gia_ban', key: 'gia_ban', width: 100, align: 'right' },
    { title: 'Thêm', key: 'action', width: 70, align: 'center' },
];

// --- Computed Properties ---
// Lọc sản phẩm cho dropdown tìm kiếm
const filteredProducts = computed(() => {
    // Nếu chưa có danh sách sản phẩm gốc thì trả về mảng rỗng
    if (!allProducts.value || allProducts.value.length === 0) {
        return [];
    }

    // Nếu ô tìm kiếm trống, hiển thị 5 sản phẩm đầu tiên
    if (!searchQuery.value) {
        // Lọc ra sản phẩm còn hàng nếu muốn:
        // return allProducts.value.filter(p => p.so_luong_ton > 0).slice(0, 5);
        // Hoặc hiển thị cả sản phẩm hết hàng:
        return allProducts.value.slice(0, 5);
    }

    // Nếu có từ khóa tìm kiếm, lọc và hiển thị tối đa 5 sản phẩm phù hợp
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return allProducts.value.filter(product =>
        product.ten_san_pham.toLowerCase().includes(lowerCaseQuery)
        // Có thể thêm điều kiện lọc theo mã SKU, màu sắc,...
        // && product.so_luong_ton > 0 // Chỉ hiện sản phẩm còn hàng khi lọc
    ).slice(0, 5); // Giới hạn 5 kết quả khi lọc
});

// Lấy dữ liệu của tab đang active
const activeTabData = computed(() => {
    return panes.value.find(pane => pane.key === activeKey.value);
});

// Lấy danh sách item của hóa đơn đang active (Đảm bảo trả về mảng rỗng nếu activeTabData không tồn tại)
const currentInvoiceItems = computed(() => {
    // Quan trọng: Cần kiểm tra activeTabData.value.items tồn tại không
    return activeTabData.value?.items?.value || [];
});


// Tính tổng tiền hàng (trước giảm giá) của hóa đơn hiện tại
const totalAmountBeforeDiscount = computed(() => {
    // Sử dụng currentInvoiceItems đã được kiểm tra ở trên
    return currentInvoiceItems.value.reduce((sum, item) => sum + item.tong_tien, 0);
});

// Tính tổng tiền cuối cùng (sau giảm giá, phí vận chuyển...) - Cần logic phức tạp hơn
const finalTotalAmount = computed(() => {
    if (!activeTabData.value) return 0; // Thêm kiểm tra activeTabData
    const totalItems = totalAmountBeforeDiscount.value;
    const shippingFee = activeTabData.value.hd?.phi_van_chuyen || 0; // Thêm kiểm tra hd
    const discount = 0; // Tính toán giảm giá từ voucher
    return totalItems + shippingFee - discount;
});


// --- Methods ---
// Định dạng tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hiển thị dropdown khi focus vào input
const showDropdown = () => {
    if (!dropdownVisible.value) {
        dropdownVisible.value = true;
    }
};

// Xử lý khi người dùng gõ vào ô tìm kiếm
const handleSearchInput = () => {
    if (!dropdownVisible.value && searchQuery.value) {
        dropdownVisible.value = true;
    }
};

// Xử lý khi nhấn Enter hoặc nút Search (có thể dùng để tìm kiếm chính xác hơn)
const performSearch = () => {
    if (!dropdownVisible.value && searchQuery.value) {
        dropdownVisible.value = true;
    }
    console.log('Performing search for:', searchQuery.value);
};

// Thêm sản phẩm vào hóa đơn chi tiết của tab hiện tại
const addToBill = (product) => {
    console.log('Adding product:', product);
    const currentTab = activeTabData.value;
    if (!currentTab || !currentTab.items) { // Kiểm tra cả currentTab và currentTab.items
        message.error('Vui lòng chọn hoặc tạo một hóa đơn hợp lệ trước!');
        return;
    }
    if (product.so_luong_ton <= 0) {
        message.warning(`Sản phẩm "${product.ten_san_pham}" đã hết hàng!`);
        return;
    }

    // Truy cập mảng items thông qua .value vì nó là ref
    const itemsArray = currentTab.items.value;
    const existingItem = itemsArray.find(item => item.id_chi_tiet_san_pham === product.id);

    if (existingItem) {
        if (existingItem.so_luong + 1 > product.so_luong_ton) {
            message.warning(`Số lượng tồn của "${product.ten_san_pham}" (${product.mau_sac} - ${product.kich_thuoc}) không đủ (${product.so_luong_ton})!`);
            return;
        }
        existingItem.so_luong++;
        existingItem.tong_tien = existingItem.so_luong * existingItem.gia_ban;
    } else {
        // Thêm mới vào mảng items.value
        itemsArray.push({
            id_chi_tiet_san_pham: product.id,
            hinh_anh: product.hinh_anh,
            ten_san_pham: product.ten_san_pham,
            mau_sac: product.mau_sac,
            kich_thuoc: product.kich_thuoc,
            so_luong: 1,
            gia_ban: product.gia_ban,
            tong_tien: product.gia_ban,
            so_luong_ton_goc: product.so_luong_ton
        });
    }
    dropdownVisible.value = false;
    searchQuery.value = '';
    message.success(`Đã thêm "${product.ten_san_pham}" vào hóa đơn.`);
};


// Cập nhật tổng tiền khi số lượng thay đổi trong bảng hóa đơn
const updateItemTotal = (item) => {
    const productInfo = allProducts.value.find(p => p.id === item.id_chi_tiet_san_pham);
    if (productInfo && item.so_luong > productInfo.so_luong_ton) {
        message.warning(`Số lượng tồn của "${item.ten_san_pham}" không đủ (${productInfo.so_luong_ton}). Đã đặt lại số lượng tối đa.`);
        item.so_luong = productInfo.so_luong_ton;
    }
    if (item.so_luong <= 0) {
        item.so_luong = 1;
    }
    item.tong_tien = item.so_luong * item.gia_ban;
};

// Xóa sản phẩm khỏi hóa đơn chi tiết của tab hiện tại
const removeFromBill = (productId) => {
    const currentTab = activeTabData.value;
    if (!currentTab || !currentTab.items) return; // Kiểm tra cả items

    const itemsArray = currentTab.items.value; // Truy cập qua .value
    const itemIndex = itemsArray.findIndex(item => item.id_chi_tiet_san_pham === productId);
    if (itemIndex !== -1) {
        const removedItem = itemsArray.splice(itemIndex, 1);
        message.info(`Đã xóa "${removedItem[0].ten_san_pham}" khỏi hóa đơn.`);
    }
};

// Hàm tạo mã hóa đơn duy nhất (phiên bản đã sửa, kiểm tra trong panes hiện tại)
const generateInvoiceCode = () => {
    let code;
    let attempts = 0;
    const maxAttempts = 100;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     do {
        code = 'HD';
         for (let i = 0; i < 6; i++) {
             code += characters.charAt(Math.floor(Math.random() * characters.length));
         }
        attempts++;
        // Kiểm tra xem code đã tồn tại trong các tab đang mở chưa (trong client)
    } while (panes.value.some(p => p.hd.ma_hoa_don === code) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        console.error("Không thể tạo mã hóa đơn duy nhất!");
        message.error("Lỗi tạo mã hóa đơn, vui lòng thử lại!")
        return "HDERROR";
    }
    return code;
};

// Hàm tạo mới một tab hóa đơn (Đã sửa)
const add = () => {
    newTabIndex.value++; // Vẫn dùng để đảm bảo key khác nhau nếu tạo quá nhanh
    const newKey = `invoiceTab_${Date.now()}_${newTabIndex.value}`;
    const newInvoiceCode = generateInvoiceCode(); // Gọi hàm tạo mã đã sửa

    panes.value.push({
        title: `Đơn ${panes.value.length + 1}`,
        key: newKey,
        closable: true,
        items: ref([]), // *** QUAN TRỌNG: Khởi tạo items là một ref([]) ***
        hd: reactive({ // *** Đối tượng hóa đơn riêng cho tab này ***
            id_hoa_don: 0,
            ma_hoa_don: newInvoiceCode, // Gán mã vừa tạo
            id_nhan_vien: 1, // Thay bằng ID nhân viên thực tế
            id_khach_hang: null,
            ngay_tao: new Date(),
            trang_thai: 'Chờ xử lý',
            id_voucher: null,
            tong_tien_truoc_giam: 0,
            phi_van_chuyen: 0,
            tong_tien_sau_giam: 0,
            hinh_thuc_thanh_toan: 'Tiền mặt',
            phuong_thuc_nhan_hang: 'Nhận tại cửa hàng',
            loai_hoa_don: "offline",
            // Các trường khác cho form
            ho_ten_nguoi_nhan: '',
            sdt_nguoi_nhan: '',
            dia_chi_nhan_hang: '',
            email_nguoi_nhan: '',
            tien_khach_dua: null,
            tien_du: null,
            in_hoa_don: false,
        })
    });
    activeKey.value = newKey;
};

// Hàm đóng tab hóa đơn (Đã sửa)
const remove = targetKey => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
            lastIndex = i - 1;
        }
    });

    const tabToRemove = panes.value.find(p => p.key === targetKey);
    // Kiểm tra items.value.length vì items là ref
    if (tabToRemove && tabToRemove.items && tabToRemove.items.value.length > 0) {
        if (!confirm(`Hóa đơn "${tabToRemove.title}" có sản phẩm. Bạn chắc chắn muốn hủy hóa đơn này?`)) {
            return;
        }
    }

    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
            activeKey.value = panes.value[lastIndex].key;
        } else {
            activeKey.value = panes.value.length > 0 ? panes.value[0].key : ''; // Gán key của tab đầu tiên còn lại hoặc rỗng
        }
    }

    // Nếu không còn tab nào, tạo lại tab mới
    if (panes.value.length === 0) {
        add();
    }
};

// Xử lý sự kiện edit tab (add hoặc remove) (Đã sửa)
const onEdit = (targetKeyOrAction, action) => {
    if (action === 'add') {
        add();
    } else {
        remove(targetKeyOrAction);
    }
};

// Hàm xử lý thanh toán (submit form)
const handlePayment = async () => { // Thêm async nếu gọi API
    const currentTab = activeTabData.value;
    if (!currentTab) {
        message.error("Không có hóa đơn nào đang được chọn.");
        return;
    }

     // Truy cập items qua .value
    if (!currentTab.items || currentTab.items.value.length === 0) {
        message.warning("Hóa đơn chưa có sản phẩm nào.");
        return;
    }

    // Cập nhật lại tổng tiền trước khi gửi đi
    currentTab.hd.tong_tien_truoc_giam = totalAmountBeforeDiscount.value;
    currentTab.hd.tong_tien_sau_giam = finalTotalAmount.value;

    // Validate các trường thông tin... (Giữ nguyên logic validate cũ)
     if (currentTab.hd.phuong_thuc_nhan_hang === 'Giao hàng') {
        if (!currentTab.hd.id_khach_hang && (!currentTab.hd.ho_ten_nguoi_nhan || !currentTab.hd.sdt_nguoi_nhan || !currentTab.hd.dia_chi_nhan_hang)) {
            message.error("Vui lòng nhập đầy đủ thông tin giao hàng (Tên, SĐT, Địa chỉ) hoặc chọn khách hàng.");
            return;
        }
         if(currentTab.hd.phi_van_chuyen <= 0) {
              message.warning("Vui lòng nhập phí vận chuyển cho đơn hàng giao.");
              // return;
         }
    }
     if (currentTab.hd.hinh_thuc_thanh_toan === 'Tiền mặt') {
        // Validate tiền khách đưa (nếu cần thiết)
        // if(currentTab.hd.tien_khach_dua === null || currentTab.hd.tien_khach_dua < currentTab.hd.tong_tien_sau_giam){
        //     message.error("Vui lòng nhập đủ tiền khách đưa.");
        //     return;
        // }
        // currentTab.hd.tien_du = currentTab.hd.tien_khach_dua - currentTab.hd.tong_tien_sau_giam;
    }


    console.log("Submitting Invoice Data for Tab:", currentTab.key);
    // Cần dùng JSON.parse(JSON.stringify(...)) để log giá trị thực sự của reactive object
    console.log("Invoice Header (hd):", JSON.parse(JSON.stringify(currentTab.hd)));
    // Items là ref, cần .value
    console.log("Invoice Items (items):", JSON.parse(JSON.stringify(currentTab.items.value)));

    // try {
    //    // Gọi API để lưu hóa đơn
    //    const savedInvoice = await invoiceStore.createInvoice({
    //        invoiceData: currentTab.hd,
    //        itemsData: currentTab.items.value // Gửi items.value
    //    });
    //    message.success(`Đã tạo thành công hóa đơn ${savedInvoice.ma_hoa_don}`);
    //    // Xóa tab sau khi lưu thành công
    //    remove(currentTab.key);
    //    // In hóa đơn nếu cần
    //    // if (currentTab.hd.in_hoa_don) { printInvoice(savedInvoice); }
    // } catch (error) {
    //     console.error("Lỗi khi tạo hóa đơn:", error);
    //     message.error("Tạo hóa đơn thất bại. Vui lòng thử lại.");
    // }
};


// --- Lifecycle Hooks ---
onMounted(async () => {
    isLoadingProducts.value = true;
    try {
        // Thay thế bằng logic gọi API lấy sản phẩm thực tế
        allProducts.value = dummyProducts; // Sử dụng dữ liệu mẫu
        console.log("Dummy products loaded:", allProducts.value);

        // Khởi tạo tab hóa đơn đầu tiên nếu chưa có
        if (panes.value.length === 0) {
            add();
        }

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
        message.error("Không thể tải danh sách sản phẩm.");
    } finally {
        isLoadingProducts.value = false;
    }
});

// --- Watchers ---
// Sửa lỗi watcher: Cần watch activeTabData và items bên trong nó
watch(() => activeTabData.value?.items?.value, (newItems) => {
    const currentTab = activeTabData.value;
    // Kiểm tra cả currentTab và hd tồn tại
    if (currentTab && currentTab.hd && newItems) {
        currentTab.hd.tong_tien_truoc_giam = newItems.reduce((sum, item) => sum + item.tong_tien, 0);
        // Tính lại tổng tiền sau giảm giá
        currentTab.hd.tong_tien_sau_giam = currentTab.hd.tong_tien_truoc_giam + (currentTab.hd.phi_van_chuyen || 0) - 0 /* discount */;
    }
}, { deep: true });


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
    position: relative;
}

/* Style cho dropdown */
:deep(.product-dropdown) {
    width: 800px !important;
    /* Điều chỉnh độ rộng theo nhu cầu */
    max-height: 500px;
    overflow: hidden;
}

:deep(.product-dropdown .ant-dropdown-menu) {
    padding: 0;
}

/* Style cho dropdown */
:deep(.product-dropdown) {
    width: 600px !important;
    max-height: 400px; /* Hoặc chiều cao phù hợp */
    overflow: hidden;
}

/* --- CSS làm nhỏ bảng bên trong dropdown --- */

/* Giảm padding và font-size cho header của bảng */
:deep(.product-dropdown .ant-table-thead > tr > th) {
    padding: 6px 8px !important;  /* Giảm padding top/bottom và left/right */
    font-size: 13px !important; /* Giảm kích thước font */
    /* background: #fafafa; /* Giữ lại style cũ nếu cần */
    /* position: sticky; */
    /* top: 0; */
    /* z-index: 1; */
}

/* Giảm padding và font-size cho các ô dữ liệu (cell) của bảng */
:deep(.product-dropdown .ant-table-tbody > tr > td) {
    padding: 4px 8px !important;  /* Giảm padding top/bottom và left/right */
    font-size: 13px !important; /* Giảm kích thước font */
    vertical-align: middle;    /* Căn giữa nội dung theo chiều dọc */
}

/* Điều chỉnh kích thước ảnh sản phẩm trong bảng nhỏ này nếu cần */
:deep(.product-dropdown .product-image) {
    width: 35px !important;   /* Làm ảnh nhỏ hơn */
    height: 35px !important;
    /* object-fit: cover; */
    /* border-radius: 4px; */
}

/* Bỏ margin âm mặc định có thể gây thừa khoảng trắng */
:deep(.product-dropdown .ant-table) {
     margin: 0 !important;
}

/* Đảm bảo container không có border thừa nếu có */
:deep(.product-dropdown .ant-table-container) {
     border: none !important;
}

/* Có thể cần thêm !important để ghi đè mạnh hơn style mặc định */

.dropdown-content {
    padding: 10px;
    background: white;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

/* Điều chỉnh style cho bảng trong dropdown */
:deep(.product-dropdown .ant-table) {
    margin: -8px -8px -8px -8px;
}

:deep(.product-dropdown .ant-table-container) {
    border: none !important;
}

:deep(.product-dropdown .ant-table-thead > tr > th) {
    background: #fafafa;
    position: sticky;
    top: 0;
    z-index: 1;
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