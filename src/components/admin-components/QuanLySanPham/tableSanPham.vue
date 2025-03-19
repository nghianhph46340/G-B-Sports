<template>
    <!-- <a-space align="center" style="margin-bottom: 16px">
        CheckStrictly:
        <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space> -->
    <!-- <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :expandable="expandableConfig"
        class="components-table-demo-nested" /> -->
    <div>
        <menuAction />
        <a-table :columns="columns" :row-selection="rowSelection" :data-source="data"
            class="components-table-demo-nested" :expandable="expandableConfig" @expand="handleExpand">
            <template #expandedRowRender="{ record }">
                {{ record.id_san_pham }}
                <a-table :columns="columnsCTSP" :row-selection="{
                    selectedRowKeys: rowSelection.selectedRowKeys,
                    onChange: (selectedRowKeys) => {
                        rowSelection.selectedRowKeys = selectedRowKeys;
                    }
                }" :data-source="productCTSPMap.get(record.id_san_pham) || []" :pagination="false" size="small">
                    <template #bodyCell="{ column, record: ctspRecord }">
                        <template v-if="column.key === 'trang_thai'">
                            <a-switch
                                :style="{ backgroundColor: ctspRecord.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                                size="small" :checked="ctspRecord.trang_thai === 'Hoạt động' ? true : false" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <a-button @click="showDrawer" type="" style="color: white;"
                                class="d-flex align-items-center btn btn-warning">
                                <EditOutlined />Sửa
                            </a-button>
                            <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
                                :root-style="{ color: 'black' }" title="Chi tiết sản phẩm" placement="left"
                                @after-open-change="afterOpenChange" :footer-style="{ textAlign: 'right' }">
                                <a-form :model="productDetails" layout="vertical" @submit.prevent="handleSubmit">
                                    <a-form-item label="Tên sản phẩm" name="ten_san_pham">
                                        <a-input v-model:value="productDetails.ten_san_pham"
                                            placeholder="Nhập tên sản phẩm" />
                                    </a-form-item>

                                    <a-form-item label="Danh mục" name="danh_muc_id">
                                        <a-select v-model:value="productDetails.danh_muc_id"
                                            placeholder="Chọn danh mục">
                                            <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc"
                                                :value="item.id_danh_muc">
                                                {{ item.ten_danh_muc }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>

                                    <a-form-item label="Giá bán" name="gia_ban">
                                        <a-input-number v-model:value="productDetails.gia_ban"
                                            placeholder="Nhập giá bán" style="width: 100%;" />
                                    </a-form-item>

                                    <!-- Thêm các trường khác tương tự -->

                                    <a-form-item>
                                        <a-button type="primary" html-type="submit">Lưu</a-button>
                                        <a-button @click="closeDrawer">Hủy</a-button>
                                    </a-form-item>
                                </a-form>


                            </a-drawer>


                        </template>
                    </template>
                </a-table>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'trang_thai'">
                    <a-switch @change="(checked) => changeStatusSanPham(record.id_san_pham, checked)"
                        :style="{ backgroundColor: record.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                        :checked="record.trang_thai === 'Hoạt động' ? true : false" />
                </template>
                <template v-if="column.key === 'hinh_anh'">
                    <a-image style="width: 40px; height: 40px;" :src="record.hinh_anh" />
                </template>
                <template v-if="column.key === 'gia_ban'">
                    {{ record.gia_ban }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="" @click="changeRouter(record.id_san_pham)" style="color: white;"
                        class="d-flex align-items-center btn btn-warning">
                        <EditOutlined />Sửa
                    </a-button>
                </template>
            </template>


        </a-table>
    </div>

</template>
<script setup>
import menuAction from '@/components/admin-components/QuanLySanPham/menuAction.vue';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, render } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const open = ref(false);
const store = useGbStore();

const changeRouter = (path) => {
    router.push('/admin/quanlysanpham/update/' + path);
}
const productDetails = ref({
    ten_san_pham: '',
    danh_muc_id: null,
    gia_ban: null,
    // Thêm các trường khác
});
function handleSubmit() {
    // Xử lý logic lưu sản phẩm
    console.log('Product details:', productDetails.value);
    // Gọi; API hoặc cập nhật store
};
function closeDrawer() {
    open.value = false;
};
const danhMucList = ref([]);
const addVariant = () => {
    variants.value.push({
        mau_sac_id: undefined,
        size_id: undefined,
        so_luong: 0,
        gia_ban: 0,
        trang_thai: true,
        fileList: [],
        hinh_anh: []
    });
};


const variants = ref([]);



const resetForm = () => {
    Object.keys(formState).forEach(key => {
        formState[key] = '';
    });
    fileList.value = [];
    variants.value = [];
    variants.value = variants.value.map(variant => ({
        ...variant,
        fileList: [],
        hinh_anh: []
    }));
};
const removeVariant = (index) => {
    variants.value.splice(index, 1);
};
const handleVariantImageChange = async (info, variantIndex) => {
    const { fileList } = info;

    // Giới hạn số lượng file
    const limitedFileList = fileList.slice(0, 3);

    // Cập nhật fileList cho biến thể
    variants.value[variantIndex].fileList = limitedFileList;

    // Xử lý các file đã upload thành công
    const successFiles = limitedFileList.filter(file => file.status === 'done');
    variants.value[variantIndex].hinh_anh = successFiles.map(file => file.response.url);

    // Thông báo kết quả
    const lastFile = info.file;
    if (lastFile.status === 'done') {
        message.success(`${lastFile.name} đã được tải lên thành công`);
    } else if (lastFile.status === 'error') {
        message.error(`${lastFile.name} tải lên thất bại`);
    }
};
const onFinish = async (values) => {
    loading.value = true;
    try {
        // Tạo sản phẩm chính
        const response = await store.createProduct(formState);
        const productId = response.id_san_pham;

        // Tạo các biến thể CTSP với hình ảnh
        if (variants.value.length > 0) {
            const ctspPromises = variants.value.map(variant => {
                return store.createCTSP({
                    ...variant,
                    id_san_pham: productId,
                    hinh_anh: variant.hinh_anh
                });
            });

            await Promise.all(ctspPromises);
        }

        message.success('Thêm sản phẩm và biến thể thành công!');
        resetForm();
    } catch (error) {
        message.error('Có lỗi xảy ra khi thêm sản phẩm!');
        console.error(error);
    } finally {
        loading.value = false;
    }
};
const showDrawer = () => {
    open.value = true;
}
const handleExpand = async (expanded, record) => {
    console.log("Record được truyền vào:", record); // Kiểm tra record
    if (expanded) {
        try {
            // Đảm bảo record.id_san_pham có giá trị
            if (!record.id_san_pham) {
                console.error("id_san_pham không tồn tại trong record:", record);
                return;
            }
            await getCTSPForProduct(record);

            // Nếu sản phẩm cha đã được chọn, tự động chọn tất cả CTSP
            if (rowSelection.value.selectedRowKeys.includes(record.key)) {
                const childItems = productCTSPMap.value.get(record.id_san_pham) || [];
                const childKeys = childItems.map(item => item.key);
                const currentKeys = [...rowSelection.value.selectedRowKeys];

                // Thêm các key chưa có trong danh sách
                let hasNewKeys = false;
                childKeys.forEach(key => {
                    if (!currentKeys.includes(key)) {
                        currentKeys.push(key);
                        hasNewKeys = true;
                    }
                });

                // Cập nhật selectedRowKeys nếu có thay đổi
                if (hasNewKeys) {
                    rowSelection.value.selectedRowKeys = currentKeys;
                }
            }
        } catch (error) {
            console.error("Lỗi khi mở rộng:", error);
        }
    }
};

const columns = [
    {
        title: '#',
        dataIndex: 'stt',
        key: 'stt',
        width: '5%',
        align: 'center',
        render: (text, record, index) => index + 1
    },
    {
        title: 'Mã sản phẩm',
        dataIndex: 'ma_san_pham',
        key: 'ma_san_pham',
        width: '9%',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
        width: '17%',
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'hinh_anh',
        width: '10%',
        key: 'hinh_anh',
        width: '10%',
    },
    {
        title: 'SL',
        dataIndex: 'tong_so_luong',
        key: 'tong_so_luong',
        width: '7%',
    },
    {
        title: 'Giới tính',
        dataIndex: 'gioi_tinh',
        key: 'gioi_tinh',
        width: '10%',
    },

    {
        title: 'Danh mục/Thương hiệu/Chất liệu',
        dataIndex: 'chi_muc',
        key: 'chi_muc',
        width: '28%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
        width: '10%',

    },

    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        width: '30%',
    },

];
const columnsCTSP = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
    },
    {
        title: 'Màu sắc',
        dataIndex: 'mau_sac',
        key: 'mau_sac',
    },
    {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
    },
    {
        title: 'Số lượng',
        dataIndex: 'so_luong',
        key: 'so_luong',
    },
    {
        title: 'Giá',
        dataIndex: 'gia_ban',
        key: 'gia_ban'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },

];
const data = ref([]);
const rowSelection = ref({
    checkStrictly: false,
    selectedRowKeys: [],
    selectedRows: [],
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        rowSelection.value.selectedRowKeys = selectedRowKeys;
        rowSelection.value.selectedRows = selectedRows;
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
        console.log(record, selected, selectedRows);

        // Nếu đang chọn một sản phẩm cha
        if (record.id_san_pham && selected) {
            // Lấy các chi tiết sản phẩm cho sản phẩm này
            const childItems = productCTSPMap.value.get(record.id_san_pham) || [];

            // Thêm tất cả key của con vào selectedRowKeys
            const childKeys = childItems.map(item => item.key);
            const currentKeys = [...rowSelection.value.selectedRowKeys];

            // Thêm các key chưa có trong danh sách
            childKeys.forEach(key => {
                if (!currentKeys.includes(key)) {
                    currentKeys.push(key);
                }
            });

            // Cập nhật selectedRowKeys
            rowSelection.value.selectedRowKeys = currentKeys;
        }

        // Nếu bỏ chọn một sản phẩm cha
        if (record.id_san_pham && !selected) {
            // Lấy các chi tiết sản phẩm cho sản phẩm này
            const childItems = productCTSPMap.value.get(record.id_san_pham) || [];

            // Xóa tất cả key của con khỏi selectedRowKeys
            const childKeys = childItems.map(item => item.key);
            let currentKeys = [...rowSelection.value.selectedRowKeys];

            // Lọc bỏ các key của con
            currentKeys = currentKeys.filter(key => !childKeys.includes(key));

            // Cập nhật selectedRowKeys
            rowSelection.value.selectedRowKeys = currentKeys;
        }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
});

