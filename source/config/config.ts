import dotenv from 'dotenv';


dotenv.config();

const SERVER_HOSTNAME = 'localhost';
const SERVER_PORT =  9999;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    server: SERVER
};

export default config;
