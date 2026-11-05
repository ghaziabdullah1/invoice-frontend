import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '@/api/axios';

window.Pusher = Pusher;

// القنوات العامة (الفواتير) لا تحتاج تفويضا. القنوات الخاصة تمر عبر axios
// الخاص بالمشروع، فيحمل التوكن الحالي وقت الطلب وليس وقت تحميل الصفحة.
const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            axios
                .post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name,
                })
                .then((response) => callback(null, response.data))
                .catch((error) => callback(error));
        },
    }),
});

// تشخيص (وضع التطوير فقط): يطبع حالة اتصال Pusher في Console
if (import.meta.env.DEV) {
    const conn = echo.connector.pusher.connection;
    conn.bind('state_change', (s) => console.log('[pusher]', s.previous, '->', s.current));
    conn.bind('error', (e) => console.log('[pusher] error', JSON.stringify(e)));
    window.__echo = echo;
}

export default echo;
