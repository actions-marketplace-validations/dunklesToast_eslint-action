import { getInput, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { ESLint } from 'eslint';
class ESLintAction {
    constructor() {
        this.eslintFolder = getInput('eslintFolder') || '.';
        this.authToken = getInput('authToken') || null;
        this.context = context;
        info(`Starting ESLint GitHub Action`);
        info('Configuration:');
        info(`ESLint Folder: "${this.eslintFolder}"`);
        this.runLinter().then(async (body) => {
            await this.comment(body);
        });
    }
    async runLinter() {
        const linter = new ESLint({});
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
    async comment(body) {
        if (this.authToken === null) {
            info("No authToken provided. Won't post comment");
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
new ESLintAction();
//# sourceMappingURL=eslint.action.js.map