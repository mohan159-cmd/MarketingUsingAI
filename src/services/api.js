import axios from "axios";
import { apiConfig } from "./apiClient";

export async function signIn(email, password) {
  const url = `https://${apiConfig.tenantSubdomain}.ciamlogin.com/auth/v1/signIn`;

  return axios.post(url, {
    username: email,
    password: password
  });
}
