describe('RTL', () => {
  before(async () => {
    await element(by.id('setRTL')).tap();
  });

  after(async () => {
    await element(by.id('unsetRTL')).tap();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be set to RTL', async () => {
    expect(element(by.text('RTL ON'))).toExist();
    expect(element(by.text('RTL OFF'))).toNotExist();
  });

  describe('Programmatic', () => {
    it('should open on button press', async () => {
      await element(by.id('openButton')).tap();

      await expect(element(by.id('mainContent'))).toExist();
      await expect(element(by.id('navigationView'))).toBeVisible();
    });
  });
});
