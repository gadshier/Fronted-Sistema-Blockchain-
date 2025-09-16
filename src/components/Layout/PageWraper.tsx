import { motion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}   // al entrar
      animate={{ opacity: 1, x: 0 }}    // visible
      exit={{ opacity: 0, x: -50 }}     // al salir
      transition={{ duration: 0.3 }}    // duración de la animación
      className="w-full min-h-screen flex justify-center items-start"
    >
      {children}
    </motion.div>
  );
}
