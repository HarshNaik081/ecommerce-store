// ShopSphere E-commerce Platform
console.log('ShopSphere initialized');

const API_URL = 'http://localhost:5000/api';

window.ShopSphere = {
    async testAPI() {
        try {
            const res = await fetch(API_URL + '/health');
            const data = await res.json();
            console.log('API:', data);
            return data;
        } catch (err) {
            console.error('API Error:', err);
            return null;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('ShopSphere ready');
    ShopSphere.testAPI();
});