// Hàm format dữ liệu CTSP
const formatCTSPData = (ctspList) => {
    return ctspList.map(item => ({
        key: item.id_chi_tiet_san_pham,
        ten_san_pham: item.ten_san_pham,
        hinh_anh: item.hinh_anh,
        gia_ban: item.gia_ban,
        mau_sac: item.ten_mau,
        size: item.gia_tri + ' ' + item.don_vi,
        so_luong: item.so_luong,
        trang_thai: item.trang_thai,
    }));
};
// Thêm ref để lưu trữ CTSP cho từng sản phẩm
const productCTSPMap = ref(new Map());
const getCTSPForProduct = async (record) => {
    if (!productCTSPMap.value.has(record.id_san_pham)) {
        // Nếu chưa có data CTSP cho sản phẩm này, gọi API để lấy
        await store.getCTSPBySanPham(record.id_san_pham);
        const ctspList = store.getCTSPBySanPhams.map(ctsp => ({
            key: ctsp.id_chi_tiet_san_pham,
            id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
            ten_san_pham: ctsp.ten_san_pham,
            hinh_anh: ctsp.hinh_anh,
            gia_ban: ctsp.gia_ban,
            mau_sac: ctsp.ten_mau,
            size: ctsp.gia_tri + ' ' + ctsp.don_vi,
            so_luong: ctsp.so_luong,
            trang_thai: ctsp.trang_thai,
        }));
        productCTSPMap.value.set(record.id_san_pham, ctspList);
    }
    return productCTSPMap.value.get(record.id_san_pham) || [];
    // try {
    //     console.log("Gọi API với id:", record.id_san_pham); // Kiểm tra id trước khi gọi API
    //     await store.getCTSPBySanPham(record.id_san_pham);
    //     return store.getCTSPBySanPhams || [];
    // } catch (error) {
    //     console.error("Lỗi trong getCTSPForProduct:", error);
    //     return [];
    // }
};
const expandableConfig = {
    expandIcon: () => null,
    defaultExpandAllRows: false,
    expandRowByClick: true,
    onExpandedRowsChange: (expandedRows) => {
        console.log("Các row đang mở rộng:", expandedRows);
    },
    onExpand: async (expanded, record) => {
        if (expanded) {
            console.log("Đang mở rrộng")
            await getCTSPForProduct(record);
        }
        else {
            console.log("Lỗi")
        }
    },
};

