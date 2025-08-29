import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const getAdminDashboard = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.get(`${baseURL}/reports/admin`, config);
    return response.data;
};

const getTeacherDashboard = async (token, teacherId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.get(`${baseURL}/reports/teacher/${teacherId}`, config);
    return response.data;
};

const getWorkHourByTeacherIdAndRangeRange = async (token, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(`${baseURL}/reports/date-range`, data, config);
    return response.data;
}

const reportService = {
    getAdminDashboard,
    getTeacherDashboard,
    getWorkHourByTeacherIdAndRangeRange
};

export default reportService;
