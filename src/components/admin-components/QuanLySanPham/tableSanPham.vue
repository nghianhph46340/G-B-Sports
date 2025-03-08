<template>
    <!-- <a-space align="center" style="margin-bottom: 16px">
        CheckStrictly:
        <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space> -->
    <!-- <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :expandable="expandableConfig"
        class="components-table-demo-nested" /> -->
    <a-table :columns="columns" :row-selection="rowSelection" :data-source="data" class="components-table-demo-nested"
        :expandable="expandableConfig" @expand="handleExpand">
        <template #expandedRowRender="{ record }">
            {{ record.id_san_pham }}
            <a-table :columns="columnsCTSP" :row-selection="rowSelection"
                :data-source="productCTSPMap.get(record.id_san_pham) || []" :pagination="false" size="small">
                <template #bodyCell="{ column, record: ctspRecord }">
                    <template v-if="column.key === 'trang_thai'">
                        <a-switch :checked="ctspRecord.trang_thai === 'Còn hàng' ? true : false" />
                    </template>

                </template>
            </a-table>
        </template>
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'trang_thai'">
                <a-switch :checked="record.trang_thai === 'Hoạt động' ? true : false" />
            </template>
            <template v-if="column.key === 'hinh_anh'">
                <a-image style="width: 40px; height: 40px;" :src="record.hinh_anh" />
            </template>
            <template v-if="column.key === 'gia_ban'">
                {{ record.gia_ban }}
            </template>
        </template>


    </a-table>
</template>
<script setup>
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
        } catch (error) {
            console.error("Lỗi khi mở rộng:", error);
        }
    }
};
import { onMounted, ref } from 'vue';
import { useGbStore } from '@/stores/gbStore';
const store = useGbStore();
const columns = [
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
        width: '15%',
    },
    {
        title: 'Giới tính',
        dataIndex: 'gioi_tinh',
        key: 'gioi_tinh',
        width: '10%',
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'hinh_anh',
        width: '10%',
        key: 'hinh_anh',
        width: '10%',
    },
    {
        title: 'Danh mục/Thương hiệu/Chất liệu',
        dataIndex: 'chi_muc',
        key: 'chi_muc',
        width: '23%',
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
const innerData = ref([]);
const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
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
onMounted(async () => {
    await store.getAllSP();
    data.value = await Promise.all(store.getAllSanPham.map(async (item) => {

        return {
            key: item.id_san_pham,
            id_san_pham: item.id_san_pham,
            ma_san_pham: item.ma_san_pham,
            ten_san_pham: item.ten_san_pham,
            gioi_tinh: item.gioi_tinh ? "Nam" : "Nữ",
            hinh_anh: item.hinh_anh,
            chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
            trang_thai: item.trang_thai,
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

/* Style cho phần mở rộng */
/* :deep(.ant-table-expanded-row) {
    background: #fafafa;
}

:deep(.ant-table-expanded-row > td) {
    padding: 16px 24px;
} */
</style>