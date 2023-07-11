# @mark8t/create

## Introduction

`@mark8t/create` is a CLI tool for generating SvelteKit projects with additional configuration options. It provides a convenient way to bootstrap your SvelteKit projects and customize them based on your requirements.

## Installation

To use `@mark8t/create`, you can install it globally using npm, yarn, or pnpm:

```shell
npm install -g @mark8t/create
```

or

```shell
yarn global add @mark8t/create
```

or

```shell
pnpm install -g @mark8t/create
```

Choose the package manager of your choice.

## Usage

Once installed, you can create a new SvelteKit project using the following command:

```shell
npx create @mark8t/create project-name
```

Replace `project-name` with the desired name for your project.

During the project creation process, you will be prompted with various configuration options, including the ability to use a local module, enable Google integration, and more. Simply follow the prompts and make your selections.

After the project is created, navigate into the project directory:

```shell
cd project-name
```

Install the project dependencies using your preferred package manager:

For npm:

```shell
npm install
```

For yarn:

```shell
yarn install
```

For pnpm:

```shell
pnpm install
```

Perform any additional configuration if required, such as modifying the `config.js` file based on your choices.

## Additional Configuration

You can further customize your project by modifying the generated `config.js` file. This file contains various settings and configurations specific to your SvelteKit project. Update the configuration based on your needs and project requirements.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/ryanspice/-mark8t-create).

## License

This project is licensed under the [MIT License](LICENSE).
