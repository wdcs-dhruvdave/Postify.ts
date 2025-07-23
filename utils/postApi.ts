import axios from "axios";
import { CreatePostModal } from "@/components/CreatePostModal";
import { PostFormData } from "@/types/post.types";

const apiClient = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createPost = async(data: PostFormData) => {
    try{
        const response = await apiClient.post('/posts', data);
        return response.data;
    }
    catch(error: any){
        throw new Error(error.response?.data?.message || 'Post creation failed.');
    }
}

export const getPosts = async () => {
  try {
    const response = await apiClient.get('/posts');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts.');
  }
};

