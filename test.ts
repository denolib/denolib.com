import { MATCHER } from "./index";

const cases = [
  {
    scope: "denoland",
    repo: "deno_std",
    branch: "v0.2.8",
    rest: "/examples/gist.ts"
  },
  {
    scope: "denoland",
    repo: "deno_std",
    branch: "master",
    rest: "/examples/gist.ts"
  },
  {
    scope: "denoland",
    repo: "deno_std",
    branch: "",
    rest: "/examples/gist.ts"
  }
];

test("matcher", () => {
  for (const c of cases) {
    const url = `/${c.scope}/${c.repo}${c.branch ? `@${c.branch}` : ""}${
      c.rest
    }`;
    const [, scope, repo, versionSpecified, branch, rest] = MATCHER.exec(url);
    expect(
      () =>
        scope === c.scope &&
        repo === c.repo &&
        (versionSpecified === undefined || versionSpecified === "@") &&
        branch === c.branch &&
        rest === c.rest
    ).toBeTruthy();
  }
});
