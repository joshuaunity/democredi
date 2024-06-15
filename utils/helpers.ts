import config from '../config/config';
import axios from 'axios';


type RequestBody = Record<string, any>;

const validateFields = (body: RequestBody, requiredFields: string[]): string[] => {
    return requiredFields.filter(field => !body[field] || body[field].trim() === '');
};

const pinValidator = (pin: string): boolean => {
    const pinRegex = /^[0-9]{4}$/;
    return pinRegex.test(pin);
};

const karmaCheck = (email: string): boolean => {
    const url = config.karma.api + email
    const headers = {
        Authorization: `Bearer ${config.karma.secret}`
    };
    axios.get(url, { headers })
        .then(response => {
            const containsData = response.data && (response.data.message === 'Successful')
            if (containsData) {
                return true;
            }
        })
        .catch(error => {
            console.error(error);
            return false;
        });
    
    return false;
}

const accNumGenerator = (): number => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export { validateFields, pinValidator, karmaCheck, accNumGenerator };