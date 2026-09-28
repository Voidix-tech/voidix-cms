import assert from "node:assert/strict";
import test from "node:test";

import { aboutSchema } from "../lib/validation/contentSchemas";
import { readTopProjects, TOP_PROJECT_FIELD_NAMES } from "../lib/forms/topProjectFields";

const ABOUT_INPUT = {
  eyebrow: "About",
  titleLine1: "One technology partner.",
  titleLine2: "Multiple connected systems.",
  lead: "Voidix builds custom software.",
  premiseParagraphs: "Off-the-shelf software asks your business to adapt to the product.",
  premiseQuote: "Your business → Your workflow → Your software.",
  principles: "Replace manual processes. | Move repetitive work into systems.",
  buildPhases: "01 | Discover | We learn your business first.",
  instruments: "First reply | Under 5 days",
  instrumentsNote: "These are commitments, not a scoreboard.",
  stack: "Websites, CRM platforms",
  stackNote: "A project can begin with one system.",
  topProjects: [],
  closingTitle: "Tell us what you're building.",
  closingLead: "You don't need a perfect specification.",
  careersInvite: "Or come and build it with us",
};

test("an empty top projects list is valid, because it is how section 06 is taken off the page", () => {
  const parsed = aboutSchema.parse(ABOUT_INPUT);

  assert.deepEqual(parsed.topProjects, []);
});

test("a top project's URL is optional and is stored as null when left off", () => {
  const parsed = aboutSchema.parse({
    ...ABOUT_INPUT,
    topProjects: [
      {
        name: "Halcyon",
        description: "A booking platform.",
        url: "https://halcyon.example.com",
      },
      {
        name: "Ledger",
        description: "An internal finance system behind a login.",
        url: "",
      },
    ],
  });

  assert.deepEqual(parsed.topProjects, [
    {
      name: "Halcyon",
      description: "A booking platform.",
      url: "https://halcyon.example.com",
    },
    { name: "Ledger", description: "An internal finance system behind a login.", url: null },
  ]);
});

test("a top project URL without http(s) is refused rather than published as a relative path", () => {
  const parsed = aboutSchema.safeParse({
    ...ABOUT_INPUT,
    topProjects: [
      {
        name: "Halcyon",
        description: "A booking platform.",
        url: "halcyon.example.com",
      },
    ],
  });

  assert.equal(parsed.success, false);
});

test("a top project without a description is refused", () => {
  const parsed = aboutSchema.safeParse({
    ...ABOUT_INPUT,
    topProjects: [{ name: "Halcyon", description: "", url: "" }],
  });

  assert.equal(parsed.success, false);
});

test("readTopProjects reads parallel formData fields and drops completely empty rows", () => {
  const formData = new FormData();
  formData.append(TOP_PROJECT_FIELD_NAMES.name, "Kemcon");
  formData.append(TOP_PROJECT_FIELD_NAMES.description, "Furniture factory CRM");
  formData.append(TOP_PROJECT_FIELD_NAMES.url, "https://kemcon.site");

  // Completely blank row should be omitted
  formData.append(TOP_PROJECT_FIELD_NAMES.name, "   ");
  formData.append(TOP_PROJECT_FIELD_NAMES.description, "");
  formData.append(TOP_PROJECT_FIELD_NAMES.url, "");

  // Row without URL
  formData.append(TOP_PROJECT_FIELD_NAMES.name, "Dar El-Kola");
  formData.append(TOP_PROJECT_FIELD_NAMES.description, "Clinic management system");
  formData.append(TOP_PROJECT_FIELD_NAMES.url, "");

  const rows = readTopProjects(formData);

  assert.deepEqual(rows, [
    {
      name: "Kemcon",
      description: "Furniture factory CRM",
      url: "https://kemcon.site",
    },
    {
      name: "Dar El-Kola",
      description: "Clinic management system",
      url: "",
    },
  ]);
});


