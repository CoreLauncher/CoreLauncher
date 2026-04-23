// Global values
@group(0) @binding(0) var<uniform> window_size: vec2<f32>;

// Helper functions
fn pixel_to_device_coordinates(pixel_coordinates: vec2<u32>) -> vec4<f32> {
    let normalized = vec2<f32>(pixel_coordinates) / window_size;
    let device_coords = normalized * vec2<f32>(2.0, -2.0) + vec2<f32>(-1.0, 1.0);
    return vec4<f32>(device_coords, 0.0, 1.0);
}

// Rectangle drawing
@group(1) @binding(0) var<storage, read> rectangles: array<Rectangle>;

struct Rectangle {
    x: u32,
    y: u32,
    width: u32,
    height: u32,
    color: vec4<u32>,
}

struct RectangleOutput {
    @location(0) @interpolate(flat) index: u32,
    @builtin(position) position: vec4<f32>,
    @location(1) color: vec4<u32>,
}

@vertex
fn vs_rectangle(
    @builtin(vertex_index) vertex_index: u32,
    @builtin(instance_index) instance_index: u32
) -> RectangleOutput {
    let rectangle = rectangles[instance_index];

    let positions = array(
        vec2<u32>(rectangle.x, rectangle.y),                          // top-left (0)
        vec2<u32>(rectangle.x + rectangle.width, rectangle.y),        // top-right (1)
        vec2<u32>(rectangle.x, rectangle.y + rectangle.height),       // bottom-left (2)
        vec2<u32>(rectangle.x + rectangle.width, rectangle.y + rectangle.height), // bottom-right (3)
    );

    let position = positions[vertex_index];

    var output = RectangleOutput();
    output.position = pixel_to_device_coordinates(position);
    output.index = instance_index;
    output.color = rectangle.color;
    return output;
}

@fragment
fn fs_rectangle(
    input: RectangleOutput,
) -> @location(0) vec4<f32> {
    return vec4<f32>(input.color) / 255;
}
