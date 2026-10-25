// Metro resolves font files to asset IDs.
declare module '*.ttf' {
  const asset: number;
  export default asset;
}
