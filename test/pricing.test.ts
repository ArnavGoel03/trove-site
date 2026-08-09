import assert from "node:assert/strict";
import { test } from "node:test";

import {
  formatUSD,
  PRICING,
  savingsVs,
  TRIAL_LABEL,
  YEARLY_ON_MONTHLY,
  YEARLY_SAVING,
  YEARLY_SAVING_PCT,
} from "../lib/pricing.ts";

test("whole dollars render without a cents part", () => {
  assert.equal(formatUSD(3900), "$39");
  assert.equal(formatUSD(0), "$0");
  assert.equal(formatUSD(100000), "$1,000");
});

test("partial dollars keep both digits", () => {
  assert.equal(formatUSD(499), "$4.99");
  assert.equal(formatUSD(3996), "$39.96");
  assert.equal(formatUSD(5), "$0.05");
});

test("negative amounts keep the sign outside the symbol", () => {
  assert.equal(formatUSD(-499), "-$4.99");
});

test("paying yearly is cheaper than twelve months, and the claim is not generous", () => {
  assert.equal(YEARLY_ON_MONTHLY, 5988);
  assert.equal(YEARLY_SAVING, 5988 - PRICING.yearly);
  // Floor, never round: claiming 35% when it is 34.9% is a false statement.
  assert.equal(YEARLY_SAVING_PCT, Math.floor((YEARLY_SAVING / 5988) * 100));
  assert.ok(YEARLY_SAVING_PCT <= (YEARLY_SAVING / 5988) * 100);
});

test("savings never go negative", () => {
  assert.equal(savingsVs(44100), 44100 - PRICING.yearly);
  // A stack cheaper than Trove means no saving, not a negative one.
  assert.equal(savingsVs(1000), 0);
  assert.equal(savingsVs(PRICING.yearly), 0);
});

test("the trial label is built from the number, not typed twice", () => {
  assert.equal(TRIAL_LABEL, `${PRICING.trialDays}-day free trial`);
});
