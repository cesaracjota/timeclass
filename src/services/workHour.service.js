import axios from "axios";
import { CustomToast } from "../utils/CustomToast";
import authService from "./auth.service";

const baseURL = import.meta.env.VITE_API_URL;

const getAllWorkHours = async ({ token, page = 1, limit = 10, search = "" }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search) params.append("search", search);

        const response = await axios.get(`${baseURL}/work-hours?${params.toString()}`, config);
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message:
                error.response?.data?.error || "Error al recuperar las horas de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });

        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }

        throw error;
    }
};

const getWorkHourById = async (id, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // aquí nos aseguramos de mandar el token
            },
        };
        const response = await axios.get(`${baseURL}/work-hours/${id}`, config);
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al recuperar la hora de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }
        throw error;
    }
};

const getWorkHourByTeacherId = async (id, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${baseURL}/work-hours/teacher/${id}`, config);
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al recuperar mis horas de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }
        throw error;
    }
};

const getWorkHoursByMonthWeekDay = async (id, data, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${baseURL}/work-hours/month-week-day/${id}`, data, config);
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al recuperar las horas de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        throw error;
    }
}

const getWorkHoursByStatus = async ({token, page = 1, limit = 10, estado = "", search = ""}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: page,
                limit: limit,
                estado: estado || "PENDING",
                search: search || ""
            }
        }

        const response = await axios.get(`${baseURL}/work-hours/status`, config);
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al recuperar las horas de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",        
        });
        // if (error.response?.status === 401) {
        //     setTimeout(() => {
        //         authService.logout();
        //         window.location.reload();
        //     }, 2000);
        // }
        throw error;
    }
};

const create = async (data, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${baseURL}/work-hours`, data, config);
        if (response.status === 201 || response.status === 200) {
            CustomToast({
                title: "Éxito",
                message: "La hora de trabajo se ha creado correctamente.",
                type: "success",
                duration: 2500,
                position: "top",
            });
            return response.data;
        }
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al crear la hora de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }
        throw error;
    }
};

const uploadWorkHours = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append("file", file); // "file" debe coincidir con el nombre del campo esperado en tu backend

        const config = {
            headers: {
                "Content-Type": "multipart/form-data", // puedes omitir esto, Axios lo establece automáticamente
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.post(`${baseURL}/work-hours/import`, formData, config);

        if (response.status === 201 || response.status === 200) {
            CustomToast({
                title: "Éxito",
                message: `Se han importado ${response.data.academy.totalImported || response.data.school.totalImported} registros de un total de ${response.data.academy.total || response.data.school.total} registros y se han saltado ${response.data.academy.totalSkipped || response.data.school.totalSkipped} registros.`,
                type: "success",
                duration: 3500,
                position: "top",
            });
            return response.data;
        }
    } catch (error) {
        console.error(error);
        CustomToast({
            title: "Error",
            message: error.response?.data?.message || "Error al subir el archivo.",
            type: "error",
            duration: 2500,
            position: "top",
        });

        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }

        throw error;
    }
};

const update = async (data, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(
            `${baseURL}/work-hours/${data.id}`,
            data.data,
            config
        );
        if (response.status === 200 || response.status === 201) {
            CustomToast({
                title: "Éxito",
                message: "La hora de trabajo se ha actualizado correctamente.",
                type: "success",
                duration: 2500,
                position: "top",
            });
            return response.data;
        }
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al actualizar la hora de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        throw error;
    }
};

const updateStatus = async (id, estado, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${baseURL}/work-hours/status/${id}`, { estado }, config);
        if (response.status === 200 || response.status === 201) {
            CustomToast({
                title: "Éxito",
                message: "El estado de la hora de trabajo se ha actualizado correctamente.",
                type: "success",
                duration: 2500,
                position: "top",
            });
            return response.data;
        }
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al actualizar el estado de la hora de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        if (error.response?.status === 401) {
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        }
        throw error;
    }
};

const deleteWorkHour = async (id, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.delete(`${baseURL}/work-hours/${id}`, config);
        if (response.status === 200) {
            CustomToast({
                title: "Éxito",
                message: "La hora de trabajo se ha eliminado correctamente.",
                type: "success",
                duration: 2500,
                position: "top",
            });
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.log(error);
        CustomToast({
            title: "Error",
            message: error.response.data.message || "Error al eliminar la hora de trabajo.",
            type: "error",
            duration: 2500,
            position: "top",
        });
        throw error;
    }
};

const WorkHourService = {
    getAllWorkHours,
    getWorkHourById,
    getWorkHourByTeacherId,
    getWorkHoursByMonthWeekDay,
    getWorkHoursByStatus,
    create,
    uploadWorkHours,
    update,
    updateStatus,
    deleteWorkHour,
};

export default WorkHourService;
