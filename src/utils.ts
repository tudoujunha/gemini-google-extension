import Browser from 'webextension-polyfill'
import { Theme } from './config'

export function detectSystemColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark
  }
  return Theme.Light
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}

export function joinUrl(baseURL: string, path: string) {
  return `${baseURL.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`;
}