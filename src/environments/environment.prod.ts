
export interface Ienvironment {
  production: boolean,
  hmr: boolean,
  // apiUrl: 'http://65.108.95.12:9001',
  apiUrl: string,
  redirectUrl: string
}

export const environment: Ienvironment = {
  production: true,
  hmr: false,
  apiUrl: 'https://backend.thestreamboard.com',
  redirectUrl: 'https://admin.thestreamboard.com/'
};