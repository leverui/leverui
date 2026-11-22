import { Select } from '../../src';

export const codeLanguages = {
  python: {
    value: 'python',
    title: 'python.py',
    code: `
from github import Github

# Create a Github instance using an access token
g = Github("YOUR_ACCESS_TOKEN")

# Get a repository
repo = g.get_repo("octocat/Hello-World")

# Get repository information
print(f"Repository: {repo.name}")
print(f"Description: {repo.description}")
print(f"Stars: {repo.stargazers_count}")

# List issues
issues = repo.get_issues(state='open')
for issue in issues:
    print(f"Issue #{issue.number}: {issue.title}")
`,
  },
  typescript: {
    value: 'typescript',
    title: 'typescript.ts',
    code: `
import { Octokit } from "@octokit/rest";

// Create an Octokit instance
const octokit = new Octokit({
  auth: "YOUR_ACCESS_TOKEN",
});

// Get repository information
const { data: repo } = await octokit.rest.repos.get({
  owner: "octocat",
  repo: "Hello-World",
});

console.log(\`Repository: \${repo.name}\`);
console.log(\`Description: \${repo.description}\`);
console.log(\`Stars: \${repo.stargazers_count}\`);

// List issues
const { data: issues } = await octokit.rest.issues.listForRepo({
  owner: "octocat",
  repo: "Hello-World",
  state: "open",
});

issues.forEach((issue) => {
  console.log(\`Issue #\${issue.number}: \${issue.title}\`);
});
`,
  },
} as const;

export type CodeLanguage = keyof typeof codeLanguages;

export const languageCollection = Select.createListCollection({
  items: Object.values(codeLanguages),
  /** Use the displayed language as the option text. */
  itemToString: (item) => item.value,
  /** Preserve the language key in selection state. */
  itemToValue: (item) => item.value,
});

/** Accept only language keys represented by the example. */
export function isCodeLanguage(value: string): value is CodeLanguage {
  return value === 'python' || value === 'typescript';
}
