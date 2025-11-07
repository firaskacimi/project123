import axios from "axios";

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await axios.post("http://localhost:4000/auth/register", userData);
  return response.data;
};
