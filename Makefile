# typeshareを実行して、src-tauri/src/types.rsをsrc/types/invokeGenerate.d.tsに変換する
typeshare:
	typeshare src-tauri/src/types.rs --lang=typescript --output-file=src/types/invokeGenerate.d.ts
