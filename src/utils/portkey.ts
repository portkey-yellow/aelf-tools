import { Connector } from '@web3-react/types';

export function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) {
      return -1;
    } else if (v1Part > v2Part) {
      return 1;
    }
  }
  return 0;
}
export function isPortkey() {
  if (typeof window === 'object') return window.navigator.userAgent.includes('Portkey');
}

export function isPortkeyConnectEagerly() {
  if (!isPortkey()) return false;
  const regex = /PortkeyV(\d+\.\d+\.\d+)/;
  const match = window.navigator.userAgent.match(regex);
  if (match && match[1]) {
    const version = match[1];
    return compareVersions(version, '1.4.0') >= 0;
  }
  return false;
}

export function isPortkeyConnector(connector?: string | Connector) {
  return connector === 'PORTKEY';
}

export function isSelectPortkey(type?: string) {
  return type === 'PORTKEY';
}
