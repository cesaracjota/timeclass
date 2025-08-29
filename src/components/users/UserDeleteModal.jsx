import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../features/userSlice";
import { Trash2, X, AlertCircle, Shield } from "lucide-react";

export const UserDeleteModal = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(user.id)).unwrap();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el usuario.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="flex px-2.5 py-2.5 bg-red-500 rounded-full text-white hover:bg-red-600 items-center transition-colors duration-200"
      >
        <Trash2 size={20} />
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
            onClick={() => setOpen(false)} 
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-3xl p-6 animate-in fade-in duration-200 border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="text-red-500 mr-2" size={20} />
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Confirmar Eliminación</h2>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-md mb-4">
                <p className="text-zinc-600 dark:text-zinc-300">
                  ¿Estás seguro que deseas eliminar a <span className="font-medium text-zinc-800 dark:text-white">{user.name}</span>?
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              {error && (
                <div className="flex items-center text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
                >
                  <Trash2 size={16} className="mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};