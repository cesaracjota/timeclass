import axios from "axios";
import { CustomToast } from "../utils/CustomToast";

const baseURL = import.meta.env.VITE_API_URL;

const getSettings = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.get(`${baseURL}/setting`, config);
    return response.data;
};

const createAndUpdateSettings = async (token, settings) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(`${baseURL}/setting`, settings, config);
    if (response.status === 200 || response.status === 201) {
        CustomToast({
            title: "Ajustes actualizados",
            message: "Ajustes actualizados correctamente",
            type: "success",
            duration: 2500,
        });
    }
    return response.data;
};

const settingService = {
    getSettings,
    createAndUpdateSettings
};

export default settingService;