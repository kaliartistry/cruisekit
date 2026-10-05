import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CruiseSaveFeedback from "./cruise-save-feedback";
import { Button } from "../ui/button";

const state = vi.hoisted(() => ({ reduced: false as boolean | null, props: {} as Record<string, unknown> }));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const capture = (tag: string) => React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
    state.props = props;
    const { initial, animate, transition, whileHover, whileTap, ...dom } = props;
    return React.createElement(tag, { ...dom, ref });
  });
  return { useReducedMotion: () => state.reduced, motion: { span: capture("span"), button: capture("button") } };
});
beforeEach(() => { state.reduced = false; state.props = {}; });
describe("calculator save feedback", () => {
  it("shows a brief decorative confirmation only after success", () => {
    expect(renderToStaticMarkup(<CruiseSaveFeedback saved={false} />)).toContain("lucide-ship");
    expect(state.props.initial).toBe(false);
    const saved = renderToStaticMarkup(<CruiseSaveFeedback saved />);
    expect(saved).toContain("lucide-check");
    expect(saved).toContain('aria-hidden="true"');
    expect(state.props.initial).toEqual({ opacity: 0.35, scale: 0.98 });
    expect(state.props.animate).toEqual({ opacity: 1, scale: 1 });
    expect(state.props.transition).toEqual({ duration: 0.18, ease: "easeOut" });
  });
  it.each([true, null])("renders success immediately with reduced/unknown preference %s", (reduced) => {
    state.reduced = reduced;
    expect(renderToStaticMarkup(<CruiseSaveFeedback saved />)).toContain("lucide-check");
    expect(state.props.initial).toBe(false);
    expect(state.props.transition).toEqual({ duration: 0, ease: "easeOut" });
  });
  it("retains native button semantics and the existing press feedback", () => {
    const onClick = vi.fn();
    expect(renderToStaticMarkup(<Button onClick={onClick}>Save</Button>)).toContain("<button");
    expect(state.props.onClick).toBe(onClick);
    expect(state.props.whileHover).toEqual({ scale: 1.02 });
    expect(state.props.whileTap).toEqual({ scale: 0.98 });
  });
  it.each([true, null])("prevents caller gesture overrides with reduced/unknown preference %s", (reduced) => {
    state.reduced = reduced;
    renderToStaticMarkup(<Button whileTap={{ scale: 0.5 }} whileHover={{ x: 20 }}>Save</Button>);
    expect(state.props.whileTap).toBeUndefined();
    expect(state.props.whileHover).toBeUndefined();
  });
  it("keeps a disabled save button still", () => {
    expect(renderToStaticMarkup(<Button disabled>Saving...</Button>)).toContain('disabled=""');
    expect(state.props.whileTap).toBeUndefined();
    expect(state.props.whileHover).toBeUndefined();
  });
  it("preserves the handoff link via asChild", () => {
    const markup = renderToStaticMarkup(<Button asChild><a href="/cruise/handoff?v=1">Continue</a></Button>);
    expect(markup).toContain('<a href="/cruise/handoff?v=1"');
    expect(markup).not.toContain("<button");
  });
});
