const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d+$/
const ADSENSE_SLOT_PATTERN = /^\d+$/
const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidAdsenseClientId(value: string | undefined): value is string {
  return Boolean(value && ADSENSE_CLIENT_PATTERN.test(value))
}

export function isValidAdsenseSlot(value: string | undefined): value is string {
  return Boolean(value && ADSENSE_SLOT_PATTERN.test(value))
}

export function isValidPrivacyContact(value: string | undefined): value is string {
  return Boolean(value && CONTACT_EMAIL_PATTERN.test(value))
}

export function isAdsensePlacementEnabled({
  enabled,
  clientId,
  slot,
  privacyContact,
}: {
  enabled: string | undefined
  clientId: string | undefined
  slot: string | undefined
  privacyContact: string | undefined
}) {
  return enabled === 'true'
    && isValidAdsenseClientId(clientId)
    && isValidAdsenseSlot(slot)
    && isValidPrivacyContact(privacyContact)
}

export function createAdsTxtLine(clientId: string | undefined) {
  if (!isValidAdsenseClientId(clientId)) return null
  return `google.com, ${clientId.replace('ca-pub-', 'pub-')}, DIRECT, f08c47fec0942fa0`
}
