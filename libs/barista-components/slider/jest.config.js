module.exports = {
  name: 'slider',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/slider',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
