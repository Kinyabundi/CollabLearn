export const getSlicedAddress = (address: string) =>
  `${address.slice(0, 6)}.....${address.slice(-6)}`;
