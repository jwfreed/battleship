export const createMatch = async (uid) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
    }),
  };
  try {
    const response = await fetch('http://localhost:3001/match', options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
