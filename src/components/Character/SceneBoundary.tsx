import { Component, PropsWithChildren } from "react";
export default class SceneBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="scene-fallback" aria-hidden="true">☠</div> : this.props.children;
  }
}
