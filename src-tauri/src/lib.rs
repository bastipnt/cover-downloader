// #[derive(serde::Serialize)]
// struct Output {
//   stdout: String,
//   stderr: String,
//   status: i32,
// }

// #[command]
// async fn run_command(command: String, args: Vec<String>) -> Output {
//   // validate the command first
//   // then run it
//   let output = tauri::api::process::Command
//     ::new(command)
//     .args(args)
//     .output()
//     // TODO: handle error
//     .unwrap();
//   Output {
//     stdout: output.stdout,
//     stderr: output.stderr,
//     status: output.status.code().unwrap_or_default(),
//   }
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app
          .handle()
          .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())?;
      }
      Ok(())
    })
    .plugin(tauri_plugin_fs::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
