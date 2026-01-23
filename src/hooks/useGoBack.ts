const useGoBack = () => {
  const goBack = () => {
    // Check if we can go back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, navigate home 
      // Note: wouter doesn't have a global navigate outside hook easily, 
      // but since we are replacing "navigate('/')", we can use window.location
      // or we could use `useLocation` from wouter inside the component usage.
      // But assuming this is a generic hook, window.location.href works for hard redirect
      // or we can just ignore if we can't go back.
      // Better:
      window.location.href = "/";
    }
  };

  return goBack;
};

export default useGoBack;
