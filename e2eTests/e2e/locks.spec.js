describe('ReactNativeDrawerLayout', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Programmatic', () => {
    // locked-closed can only be tested with swipe

    describe('locked-open', () => {
      it('should not close an open drawer on overlay tap', async () => {
        await element(
          by.id('toggleLockedOpen').withAncestor(by.id('main')),
        ).tap();

        await element(by.id('openButton')).tap();
        await element(by.id('RNDL/overlay')).tap();

        await expect(element(by.id('navigationView'))).toBeVisible();
      });
    });
  });
});
