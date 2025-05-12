import Cookies from "js-cookie";

const API_URL = 'http://localhost:5000/api/auth';

// Función para registrar un usuario
export const registerUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const loginUser = async ({ username, password }: { username: string; password: string }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return await response.json();
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/changePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error al cambiar la contraseña');
  }

  return response.json();
};