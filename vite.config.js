
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Use the SWC plugin you have installed

export default defineConfig({
  plugins: [react()],
});