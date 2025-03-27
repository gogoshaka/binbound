
export const anonymoussessionidCookie = {
    name: 'anonymoussessionid',
    httpOnly: true,
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
}