import axios from 'axios';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_CLAWS_API_URL;
console.log({ baseURL });

const clawsClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

clawsClient.interceptors.request.use(
  (config) => {
    toast.loading('Executing command...');
    return config;
  },
  (error) => {
    toast.dismiss();
    toast.error(error.message);
  },
);

clawsClient.interceptors.response.use(
  (response) => {
    toast.dismiss();
    toast.success(`Action successful`);
    return response;
  },
  (error) => {
    toast.dismiss();
    toast.error(error.message);
  },
);

export const clawsControls = () => ({
  up: () => clawsClient.post('/control', { direction: 'up' }),
  down: () => clawsClient.post('/control', { direction: 'down' }),
  left: () => clawsClient.post('/control', { direction: 'left' }),
  right: () => clawsClient.post('/control', { direction: 'right' }),
  drop: () => clawsClient.post('/control', { direction: 'drop' }),
});

export const { up, down, left, right, drop } = clawsControls();
