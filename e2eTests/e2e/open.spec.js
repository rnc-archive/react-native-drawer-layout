describe('Open', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should render the main content', async () => {
    await expect(element(by.id('mainContent'))).toBeVisible();
    await expect(element(by.id('navigationView'))).toBeNotVisible();
  });

  describe('Programmatic', () => {
    it('should open on button press', async () => {
      await element(by.id('openButton')).tap();

      await expect(element(by.id('mainContent'))).toExist();
      await expect(element(by.id('navigationView'))).toBeVisible();
    });

    it('should close an open drawer on button tap', async () => {
      await element(by.id('openButton')).tap();
      await element(by.id('closeButton')).tap();

      await expect(element(by.id('mainContent'))).toBeVisible();
      await expect(element(by.id('navigationView'))).toBeNotVisible();
    });

    it('should close an open drawer on overlay tap', async () => {
      await element(by.id('openButton')).tap();
      await element(by.id('RNDL/overlay')).tap();

      await expect(element(by.id('mainContent'))).toBeVisible();
      await expect(element(by.id('navigationView'))).toBeNotVisible();
    });
  });
});
