import { defaults } from 'jest-config';

export default {
  transform: {
    '^.+\\.js$': 'babel-jest',  // Menggunakan Babel untuk file JS
  },
  testEnvironment: 'node',  // Menentukan lingkungan tes (untuk backend, gunakan 'node')
  setupFilesAfterEnv: ['./jest.teardown.js'],
};
