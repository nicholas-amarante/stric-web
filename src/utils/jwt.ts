/**
 * Utilitário para inspeção e validação de tokens JWT no frontend.
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadBase64 = parts[1];
    if (!payloadBase64) return true;

    // Suporte robusto a Base64URL: substitui hifens/underscores e adiciona padding '='
    let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // Decodifica preservando caracteres UTF-8
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonPayload);
    if (!parsed.exp || typeof parsed.exp !== 'number') return true;

    // exp está em segundos da época UNIX; Date.now() em milissegundos
    return Date.now() >= parsed.exp * 1000;
  } catch {
    return true;
  }
};
