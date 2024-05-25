import axios from 'axios';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_CLAWS_API_URL;
console.log({ baseURL });

export const clawsClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
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

export const { up, down, left, right, drop } = {
  up: () => {
    toast.loading('Executing command...');

    fetch('/api/control?direction=left', {
      method: 'POST',
    })
      .then(() => {
        toast.success('Action successful');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(toast.dismiss);
  },
  down: () => {
    toast.loading('Executing command...');

    fetch('/api/control?direction=down', {
      method: 'POST',
    })
      .then(() => {
        toast.success('Action successful');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(toast.dismiss);
  },
  left: () => {
    toast.loading('Executing command...');

    fetch('/api/control?direction=left', {
      method: 'POST',
    })
      .then(() => {
        toast.success('Action successful');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(toast.dismiss);
  },
  right: () => {
    toast.loading('Executing command...');

    fetch('/api/control?direction=right', {
      method: 'POST',
    })
      .then(() => {
        toast.success('Action successful');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(toast.dismiss);
  },
  drop: () => {
    toast.loading('Executing command...');

    fetch('/api/control?direction=drop', {
      method: 'POST',
    })
      .then(() => {
        toast.success('Action successful');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(toast.dismiss);
  },
};
