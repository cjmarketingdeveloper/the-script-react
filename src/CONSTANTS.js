
/*
export const API_URL          = "https://thescriptapiv1-632216c9063a.herokuapp.com/api/";
export const API_BASE         = "https://thescriptapiv1-632216c9063a.herokuapp.com/";
export const SESSION_COOKIE   = "MEVENTWEBtimewaistengnewLXd5dkplaytheball";
*/

console.log(process.env.REACT_APP_API_URL);

export const API_URL          = process.env.REACT_APP_API_URL;
export const API_BASE         = process.env.REACT_APP_API_BASE;
export const SESSION_COOKIE   = process.env.REACT_APP_SESSION_COOKIE;

export const VERSION          = "4.0.0";

export const SMALLER_PROCESS  = "https://cjmarketing.co/image_directory/loading.gif";
