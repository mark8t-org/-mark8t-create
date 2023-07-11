
const [projectName] = args;

const prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter a name for your project:',
    default: projectName,
  },
  {
    type: 'confirm',
    name: 'includeAdminModule',
    message: 'Include admin module?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'enableGoogleIntegration',
    message: 'Enable Google integration?',
    default: false,
  },
  {
    type: 'input',
    name: 'googleApiKey',
    message: 'Enter your Google API key:',
    when: (answers) => answers.enableGoogleIntegration,
  },
  // Additional prompts
  {
    type: 'confirm',
    name: 'includeAnalytics',
    message: 'Include analytics?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'includeAuthentication',
    message: 'Include authentication?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'includePaymentGateway',
    message: 'Include payment gateway?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'includeEmailService',
    message: 'Include email service?',
    default: true,
  },
  {
    type: 'list',
    name: 'cssFramework',
    message: 'Choose a CSS framework:',
    choices: ['Tailwind CSS', 'Bootstrap', 'Bulma', 'None'],
    default: 'Tailwind CSS',
  },
  {
    type: 'confirm',
    name: 'includeTesting',
    message: 'Include testing?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'includeLocalization',
    message: 'Include localization support?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'includeCMS',
    message: 'Include a content management system?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'includeSearch',
    message: 'Include search functionality?',
    default: false,
  },
];

module.exports = prompts;
