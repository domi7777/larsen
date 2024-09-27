import {useEffect, useState} from 'react';

function App() {
  const  [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {
        isLoading ?
          <img src="./icons/pwa-512x512.png" alt="loading" />
          :<>kikoo</>
      }
    </>
  )
}

export default App
