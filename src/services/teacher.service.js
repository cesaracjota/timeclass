import axios from "axios";
import { CustomToast } from "../utils/CustomToast";

const baseURL = import.meta.env.VITE_API_URL;

const getAllTeachers = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // aquí nos aseguramos de mandar el token
      },
    };
    const response = await axios.get(`${baseURL}/teachers`, config);
    return response.data;
  } catch (error) {
    console.log(error);
    CustomToast({
      title: "Error",
      message:
        error.response.data.error || "Error al recuperar los usuarios.",
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

const getTeacherById = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // aquí nos aseguramos de mandar el token
      },
    };
    const response = await axios.get(`${baseURL}/teachers/${id}`, config);
    return response.data;
  } catch (error) {
    console.log(error);
    CustomToast({
      title: "Error",
      message: error.response.data.message || "Error al recuperar el usuario.",
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

const searchTeacher = async (search, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseURL}/teachers/search/${search}`, config);
    return response.data;
  } catch (error) {
    console.log(error);
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
    const response = await axios.post(`${baseURL}/teachers`, data, config);
    if (response.status === 201 || response.status === 200) {
      CustomToast({
        title: "Éxito",
        message: "El usuario se ha creado correctamente.",
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
      message: error.response.data.message || "Error al crear el usuario.",
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

const uploadTeachers = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // "file" debe coincidir con el nombre del campo esperado en tu backend

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // puedes omitir esto, Axios lo establece automáticamente
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${baseURL}/teachers/import`, formData, config);

    if (response.status === 201 || response.status === 200) {
      CustomToast({
        title: "Éxito",
        message: response.data.message || "El archivo se ha subido correctamente.",
        type: "success",
        duration: 2500,
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
    console.log(data);
    const response = await axios.put(
      `${baseURL}/teachers/${data.id}`,
      data,
      config
    );
    if (response.status === 200 || response.status === 201) {
      CustomToast({
        title: "Éxito",
        message: "El usuario se ha actualizado correctamente.",
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
      message: error.response.data.message || "Error al actualizar el docente.",
      type: "error",
      duration: 2500,
      position: "top",
    });
    throw error;
  }
};

const deleteTeacher = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${baseURL}/teachers/${id}`, config);
    if (response.status === 200) {
      CustomToast({
        title: "Éxito",
        message: "El usuario se ha eliminado correctamente.",
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
      message: error.response.data.message || "Error al eliminar el usuario.",
      type: "error",
      duration: 2500,
      position: "top",
    });
    throw error;
  }
};

const authService = {
  getAllTeachers,
  getTeacherById,
  searchTeacher,
  create,
  uploadTeachers,
  update,
  deleteTeacher,
};

export default authService;
