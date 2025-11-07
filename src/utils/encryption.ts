// Simple encryption/decryption for demo purposes
// In production, use proper encryption libraries

export const encryptData = (data: string): string => {
  try {
    // Simple base64 encoding for demo (not secure for production)
    return btoa(unescape(encodeURIComponent(data)));
  } catch {
    return data;
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    return decodeURIComponent(escape(atob(encryptedData)));
  } catch {
    return encryptedData;
  }
};

export const hashData = (data: string): string => {
  // Simple hash for demo purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};
