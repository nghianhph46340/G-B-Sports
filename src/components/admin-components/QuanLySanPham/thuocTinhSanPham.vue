<template>
    <div class="product-attributes">
        <a-card>
            <h2 class="page-title">Quản Lý Thuộc Tính Sản Phẩm</h2>

            <a-tabs v-model:activeKey="currentTab">
                <!-- Tab Danh Mục -->
                <a-tab-pane key="category" tab="Danh Mục">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" :placeholder="isEditing ? 'Sửa danh mục' : 'Thêm danh mục mới'" class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="isEditing ? saveEdit() : addNewAttribute">
                                        <template #icon>
                                            <plus-outlined v-if="!isEditing" />
                                            <edit-outlined v-else />
                                        </template>
                                        {{ isEditing ? 'Sửa' : 'Thêm mới' }}
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="getCurrentPageData" :columns="categoryColumns" :pagination="{
                            total: getCurrentItems.length,
                            pageSize: 5,
                            current: currentPage,
                            onChange: onPageChange,
                            showSizeChanger: false
                        }">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'ten_danh_muc'">
                                    <span v-if="!record.isEditing">{{ record.ten_danh_muc }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'trang_thai'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Tab Thương Hiệu -->
                <a-tab-pane key="brand" tab="Thương Hiệu">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" :placeholder="isEditing ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'" class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="isEditing ? saveEdit() : addNewAttribute">
                                        <template #icon>
                                            <plus-outlined v-if="!isEditing" />
                                            <edit-outlined v-else />
                                        </template>
                                        {{ isEditing ? 'Sửa' : 'Thêm mới' }}
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="getCurrentPageData" :columns="brandColumns" :pagination="{
                            total: getCurrentItems.length,
                            pageSize: 5,
                            current: currentPage,
                            onChange: onPageChange,
                            showSizeChanger: false
                        }">
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
                                <template v-else-if="column.key === 'ten_thuong_hieu'">
                                    <span v-if="!record.isEditing">{{ record.ten_thuong_hieu }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Tab Chất Liệu -->
                <a-tab-pane key="material" tab="Chất Liệu">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" :placeholder="isEditing ? 'Sửa chất liệu' : 'Thêm chất liệu mới'" class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="isEditing ? saveEdit() : addNewAttribute">
                                        <template #icon>
                                            <plus-outlined v-if="!isEditing" />
                                            <edit-outlined v-else />
                                        </template>
                                        {{ isEditing ? 'Sửa' : 'Thêm mới' }}
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="getCurrentPageData" :columns="materialColumns" :pagination="{
                            total: getCurrentItems.length,
                            pageSize: 5,
                            current: currentPage,
                            onChange: onPageChange,
                            showSizeChanger: false
                        }">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'ten_chat_lieu'">
                                    <span v-if="!record.isEditing">{{ record.ten_chat_lieu }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'trang_thai'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Tab Màu Sắc -->
                <a-tab-pane key="color" tab="Màu Sắc">
                    <div class="content-area">
                        <div class="add-form">
                            <a-input v-model:value="newAttribute.name" :placeholder="isEditing ? 'Sửa màu sắc' : 'Thêm màu sắc mới'" class="input-field">
                                <template #suffix>
                                    <a-button type="primary" @click="isEditing ? saveEdit() : addNewAttribute">
                                        <template #icon>
                                            <plus-outlined v-if="!isEditing" />
                                            <edit-outlined v-else />
                                        </template>
                                        {{ isEditing ? 'Sửa' : 'Thêm mới' }}
                                    </a-button>
                                </template>
                            </a-input>
                        </div>

                        <a-table :dataSource="getCurrentPageData" :columns="colorColumns" :pagination="{
                            total: getCurrentItems.length,
                            pageSize: 5,
                            current: currentPage,
                            onChange: onPageChange,
                            showSizeChanger: false
                        }">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'ten_mau_sac'">
                                    <span v-if="!record.isEditing">{{ record.ten_mau_sac }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'trang_thai'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
                                        @change="(checked) => handleStatusChange(index, checked)" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <!-- Tab Kích Thước -->
                <a-tab-pane key="size" tab="Kích Thước">
                    <div class="content-area">
                        <div class="add-form">
                            <div class="d-flex gap-2">
                                <a-input v-model:value="newAttribute.value" :placeholder="isEditing ? 'Sửa giá trị' : 'Nhập giá trị'"
                                    class="input-field" style="width: 60%">
                                </a-input>
                                <a-input v-model:value="newAttribute.unit" :placeholder="isEditing ? 'Sửa đơn vị' : 'Nhập đơn vị (tùy chọn)'"
                                    class="input-field" style="width: 30%">
                                </a-input>
                                <a-button type="primary" @click="isEditing ? saveEdit() : addNewAttribute" style="width: 10%">
                                    <template #icon>
                                        <plus-outlined v-if="!isEditing" />
                                        <edit-outlined v-else />
                                    </template>
                                </a-button>
                            </div>
                        </div>

                        <a-table :dataSource="getCurrentPageData" :columns="sizeColumns" :pagination="{
                            total: getCurrentItems.length,
                            pageSize: 5,
                            current: currentPage,
                            onChange: onPageChange,
                            showSizeChanger: false
                        }">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <div class="attribute-actions">
                                        <a-button type="primary" @click="startEdit(index)">
                                            <template #icon><edit-outlined /></template>
                                        </a-button>
                                        <a-button type="primary" danger @click="deleteAttribute(index)">
                                            <template #icon><delete-outlined /></template>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'kich_thuoc'">
                                    <span v-if="!record.isEditing">{{ record.gia_tri }} {{ record.don_vi }}</span>
                                    <a-input v-else v-model:value="record.editName" />
                                </template>
                                <template v-else-if="column.key === 'trang_thai'">
                                    <a-switch v-model:checked="record.status"
                                        :style="{ backgroundColor: record.status ? '#f33b47' : '#ccc' }"
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
const isEditing = ref(false)
const editingItem = ref(null)

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
        key: 'ten_thuong_hieu',
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
        key: 'ten_chat_lieu',
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
        key: 'ten_mau_sac',
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
        title: 'Kích thước',
        dataIndex: 'gia_tri',
        key: 'kich_thuoc',
        width: '25%',
        customRender: ({ record }) => `${record.gia_tri} ${record.don_vi}`
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
    if (isEditing.value) {
        await saveEdit()
        return
    }

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
                    response = await store.addDanhMuc(newAttribute.value.name.trim())
                    break
                case 'brand':
                    response = await store.addThuongHieu(newAttribute.value.name.trim())
                    break
                case 'material':
                    response = await store.addChatLieu(newAttribute.value.name.trim())
                    break
                case 'color':
                    response = await store.addMauSac(newAttribute.value.name.trim())
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
    const item = items[index]
    isEditing.value = true
    editingItem.value = item
    
    switch (currentTab.value) {
        case 'category':
            newAttribute.value.name = item.ten_danh_muc
            break
        case 'brand':
            newAttribute.value.name = item.ten_thuong_hieu
            break
        case 'material':
            newAttribute.value.name = item.ten_chat_lieu
            break
        case 'color':
            newAttribute.value.name = item.ten_mau_sac
            break
        case 'size':
            newAttribute.value.value = item.gia_tri
            newAttribute.value.unit = item.don_vi || ''
            break
    }
}

