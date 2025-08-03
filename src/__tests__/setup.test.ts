describe('Test Setup', () => {
  it('should work correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have testing library available', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    expect(element).toHaveTextContent('Hello World');
  });
});
