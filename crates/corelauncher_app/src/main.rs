use std::env;

fn main() {
    println!("Hello, world!, {:?}", env::args().collect::<String>());
}