const saveEdit = async () => {
    if (!editingItem.value) return

    let updateData
    switch (currentTab.value) {
        case 'category':
            updateData = {
                id_danh_muc: editingItem.value.id_danh_muc,
                ma_danh_muc: editingItem.value.ma_danh_muc,
                ten_danh_muc: newAttribute.value.name.trim(),
                trang_thai: editingItem.value.status ? 'Hoạt động' : 'Không hoạt động',
                ngay_tao: editingItem.value.ngay_tao,
                ngay_sua: new Date().toISOString()
            }
            break
        case 'brand':
            updateData = {
                id_thuong_hieu: editingItem.value.id_thuong_hieu,
                ma_thuong_hieu: editingItem.value.ma_thuong_hieu,
                ten_thuong_hieu: newAttribute.value.name.trim(),
                trang_thai: editingItem.value.status ? 'Hoạt động' : 'Không hoạt động',
                ngay_tao: editingItem.value.ngay_tao,
                ngay_sua: new Date().toISOString()
            }
            break
        case 'material':
            updateData = {
                id_chat_lieu: editingItem.value.id_chat_lieu,
                ma_chat_lieu: editingItem.value.ma_chat_lieu,
                ten_chat_lieu: newAttribute.value.name.trim(),
                trang_thai: editingItem.value.status ? 'Hoạt động' : 'Không hoạt động',
                ngay_tao: editingItem.value.ngay_tao,
                ngay_sua: new Date().toISOString()
            }
            break
        case 'color':
            updateData = {
                id_mau_sac: editingItem.value.id_mau_sac,
                ma_mau_sac: editingItem.value.ma_mau_sac,
                ten_mau_sac: newAttribute.value.name.trim(),
                trang_thai: editingItem.value.status ? 'Hoạt động' : 'Không hoạt động',
                ngay_tao: editingItem.value.ngay_tao,
                ngay_sua: new Date().toISOString()
            }
            break
        case 'size':
            updateData = {
                id_kich_thuoc: editingItem.value.id_kich_thuoc,
                ma_kich_thuoc: editingItem.value.ma_kich_thuoc,
                gia_tri: newAttribute.value.value.trim(),
                don_vi: newAttribute.value.unit.trim(),
                trang_thai: editingItem.value.status ? 'Hoạt động' : 'Không hoạt động',
                ngay_tao: editingItem.value.ngay_tao,
                ngay_sua: new Date().toISOString()
            }
            break
    }

    try {
        let response
        switch (currentTab.value) {
            case 'category':
                response = await store.updateDanhMuc(updateData)
                break
            case 'brand':
                response = await store.updateThuongHieu(updateData)
                break
            case 'material':
                response = await store.updateChatLieu(updateData)
                break
            case 'color':
                response = await store.updateMauSac(updateData)
                break
            case 'size':
                response = await store.updateKichThuoc(updateData)
                break
        }

        if (!response.success) {
            message.error(response.message || 'Có lỗi xảy ra khi cập nhật')
            return
        }

        message.success('Cập nhật thành công!')
        resetForm()
        await loadCurrentTab()
    } catch (error) {
        console.error('Error updating:', error)
        message.error('Có lỗi xảy ra khi cập nhật')
    }
}

