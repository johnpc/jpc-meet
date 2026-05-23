#!/usr/bin/env node
/**
 * CRAP Score Calculator
 * CRAP(f) = comp(f)^2 * (1 - cov(f)/100)^3 + comp(f)
 *
 * Reads istanbul coverage-final.json and computes per-function CRAP scores.
 * Threshold: CRAP ≤ 15 (functions with score > 15 need refactoring or more tests)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const CRAP_THRESHOLD = 15;
const COVERAGE_PATH = resolve("coverage/coverage-final.json");

interface BranchCoverage {
  [key: string]: number[];
}

interface FnMap {
  [key: string]: { name: string; decl: { start: { line: number } } };
}

interface FnCoverage {
  [key: string]: number;
}

interface FileCoverage {
  fnMap: FnMap;
  f: FnCoverage;
  branchMap: { [key: string]: { loc: { start: { line: number } } } };
  b: BranchCoverage;
}

interface CoverageData {
  [filePath: string]: FileCoverage;
}

function computeCyclomaticComplexity(
  fileCov: FileCoverage,
  fnKey: string,
): number {
  const fn = fileCov.fnMap[fnKey];
  const fnStartLine = fn.decl.start.line;

  // Find next function start line to bound this function
  const allFnStarts = Object.values(fileCov.fnMap)
    .map((f) => f.decl.start.line)
    .sort((a, b) => a - b);
  const fnIdx = allFnStarts.indexOf(fnStartLine);
  const nextFnStart =
    fnIdx < allFnStarts.length - 1 ? allFnStarts[fnIdx + 1] : Infinity;

  // Count branches within this function's line range
  let branchCount = 0;
  for (const brKey of Object.keys(fileCov.branchMap)) {
    const brLine = fileCov.branchMap[brKey].loc.start.line;
    if (brLine >= fnStartLine && brLine < nextFnStart) {
      branchCount += fileCov.b[brKey].length - 1; // each branch adds 1 decision point
    }
  }

  return 1 + branchCount; // base complexity is 1
}

function computeFunctionCoverage(
  fileCov: FileCoverage,
  fnKey: string,
): number {
  const fn = fileCov.fnMap[fnKey];
  const fnStartLine = fn.decl.start.line;

  const allFnStarts = Object.values(fileCov.fnMap)
    .map((f) => f.decl.start.line)
    .sort((a, b) => a - b);
  const fnIdx = allFnStarts.indexOf(fnStartLine);
  const nextFnStart =
    fnIdx < allFnStarts.length - 1 ? allFnStarts[fnIdx + 1] : Infinity;

  // Branch coverage within this function
  let coveredBranches = 0;
  let totalBranches = 0;
  for (const brKey of Object.keys(fileCov.branchMap)) {
    const brLine = fileCov.branchMap[brKey].loc.start.line;
    if (brLine >= fnStartLine && brLine < nextFnStart) {
      for (const count of fileCov.b[brKey]) {
        totalBranches++;
        if (count > 0) coveredBranches++;
      }
    }
  }

  // If no branches, use function-level hit/miss
  if (totalBranches === 0) {
    return fileCov.f[fnKey] > 0 ? 100 : 0;
  }

  return (coveredBranches / totalBranches) * 100;
}

function computeCrap(complexity: number, coverage: number): number {
  return (
    Math.pow(complexity, 2) * Math.pow(1 - coverage / 100, 3) + complexity
  );
}

function main(): void {
  if (!existsSync(COVERAGE_PATH)) {
    console.error(
      "Coverage data not found. Run: npx vitest run --coverage first.",
    );
    process.exit(1);
  }

  const coverageData: CoverageData = JSON.parse(
    readFileSync(COVERAGE_PATH, "utf-8"),
  );

  interface CrapResult {
    file: string;
    fn: string;
    line: number;
    complexity: number;
    coverage: number;
    crap: number;
  }

  const results: CrapResult[] = [];

  for (const [filePath, fileCov] of Object.entries(coverageData)) {
    const relPath = filePath.replace(process.cwd() + "/", "");

    for (const fnKey of Object.keys(fileCov.fnMap)) {
      const fn = fileCov.fnMap[fnKey];
      const complexity = computeCyclomaticComplexity(fileCov, fnKey);
      const coverage = computeFunctionCoverage(fileCov, fnKey);
      const crap = computeCrap(complexity, coverage);

      results.push({
        file: relPath,
        fn: fn.name || `(anonymous@${fn.decl.start.line})`,
        line: fn.decl.start.line,
        complexity,
        coverage: Math.round(coverage),
        crap: Math.round(crap * 100) / 100,
      });
    }
  }

  results.sort((a, b) => b.crap - a.crap);

  console.log("\n📊 CRAP Score Analysis (threshold ≤ %d)\n", CRAP_THRESHOLD);
  console.log(
    `${"File".padEnd(40)} ${"Function".padEnd(30)} ${"Comp".padStart(6)} ${"Cov%".padStart(6)} ${"CRAP".padStart(8)} Status`,
  );
  console.log("-".repeat(100));

  let failures = 0;
  for (const r of results) {
    const status = r.crap <= CRAP_THRESHOLD ? "✅" : "❌";
    if (r.crap > CRAP_THRESHOLD) failures++;
    console.log(
      `${r.file.slice(0, 40).padEnd(40)} ${r.fn.slice(0, 30).padEnd(30)} ${String(r.complexity).padStart(6)} ${(r.coverage + "%").padStart(6)} ${r.crap.toFixed(2).padStart(8)} ${status}`,
    );
  }

  console.log("\n" + "-".repeat(100));
  console.log(
    `Total functions: ${results.length} | Passing: ${results.length - failures} | Failing: ${failures}`,
  );

  if (failures > 0) {
    console.error(
      `\n❌ ${failures} function(s) exceed CRAP threshold of ${CRAP_THRESHOLD}. Refactor or add tests.`,
    );
    process.exit(1);
  } else {
    console.log(`\n✅ All functions have CRAP score ≤ ${CRAP_THRESHOLD}`);
  }
}

main();
