import axios from "axios";

const local_ip = "192.168.56.1"; // Your local ip address
const PORT = "5000";
const API_URL = `http://${local_ip}:${PORT}/api/auth`;

export async function registerHTTP({ email, password }) {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password,
  });
  return response.data;
}

export async function loginHTTP({ email, password }) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
}

export async function verifyHTTP({ uid, code }) {
  const response = await axios.post(`${API_URL}/verify/${uid}`, {
    code,
  });
  return response.data;
}
