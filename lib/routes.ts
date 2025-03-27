const routes = {
    home: (lng: string) => `/${lng}/`,
    authSignUpSuccessCallback: () => '/p/auth/signup/success/callback',
    event: (eventId: string) => `/event/${eventId}`,
    userProfile: (lng: string, userId: string) => `/${lng}/user/${userId}`,
    login: (lng: string) => `/${lng}/login`,
    register: (lng: string) => `/${lng}/register`,
    about: (lng: string) => `/${lng}/about`,
  };
  
  export default routes;