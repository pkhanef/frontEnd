// authUtils.js

// Hàm lấy access_token từ cookie
export const getAccessTokenFromCookie = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

    return token || null;
};
