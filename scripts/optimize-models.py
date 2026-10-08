"""Resize embedded PNG textures while preserving geometry, rigs, and animations.
Requires: python -m pip install -r scripts/requirements.txt
Run once on newly supplied source models: python scripts/optimize-models.py
"""
import io
import json
import struct
from pathlib import Path
from PIL import Image


def optimize(path: Path, max_size: int = 1024):
    original = path.read_bytes()
    json_size = struct.unpack_from("<I", original, 12)[0]
    model = json.loads(original[20:20 + json_size])
    assert len(model["buffers"]) == 1 and "uri" not in model["buffers"][0]
    binary_start = 20 + json_size + 8
    binary = original[binary_start:]
    images = {image["bufferView"]: image for image in model.get("images", []) if "bufferView" in image}
    chunks = bytearray()
    for index, view in enumerate(model["bufferViews"]):
        assert view.get("buffer", 0) == 0
        offset = view.get("byteOffset", 0)
        data = binary[offset:offset + view["byteLength"]]
        if index in images and images[index].get("mimeType") == "image/png":
            image = Image.open(io.BytesIO(data))
            if max(image.size) > max_size:
                image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                output = io.BytesIO()
                image.save(output, format="PNG", optimize=True)
                data = output.getvalue()
        chunks.extend(b"\0" * (-len(chunks) % 4))
        view["byteOffset"] = len(chunks)
        view["byteLength"] = len(data)
        chunks.extend(data)
    model["buffers"][0]["byteLength"] = len(chunks)
    chunks.extend(b"\0" * (-len(chunks) % 4))
    metadata = json.dumps(model, separators=(",", ":"), ensure_ascii=False).encode()
    metadata += b" " * (-len(metadata) % 4)
    result = (struct.pack("<III", 0x46546C67, 2, 28 + len(metadata) + len(chunks))
              + struct.pack("<II", len(metadata), 0x4E4F534A) + metadata
              + struct.pack("<II", len(chunks), 0x004E4942) + chunks)
    if len(result) < len(original):
        path.write_bytes(result)
    print(f"{path.name}: {len(original) / 1e6:.2f} MB -> {min(len(result), len(original)) / 1e6:.2f} MB")


if __name__ == "__main__":
    for model_path in Path("public/models").glob("*.glb"):
        optimize(model_path)
