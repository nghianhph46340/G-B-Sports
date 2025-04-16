<template>
    <div class="product-attributes">
        <a-card>
            <h2 class="page-title">Quản Lý Thuộc Tính Sản Phẩm</h2>

            <a-tabs v-model:activeKey="currentTab">
                <!-- Danh mục -->
                <a-tab-pane key="category" tab="Danh Mục">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" placeholder="Thêm danh mục mới"
                                class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="addNewAttribute">
                                        <plus-outlined />
                                        Thêm mới
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="categories" :columns="categoryColumns" :pagination="false">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)" v-if="!record.isEditing">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="success" @click="saveEdit(index)" v-else>
                                            <template #icon><check-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'name'">
                                    <span v-if="!record.isEditing">{{ record.ten_danh_muc }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'trang_thai'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
                                        :checkedChildren="'Hoạt động'" :unCheckedChildren="'Khóa'"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Thương hiệu -->
                <a-tab-pane key="brand" tab="Thương Hiệu">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" placeholder="Thêm thương hiệu mới"
                                class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="addNewAttribute">
                                        <plus-outlined />
                                        Thêm mới
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="brands" :columns="brandColumns" :pagination="false">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)" v-if="!record.isEditing">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="success" @click="saveEdit(index)" v-else>
                                            <template #icon><check-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'name'">
                                    <span v-if="!record.isEditing">{{ record.ten_thuong_hieu }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch v-model:checked="record.status" :checkedChildren="'Hoạt động'"
                                        :unCheckedChildren="'Khóa'"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Chất liệu -->
                <a-tab-pane key="material" tab="Chất Liệu">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" placeholder="Thêm chất liệu mới"
                                class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="addNewAttribute">
                                        <plus-outlined />
                                        Thêm mới
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="materials" :columns="materialColumns" :pagination="false">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)" v-if="!record.isEditing">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="success" @click="saveEdit(index)" v-else>
                                            <template #icon><check-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'name'">
                                    <span v-if="!record.isEditing">{{ record.ten_chat_lieu }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch v-model:checked="record.status" :checkedChildren="'Hoạt động'"
                                        :unCheckedChildren="'Khóa'"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Màu sắc -->
                <a-tab-pane key="color" tab="Màu Sắc">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" placeholder="Thêm màu sắc mới"
                                class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="addNewAttribute">
                                        <plus-outlined />
                                        Thêm mới
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="colors" :columns="colorColumns" :pagination="false">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)" v-if="!record.isEditing">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="success" @click="saveEdit(index)" v-else>
                                            <template #icon><check-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'name'">
                                    <span v-if="!record.isEditing">{{ record.ten_mau_sac }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch v-model:checked="record.status" :checkedChildren="'Hoạt động'"
                                        :unCheckedChildren="'Khóa'"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Kích thước -->
                <a-tab-pane key="size" tab="Kích Thước">
                    <div class="content-area">
                        <div class="add-form">
                            <div class="d-flex gap-2">
                                <a-input v-model:value="newAttribute.value" placeholder="Nhập giá trị"
                                    class="input-field" style="width: 60%">
                                </a-input>
                                <a-input v-model:value="newAttribute.unit" placeholder="Nhập đơn vị (tùy chọn)"
                                    class="input-field" style="width: 30%">
                                </a-input>
                                <a-button type="primary" @click="addNewAttribute" style="width: 10%">
                                    <plus-outlined />
                                </a-button>
                            </div>
                        </div>

                        <a-table :dataSource="sizes" :columns="sizeColumns" :pagination="false">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)" v-if="!record.isEditing">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="success" @click="saveEdit(index)" v-else>
                                            <template #icon><check-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'name'">
                                    <span v-if="!record.isEditing">{{ record.gia_tri + ' ' + record.don_vi }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch v-model:checked="record.status" :checkedChildren="'Hoạt động'"
                                        :unCheckedChildren="'Khóa'"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useGbStore } from '../../../stores/gbStore'
