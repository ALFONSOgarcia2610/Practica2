import { Store } from '@tanstack/store';

// Estado inicial del formulario de autenticación
const initialState = {
  inputUser: '',
  password: '',
  isRegister: false,
  errorMessage: '',
};

// Crear instancia de Store
export const authFormStore = new Store(initialState);

// === Persistencia con localStorage ===
const STORAGE_KEY = 'authForm';

// Cargar estado desde localStorage al iniciar
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    authFormStore.setState((prev) => ({
      ...prev,
      ...parsed,
    }));
  } catch (err) {
    console.error('Error al parsear el estado persistido:', err);
  }
}

// Guardar en localStorage cada vez que el estado cambia
authFormStore.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error al guardar el estado en localStorage:', err);
  }
});

// === Acciones para modificar el estado ===
export const setInputUser = (value: string) =>
  authFormStore.setState((prev) => ({ ...prev, inputUser: value }));

export const setPassword = (value: string) =>
  authFormStore.setState((prev) => ({ ...prev, password: value }));

export const toggleIsRegister = () =>
  authFormStore.setState((prev) => ({ ...prev, isRegister: !prev.isRegister }));

export const setErrorMessage = (value: string) =>
  authFormStore.setState((prev) => ({ ...prev, errorMessage: value }));

export const resetForm = () => authFormStore.setState(() => initialState);
