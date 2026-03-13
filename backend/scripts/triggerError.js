const axios = require('axios');

async function triggerError() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'rider@gmail.com',
            password: 'admin123'
        });
        
        const token = loginRes.data.token;
        console.log('Got token');

        console.log('Toggling availability...');
        const toggleRes = await axios.put('http://localhost:5000/api/users/availability', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('Response:', toggleRes.data);
    } catch (err) {
        console.error('Request failed:');
        console.error(err.response?.status, err.response?.data);
    }
}

triggerError();
