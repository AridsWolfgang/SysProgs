// BUILD: rustc modules/05-rust/examples/01-ownership.rs -o own.exe && ./own.exe
fn main(){ let s=String::from("hello"); let s2=s; println!("{}", s2); }
