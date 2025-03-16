import axiosInstance from "@/config/axiosConfig";

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/testImage?file=', formData);
    return response.data;
}
const deleteImage = async (publicId) => {
    const response = await axiosInstance.delete('testDeleteImage?publicId=' + publicId);
    return response.data;
}
export const testService = {
    uploadImage,
    deleteImage
}