const resetForm = () => {
    isEditing.value = false
    editingItem.value = null
    newAttribute.value = {
        name: '',
        value: '',
        unit: ''
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

const handleStatusChange = async (index, checked) => {
    const items = getCurrentItems.value
    const item = items[index]

    // Optimistic update - cập nhật UI trước
    item.status = checked
    item.trang_thai = checked ? 'Hoạt động' : 'Không hoạt động'

    try {
        // Gọi API tương ứng theo tab
        switch (currentTab.value) {
            case 'category':
                await store.changeTrangThaiDanhMuc(item.id_danh_muc)
                break
            case 'brand':
                await store.changeTrangThaiThuongHieu(item.id_thuong_hieu)
                break
            case 'material':
                await store.changeTrangThaiChatLieu(item.id_chat_lieu)
                break
            case 'color':
                await store.changeTrangThaiMauSac(item.id_mau_sac)
                break
            case 'size':
                await store.changeTrangThaiKichThuoc(item.id_kich_thuoc)
                break
        }
    } catch (error) {
        // Nếu lỗi, hoàn tác UI
        item.status = !checked
        item.trang_thai = !checked ? 'Hoạt động' : 'Không hoạt động'
        message.error('Có lỗi xảy ra khi chuyển trạng thái')
    }
}

const currentPage = ref(1)

const getCurrentPageData = computed(() => {
    const items = getCurrentItems.value
    const startIndex = (currentPage.value - 1) * 5
    const endIndex = startIndex + 5
    return items.slice(startIndex, endIndex)
})

const onPageChange = (page) => {
    currentPage.value = page
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