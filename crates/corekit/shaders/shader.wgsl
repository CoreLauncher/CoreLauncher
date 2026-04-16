@group(0) @binding(0) var<uniform> window_size: vec2<f32>;

fn pixel_to_device_coordinates(pixel_coordinates: vec2<f32>) -> vec2<f32> {
    return (pixel_coordinates / window_size) * vec2<f32>(2.0, -2.0) + vec2<f32>(-1.0, 1.0);
}

struct VertexInput {}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
}

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_index: u32,
) -> VertexOutput {
    let positions = array(
        vec2<f32>(64.0, 64.0),
        vec2<f32>(64.0, 256.0),
        vec2<f32>(256.0, 64.0),
    );

    var colors = array<vec4f, 3>(
        vec4f(1, 0, 0, 1),
        vec4f(0, 1, 0, 1),
        vec4f(0, 0, 1, 1),
    );

    var position = positions[vertex_index];
    var ndc = pixel_to_device_coordinates(position);

    return VertexOutput(
        vec4f(ndc, 0.0, 1.0),
        colors[vertex_index]
    );
}

@fragment
fn fs_main(
    vertex_output: VertexOutput
) -> @location(0) vec4<f32> {
    return vertex_output.color;
}
