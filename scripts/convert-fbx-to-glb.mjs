// One-off script: converts luffy_jump.fbx → luffy_jump.glb (no Draco)
// Run with: node scripts/convert-fbx-to-glb.mjs

import { readFileSync, writeFileSync } from "fs";
import { createCanvas } from "canvas";
import { FBXLoader, GLTFExporter } from "three-stdlib";
import { Blob } from "buffer";

// Polyfill for Node.js / three.js texture encoding
if (typeof globalThis.Blob === "undefined") globalThis.Blob = Blob;
if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    createElement: (tag) => {
      if (tag === "canvas") return createCanvas(1, 1);
      return {};
    },
    createElementNS: (_ns, tag) => {
      if (tag === "canvas") return createCanvas(1, 1);
      return {};
    },
  };
}

const FBX_PATH = "./public/models/luffy_jump.fbx";
const GLB_OUT  = "./public/models/luffy_jump.glb";

console.log("📦 Loading FBX...");
const fbxBuf = readFileSync(FBX_PATH);
const loader = new FBXLoader();

const group = loader.parse(
  fbxBuf.buffer.slice(fbxBuf.byteOffset, fbxBuf.byteOffset + fbxBuf.byteLength),
  ""
);

console.log(`✓ Loaded — ${group.animations.length} animation(s), ${group.children.length} objects`);

console.log("🔄 Exporting as GLB (no Draco)...");
const exporter = new GLTFExporter();

exporter.parse(
  group,
  (result) => {
    if (result instanceof ArrayBuffer) {
      const outBuf = Buffer.from(result);
      writeFileSync(GLB_OUT, outBuf);
      const inMB  = (readFileSync(FBX_PATH).byteLength  / 1024 / 1024).toFixed(2);
      const outMB = (outBuf.byteLength / 1024 / 1024).toFixed(2);
      console.log(`\n✅ Done!`);
      console.log(`   FBX: ${inMB} MB  →  GLB: ${outMB} MB (no Draco)`);
      console.log(`   Saved to: ${GLB_OUT}`);
    } else {
      console.error("❌ Unexpected export result type:", typeof result);
    }
  },
  (err) => console.error("❌ Export error:", err),
  { binary: true, animations: group.animations }
);

