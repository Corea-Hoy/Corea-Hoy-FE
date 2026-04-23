const config = {
  ignores: [(message) => /^(INIT|SETUP|BOOTSTRAP)\b/.test(message)],

  rules: {
    'type-enum': [0],
    'type-case': [0],
    'subject-empty': [0],
  },
};

export default config;