import { storeToRefs } from 'pinia'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const store = useGbStore()
const currentTab = ref('category')

// Cấu hình cột cho từng bảng
const categoryColumns = [
    {
        title: 'Mã danh mục',
        dataIndex: 'ma_danh_muc',
        key: 'ma_danh_muc',
        width: '15%'
    },
    {
        title: 'Tên danh mục',
        dataIndex: 'ten_danh_muc',
        key: 'ten_danh_muc',
        width: '25%'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
        width: '15%'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        width: '15%',
        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
        title: 'Ngày sửa',
        dataIndex: 'ngay_sua',
        key: 'ngay_sua',
        width: '15%',
        render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: '15%'
    }
]

const brandColumns = [
    {
        title: 'Mã thương hiệu',
        dataIndex: 'ma_thuong_hieu',
        key: 'ma_thuong_hieu',
        width: '15%'
    },
    {
        title: 'Tên thương hiệu',
        dataIndex: 'ten_thuong_hieu',
        key: 'name',
        width: '25%'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'status',
        width: '15%'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        width: '15%',
        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
        title: 'Ngày sửa',
        dataIndex: 'ngay_sua',
        key: 'ngay_sua',
        width: '15%',
        render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: '15%'
    }
]

const materialColumns = [
    {
        title: 'Mã chất liệu',
        dataIndex: 'ma_chat_lieu',
        key: 'ma_chat_lieu',
        width: '15%'
    },
    {
        title: 'Tên chất liệu',
        dataIndex: 'ten_chat_lieu',
        key: 'name',
        width: '25%'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'status',
        width: '15%'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        width: '15%',
        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
        title: 'Ngày sửa',
        dataIndex: 'ngay_sua',
        key: 'ngay_sua',
        width: '15%',
        render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: '15%'
    }
]

const colorColumns = [
    {
        title: 'Mã màu sắc',
        dataIndex: 'ma_mau_sac',
        key: 'ma_mau_sac',
        width: '15%'
    },
    {
        title: 'Tên màu sắc',
        dataIndex: 'ten_mau_sac',
        key: 'name',
        width: '25%'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'status',
        width: '15%'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        width: '15%',
        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
        title: 'Ngày sửa',
        dataIndex: 'ngay_sua',
        key: 'ngay_sua',
        width: '15%',
        render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: '15%'
    }
]

const sizeColumns = [
    {
        title: 'Mã kích thước',
        dataIndex: 'ma_kich_thuoc',
        key: 'ma_kich_thuoc',
        width: '15%'
    },
    {
        title: 'Giá trị',
        dataIndex: 'gia_tri',
        key: 'name',
        width: '20%'
    },
    {
        title: 'Đơn vị',
        dataIndex: 'don_vi',
        key: 'don_vi',
        width: '15%'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'status',
        width: '15%'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        width: '15%',
        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
        title: 'Ngày sửa',
        dataIndex: 'ngay_sua',
        key: 'ngay_sua',
        width: '15%',
        render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : ''
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: '15%'
    }
]

// Data states
const categories = ref([])
const brands = ref([])
const materials = ref([])
const colors = ref([])
const sizes = ref([])

// Load data khi component được mount
onMounted(async () => {
    try {
        await Promise.all([
            loadCategories(),
            loadBrands(),
            loadMaterials(),
            loadColors(),
            loadSizes()
        ])
    } catch (error) {
        console.error('Error loading data:', error)
        message.error('Có lỗi khi tải dữ liệu')
    }
})

// Load functions
async function loadCategories() {
    try {
        const response = await store.getAllDM()
        categories.value = response.map(item => ({
            ...item,
            key: item.id_danh_muc,
            isEditing: false,
            editName: '',
            status: item.trang_thai === 'Hoạt động'
        }))
    } catch (error) {
        console.error('Error loading categories:', error)
        message.error('Không thể tải danh sách danh mục')
    }
}

