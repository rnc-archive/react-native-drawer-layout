describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should render the main content', async () => {
    await expect(element(by.id('mainContent'))).toBeVisible();
    await expect(element(by.id('navigationView'))).toBeNotVisible();
  });
});
