
export interface Ienvironment {
  production: boolean,
  hmr: boolean,
  // apiUrl: 'http://65.108.95.12:9001',
  apiUrl: string,
  redirectUrl: string
}
export const environment: Ienvironment = {
  production: false,
  hmr: true,
  apiUrl: 'http://localhost:9001',
  redirectUrl: 'http://localhost:4200'
};
