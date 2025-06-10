export const getAuthHeader = (): { headers: Record<string, string> } => {
  const cookies = document.cookie;
  const token = cookies
    .split('; ')
    .find(row => row.startsWith('digital-signage='))
    ?.split('=')[1] ?? '';

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};
