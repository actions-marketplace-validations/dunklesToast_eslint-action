import { getInput } from '@actions/core';
import { spawnSync } from 'child_process';

class ESLintAction {
    private readonly eslintBinary: string;

    private readonly eslintFolder: string;

    constructor() {
        this.eslintBinary = getInput('eslintBinary') || 'eslint';
        this.eslintFolder = getInput('eslintFolder') || '.';
        console.log(`Starting ESLint GitHub Action`);
        console.log('Configuration:');
        console.log(`ESLint Binary: "${this.eslintBinary}"`);
        console.log(`ESLint Folder: "${this.eslintFolder}"`);
        this.runCommand();
    }

    private runCommand() {
        const { status, stdout, stderr, error } = spawnSync(this.eslintBinary, [this.eslintFolder]);
        if (status === 0) {
            console.log('✓ ESLint returned no errors');
        } else {
            console.error('× ESLint returned an error.');
            console.error(stderr?.toString());
            console.error(stdout?.toString());
            if (error?.message) console.log(error.message);
            process.exit(status || 1);
        }
    }
}

const x = new ESLintAction();
