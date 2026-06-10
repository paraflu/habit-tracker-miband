module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-named': 'never',
    'color-no-hex': null,
    'unit-no-unknown': [true, { ignoreUnits: ['px'] }],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'flex-direction',
          'justify-content',
          'align-items',
          'align-self',
          'flex-wrap',
          'flex',
          'flex-grow',
          'flex-shrink',
          'flex-basis'
        ]
      }
    ]
  }
}
