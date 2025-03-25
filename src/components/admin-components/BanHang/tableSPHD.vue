<template>
    <div class="table container">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Hình Ảnh</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá bán</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="row"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { useGbStore } from '@/stores/gbStore';
import { onMounted, watch } from 'vue';

export default {        
    setup() {
        const store = useGbStore();
        return {
            store
        }
    }
}
</script>

<style lang="scss" scoped></style>