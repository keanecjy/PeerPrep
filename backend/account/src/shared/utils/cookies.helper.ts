export interface CookieGeneratorProps {
  name: string;
  value: string;
  httpOnly?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
  path?: string;
  maxAge?: number | string;
}

export function generateCookie({
  name,
  value,
  httpOnly,
  sameSite,
  secure,
  path,
  maxAge,
}: CookieGeneratorProps): string {
  const kvPairs: (string | null)[] = [
    `${name}=${value}`,
    httpOnly ? 'HttpOnly' : null,
    sameSite ? `SameSite=${sameSite}` : null,
    secure ? 'Secure' : null,
    path ? `Path=${path}` : null,
    maxAge ? `Max-Age=${maxAge}` : null,
  ];

  return kvPairs.reduce((prev, next) =>
    next != null ? `${prev}; ${next}` : prev
  );
}