async function loadBrands() {
    try {
        const response = await store.getAllTH()
        brands.value = response.map(item => ({
            ...item,
            key: item.id_thuong_hieu,
            isEditing: false,
            editName: '',
            status: item.trang_thai === 'Hoạt động'
        }))
    } catch (error) {
        console.error('Error loading brands:', error)
        message.error('Không thể tải danh sách thương hiệu')
    }
}

async function loadMaterials() {
    try {
        const response = await store.getAllCL()
        materials.value = response.map(item => ({
            ...item,
            key: item.id_chat_lieu,
            isEditing: false,
            editName: '',
            status: item.trang_thai === 'Hoạt động'
        }))
    } catch (error) {
        console.error('Error loading materials:', error)
        message.error('Không thể tải danh sách chất liệu')
    }
}

async function loadColors() {
    try {
        const response = await store.getAllMS()
        colors.value = response.map(item => ({
            ...item,
            key: item.id_mau_sac,
            isEditing: false,
            editName: '',
            status: item.trang_thai === 'Hoạt động'
        }))
    } catch (error) {
        console.error('Error loading colors:', error)
        message.error('Không thể tải danh sách màu sắc')
    }
}

async function loadSizes() {
    try {
        const response = await store.getAllKT()
        sizes.value = response.map(item => ({
            ...item,
            key: item.id_kich_thuoc,
            isEditing: false,
            editName: '',
            status: item.trang_thai === 'Hoạt động'
        }))
    } catch (error) {
        console.error('Error loading sizes:', error)
        message.error('Không thể tải danh sách kích thước')
    }
}

// New attribute input
const newAttribute = ref({
    name: '', // for other tabs
    value: '', // for size value
    unit: ''  // for size unit
})

// Get current items based on selected tab
const getCurrentItems = computed(() => {
    switch (currentTab.value) {
        case 'category': return categories.value
        case 'brand': return brands.value
        case 'material': return materials.value
        case 'color': return colors.value
        case 'size': return sizes.value
        default: return []
    }
})

// Methods for managing attributes
const addNewAttribute = async () => {
    let response;
    
    switch (currentTab.value) {
        case 'size':
            // Validate cho kích thước
            if (!newAttribute.value.value.trim()) {
                message.warning('Vui lòng nhập giá trị kích thước!')
                return
            }

            // Kiểm tra trùng giá trị
            const isDuplicateSize = sizes.value.some(item => 
                item.gia_tri?.toLowerCase() === newAttribute.value.value.trim().toLowerCase() &&
                item.don_vi?.toLowerCase() === (newAttribute.value.unit?.trim() || '').toLowerCase()
            )

            if (isDuplicateSize) {
                message.error('Kích thước này đã tồn tại!')
                return
            }

            response = await store.addKichThuoc(
                newAttribute.value.value.trim(),
                newAttribute.value.unit.trim()
            )
            break

        default:
            // Validate cho các thuộc tính khác
            if (!newAttribute.value.name.trim()) {
                message.warning('Vui lòng nhập tên thuộc tính!')
                return
            }

            // Lấy danh sách hiện tại theo tab
            let currentList = []
            let checkField = ''
            switch (currentTab.value) {
                case 'category': 
                    currentList = categories.value
                    checkField = 'ten_danh_muc'
                    break
                case 'brand': 
                    currentList = brands.value
                    checkField = 'ten_thuong_hieu'
                    break
                case 'material': 
                    currentList = materials.value
                    checkField = 'ten_chat_lieu'
                    break
                case 'color': 
                    currentList = colors.value
                    checkField = 'ten_mau_sac'
                    break
            }

            // Kiểm tra trùng tên
            const isDuplicate = currentList.some(item => 
                item[checkField]?.toLowerCase() === newAttribute.value.name.trim().toLowerCase()
            )

            if (isDuplicate) {
                message.error('Tên này đã tồn tại!')
                return
            }

            // Gọi API thêm mới tương ứng
            switch (currentTab.value) {
                case 'category':
                    response = await store.addDanhMuc({
                        ten_danh_muc: newAttribute.value.name.trim(),
                        trang_thai: 'Hoạt động'
                    })
                    break
                case 'brand':
                    response = await store.addThuongHieu({
                        ten_thuong_hieu: newAttribute.value.name.trim(),
                        trang_thai: 'Hoạt động'
                    })
                    break
                case 'material':
                    response = await store.addChatLieu({
                        ten_chat_lieu: newAttribute.value.name.trim(),
                        trang_thai: 'Hoạt động'
                    })
                    break
                case 'color':
                    response = await store.addMauSac({
                        ten_mau_sac: newAttribute.value.name.trim(),
                        trang_thai: 'Hoạt động'
                    })
                    break
            }
    }

    // Xử lý response
    if (!response.success) {
        message.error(response.message)
        return
    }

    // Reset form
    if (currentTab.value === 'size') {
        newAttribute.value.value = ''
        newAttribute.value.unit = ''
    } else {
        newAttribute.value.name = ''
    }

    // Load lại danh sách tương ứng
    switch (currentTab.value) {
        case 'category': 
            await loadCategories()
            break
        case 'brand':
            await loadBrands()
            break
        case 'material':
            await loadMaterials()
            break
        case 'color':
            await loadColors()
            break
        case 'size':
            await loadSizes()
            break
    }

    message.success('Thêm mới thành công!')
}

