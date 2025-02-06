# typeshareを実行して、src/types/invokeGenerate.d.tsに変換する
typeshare:
	typeshare src-tauri/src/types.rs src-tauri/src/error.rs --lang=typescript --output-file=src/types/invokeGenerate.d.ts