const changeStatusSanPham = async (id, checked) => {
    try {
        await store.changeStatusSanPham(id);
        data.value = data.value.map(item => {
            if (item.id_san_pham === id) {
                return {
                    ...item,
                    trang_thai: checked ? 'Hoạt động' : 'Không hoạt động'

                };

            }
            return item;
        })
    } catch (error) {
        console.log('Lỗi khi thay đổi trạng thái')
    }

}
const afterOpenChange = bool => {
    console.log('open', bool);
};

const handleOk = e => {
    console.log(e);
    open.value = false;
};
onMounted(async () => {
    await store.getAllSP();
    data.value = await Promise.all(store.getAllSanPham.map(async (item, index) => {
        return {
            stt: index + 1,
            key: item.id_san_pham,
            id_san_pham: item.id_san_pham,
            ma_san_pham: item.ma_san_pham,
            ten_san_pham: item.ten_san_pham,
            gioi_tinh: item.gioi_tinh ? "Nam" : "Nữ",
            hinh_anh: item.hinh_anh,
            chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
            trang_thai: item.trang_thai,
            tong_so_luong: item.tong_so_luong,
        };
    }));

});
</script>
<style scoped>
:deep(.ctsp-table) {

    /* Giảm padding của header */
    .ant-table-thead>tr>th {
        padding: 8px;
        font-size: 13px;
    }

    /* Giảm padding của cells */
    .ant-table-tbody>tr>td {
        padding: 6px 8px;
        font-size: 12px;
    }

    /* Style cho header */
    .ant-table-thead>tr>th {
        background: #f5f5f5;
        font-weight: 600;
    }

    /* Thêm border và màu nền nhẹ */
    .ant-table {
        border: 1px solid #f0f0f0;
        background: #fafafa;
    }
}

.custom-class {
    z-index: 1000;
}

/* Style cho phần mở rộng */
/* :deep(.ant-table-expanded-row) {
    background: #fafafa;
}

:deep(.ant-table-expanded-row > td) {
    padding: 16px 24px;
} */
</style>