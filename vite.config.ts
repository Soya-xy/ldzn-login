import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
export default defineConfig({
    plugins: [
        UnoCSS({
            mode: 'shadow-dom',
        })
    ],
    server:{
        proxy:{
            '/login':{
                target:'http://10.141.141.81:30631',
            }
        }
    }
});
