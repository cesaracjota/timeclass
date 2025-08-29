import axios from "axios";
import { CustomToast } from "../utils/CustomToast";

const baseURL = import.meta.env.VITE_API_URL;

const create = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(`${baseURL}/claims`, data, config);
    if (response.status === 201) {
        CustomToast({
            title: "Reclamo creado",
            message: "Reclamo creado correctamente",
            type: "success",
            duration: 2500,
        });
    }
    return response.data;
};

const createComment = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(`${baseURL}/claims/comments`, data, config);
    return response.data;
};

const getByWorkHourId = async (workHourId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.get(`${baseURL}/claims/work-hour/${workHourId}`, config);
    return response.data;
};

const getAllComments = async (claimId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.get(`${baseURL}/claims/comments/${claimId}`, config);
    return response.data;
};

export default { create, createComment, getByWorkHourId, getAllComments };

