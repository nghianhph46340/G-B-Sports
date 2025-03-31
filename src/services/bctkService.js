// src/services/bctkService.js
import axiosInstance from "@/config/axiosConfig";

   const getSoLieu = async (type = null, startDate = null, endDate = null) => {
        try {
            let params = {};
            
            if (type === 'tuy-chon') {
                params = {
                    type,
                    startDate,
                    endDate
                };
            } else if (type) {
                params = { type };
            }

            const response = await axiosInstance.get('/admin/baoCaoThongKe', { params });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thống kê:', error);
            throw error;
        }
    };
   
    export const bctkService = {
        getSoLieu
    }