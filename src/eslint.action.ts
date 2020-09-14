import { getInput, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { ESLint } from 'eslint';

class ESLintAction {
    private readonly eslintFolder: string;

    private readonly eslintConfig: string;

    private readonly authToken: string | null;

    private readonly context: Context;

    constructor() {
        this.eslintFolder = getInput('eslintFolder') || '.';
        this.eslintConfig = getInput('eslintConfig') || '.eslintrc.js';
        this.authToken = getInput('authToken') || null;
        this.context = context;
        info(`Starting ESLint GitHub Action`);
        info('Configuration:');
        info(`ESLint Folder: "${this.eslintFolder}"`);
        this.runLinter().then(async (body) => {
            await this.comment(body);
        });
    }

    private async runLinter() {
        const linter = new ESLint({
            overrideConfigFile: this.eslintConfig,
        });
        const results = await linter.lintFiles(this.eslintFolder);
        let comment = `# ESLint found ${results.length} files with issues\r\n`;
        results.forEach((result) => {
            comment += `### ${result.errorCount} issues in ${result.filePath}\r\n`;
            result.messages.forEach((message) => {
                comment += `${message.message}\r\n`;
            });
        });
        return comment;
    }

    private async comment(body: string) {
        if (this.authToken === null) {
            info("No authToken provided. Won't post comment");
            info(body);
            return;
        }
        const kit = getOctokit(this.authToken);
        await kit.issues.createComment({
            issue_number: context.issue.number,
            body,
            repo: context.repo.repo,
            owner: context.repo.owner,
        });
    }
}

const x = new ESLintAction();
