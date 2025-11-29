import { jwtDecode } from "jwt-decode";
import { getToken } from "./client/interact-api";

export type DecodeData = {
  Id: string;
  Name: string;
  Email: string;
  Role: string;
  exp: number;
  iss: string;
  aud: string;
};

export enum ROLES {
  Administrator = "Administrator",
  Staff = "Staff",
  Manager = "Manager",
  Customer = "Customer",
}
export const checkRole = async (roles: string[]) => {
  const token: any = await getToken();

  if (!token?.accessToken) {
    return null;
  }

  try {
    const decode: DecodeData = jwtDecode<DecodeData>(token?.accessToken);
    const userRole = decode.Role.toUpperCase();
    // console.log({ decode });
    return roles.find((role) => role.toUpperCase() === userRole);
  } catch (error) {
    console.log({ error });
  }
};

export const isAdmin = async () => {
  const token: any = await getToken();

  if (!token?.accessToken) {
    return null;
  }

  try {
    const decode: DecodeData = jwtDecode<DecodeData>(token?.accessToken);
    const userRole = decode.Role.toUpperCase();

    return userRole.toUpperCase() === ROLES.Administrator.toUpperCase();
  } catch (error) {
    console.log({ error });
  }
};

export const isManager = async () => {
  const token: any = await getToken();

  if (!token?.accessToken) {
    return null;
  }

  try {
    const decode: DecodeData = jwtDecode<DecodeData>(token?.accessToken);
    const userRole = decode.Role.toUpperCase();

    return userRole.toUpperCase() === ROLES.Manager.toUpperCase();
  } catch (error) {
    console.log({ error });
  }
};
