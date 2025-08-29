import axios from "axios";
import { CustomToast } from "../utils/CustomToast";
import authService from "./auth.service";

const baseURL = import.meta.env.VITE_API_URL;

const getAllUsers = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // aquí nos aseguramos de mandar el token
      },
    };
    const response = await axios.get(`${baseURL}/users`, config);
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

const getUserById = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // aquí nos aseguramos de mandar el token
      },
    };
    const response = await axios.get(`${baseURL}/users/${id}`, config);
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

const create = async (data, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${baseURL}/users`, data, config);
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

const update = async (userData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${baseURL}/users/${userData.id}`,
      userData,
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
      message: error.response.data.message || "Error al actualizar el usuario.",
      type: "error",
      duration: 2500,
      position: "top",
    });
    throw error;
  }
};

const deleteUser = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${baseURL}/users/${id}`, config);
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

const userService = {
  getAllUsers,
  getUserById,
  create,
  update,
  deleteUser,
};

export default userService;
