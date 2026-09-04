pub struct SingleInstanceLock {
    socket_path: std::path::PathBuf,

    #[cfg(target_os = "windows")]
    listener: std::sync::OnceLock<uds_windows::UnixListener>,
    #[cfg(target_family = "unix")]
    listener: std::sync::OnceLock<std::os::unix::net::UnixListener>,
}

impl SingleInstanceLock {
    pub fn new(app_name: &str) -> Self {
        let socket_path =
            std::env::temp_dir().join(format!("{}-single-instance-lock.sock", app_name));

        // If a stale socket file exists and nothing is listening, remove it
        if socket_path.exists() {
            #[cfg(target_family = "unix")]
            let can_connect = std::os::unix::net::UnixStream::connect(&socket_path).is_ok();
            #[cfg(target_os = "windows")]
            let can_connect = uds_windows::UnixStream::connect(&socket_path).is_ok();

            if !can_connect {
                let _ = std::fs::remove_file(&socket_path);
            }
        }

        Self {
            socket_path,
            listener: std::sync::OnceLock::new(),
        }
    }

    /// Attempts to forward the command line arguments to the existing instance of the application.
    /// Returns true if the arguments were forwarded successfully, false otherwise.
    pub fn forward_arguments(&self) -> bool {
        use std::io::Write;

        #[cfg(target_family = "unix")]
        let connect = || std::os::unix::net::UnixStream::connect(&self.socket_path);
        #[cfg(target_os = "windows")]
        let connect = || uds_windows::UnixStream::connect(&self.socket_path);

        let Ok(mut stream) = connect() else {
            return false;
        };

        let args: Vec<String> = std::env::args().collect();
        let payload = args.join("\0");

        stream.write_all(payload.as_bytes()).is_ok()
    }

    /// Listens for the next incoming connection from another instance and returns its arguments.
    /// Returns None if the connection is closed or the payload is empty.
    pub fn incoming(&self) -> Option<Vec<String>> {
        #[cfg(target_family = "unix")]
        let listener = self.listener.get_or_init(|| {
            std::os::unix::net::UnixListener::bind(&self.socket_path)
                .expect("failed to bind socket")
        });
        #[cfg(target_os = "windows")]
        let listener = self.listener.get_or_init(|| {
            uds_windows::UnixListener::bind(&self.socket_path).expect("failed to bind socket")
        });

        use std::io::Read;
        let mut stream = listener.incoming().flatten().next()?;

        let mut buf = Vec::new();
        stream.read_to_end(&mut buf).ok()?;

        let payload = String::from_utf8_lossy(&buf).to_string();
        let args: Vec<String> = payload.split('\0').map(String::from).collect();
        let args: Vec<String> = args.into_iter().filter(|a| !a.is_empty()).collect();

        (!args.is_empty()).then_some(args)
    }
}