const startEdit = (index) => {
    const items = getCurrentItems.value
    items[index].isEditing = true
    items[index].editName = items[index].name
}

const saveEdit = (index) => {
    const items = getCurrentItems.value
    if (items[index].editName.trim()) {
        items[index].name = items[index].editName
        items[index].isEditing = false
        message.success('Cập nhật thành công!')
    } else {
        message.warning('Tên thuộc tính không được để trống!')
    }
}

const deleteAttribute = (index) => {
    const items = getCurrentItems.value
    const itemName = items[index].name

    Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa "${itemName}"?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk() {
            switch (currentTab.value) {
                case 'category': categories.value.splice(index, 1); break
                case 'brand': brands.value.splice(index, 1); break
                case 'material': materials.value.splice(index, 1); break
                case 'color': colors.value.splice(index, 1); break
                case 'size': sizes.value.splice(index, 1); break
            }
            message.success('Xóa thành công!')
        }
    })
}

const handleStatusChange = (index, checked) => {
    const items = getCurrentItems.value
    items[index].status = checked
    message.success(`${items[index].name} đã ${checked ? 'được kích hoạt' : 'bị khóa'}`)
}
</script>

<style scoped>
.product-attributes {
    padding: 20px;
}

.page-title {
    color: #333;
    margin-bottom: 24px;
    font-size: 24px;
}

.add-form {
    margin-bottom: 20px;
}

.input-field {
    width: 100%;
}

.attribute-actions {
    display: flex;
    gap: 8px;
}

:deep(.ant-input-group-addon) {
    padding: 0;
}

:deep(.ant-input-group-addon .ant-btn) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

:deep(.ant-card-body) {
    padding: 24px;
}

:deep(.ant-table-thead > tr > th) {
    background: #f0f2f5;
}

:deep(.ant-switch) {
    min-width: 70px;
    height: 24px;
    line-height: 22px;
    background-color: #ccc;
}

:deep(.ant-switch-checked) {
    background-color: #f33b47 !important;
}

:deep(.ant-switch:hover:not(.ant-switch-disabled)) {
    background-color: #ff6b76;
}

:deep(.ant-switch-handle) {
    width: 20px;
    height: 20px;
}

:deep(.ant-switch-checked .ant-switch-handle) {
    left: calc(100% - 20px - 2px);
}

:deep(.ant-switch-inner) {
    margin: 0 25px 0 7px;
}
</style>