struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
}

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_index: u32,
) -> VertexOutput {
    let positions = array(
        vec4f( 0.0,  0.5, 1.0, 1.0),
        vec4f(-0.5, -0.5, 1.0, 1.0),
        vec4f( 0.5, -0.5, 1.0, 1.0)
    );

    var colors = array<vec4f, 3>(
      vec4f(1, 0, 0, 1),
      vec4f(0, 1, 0, 1),
      vec4f(0, 0, 1, 1),
    );

    return VertexOutput(
        positions[vertex_index],
        colors[vertex_index]
    );
}

@fragment
fn fs_main(vertex: VertexOutput) -> @location(0) vec4<f32> {
    return vertex.color;
}
