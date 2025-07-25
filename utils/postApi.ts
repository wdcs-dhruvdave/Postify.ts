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

export const getCategories = async () => {
  try{
    const response = await apiClient.get('/posts/categories');
    return response.data;
  }
  catch(error: any){
    throw new Error(error.response?.data?.message || 'Failed to fetch categories.');
  }
}

export const getPosts = async () => {
  try {
    const response = await apiClient.get('/posts', {
      params: {
        _: new Date().getTime(),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts.');
  }
};

export const getFeed = async () => {
  try {
    const response = await apiClient.get('/posts/feed'); 
    console.log("🚀 ~ getFeed ~ response:", response)
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feed.');
  }
};

export const likePost = async (postId : string) =>{
  try{
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data
  }
  catch(error:any){
    throw new Error(error.response?.data?.message || 'Failed to Like The Post')
  }
}

export const unlikePost = async (postId:string) =>{
  try{
    const response = await apiClient.delete(`/posts/${postId}/like`)
    return response.data
  }
  catch(error:any){
    throw new Error(error.response?.data?.message || 'Failed to Unlike The Post')
  }
}

export const dislikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/posts/${postId}/dislike`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to Dislike The Post');
  }
};

export const undislikePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}/dislike`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to Remove Dislike');
  }
};

export const getComments = async (postId: string) => {
  const response = await apiClient.get(`/comments/${postId}`);
  return response.data;
};

export const createComment = async (postId: string, content_text: string) => {
  const response = await apiClient.post(`/comments/${postId}`, { content_text });
  return response.data;
};
