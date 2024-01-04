import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    base: "/GeoExpensesTracker",
    plugins: [react()],
    server: {
        host: true,
        strictPort: true,
        port: 5173,
    }
});