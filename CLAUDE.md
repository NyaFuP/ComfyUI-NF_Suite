# CLAUDE.md — NyaFu ComfyUI Custom Node Suite

このファイルはClaude Codeが毎セッション最初に読むプロジェクト指針です。
設計判断が変わったら、コードより先にこのファイルを更新すること。

## プロジェクト概要

ComfyUI用のカスタムノード群を、共通基盤の上に段階的に作る。

| パッケージ | 役割 | 状態 |
|---|---|---|
| Core | 共通Python API、JSONストレージ、共通Vueコンポーネント | 未着手 |
| Prompt Template | JSONテンプレートの選択・編集・保存・変数展開 | **最初に実装** |
| Independent Queue | ノード単体のQueueボタンで独立実行 | 未着手 |
| Image Selector | 候補画像を一覧→1枚選択→後半ワークフローを再開 | 未着手 |

Prompt Templateを最初に作る理由:GPU処理を含まないので、フロントエンド、Python API、永続化の基盤だけを切り分けて検証できるため。

以前、同じ目的のツールをHTMLベースのブラウザUIで作っていた。今回はその編集UIをComfyUIの中だけで完結させることが目的。

## ディレクトリ構成

パッケージ名(フォルダ名)は `NF_Suite`。フォルダ名は `/extensions/NF_Suite/` のURLになるので変更しない。

```
NF_Suite/
  __init__.py            # WEB_DIRECTORY="./web" と comfy_entrypoint のみ。ComfyUIのimportは関数内で遅延させる(pytestで import できるように)
  pyproject.toml         # pytest設定を含む
  core/                  # ComfyUI非依存の汎用部品(pytestで単体テスト可能)
    storage.py           # JsonDocumentStore:読み込み・検証・アトミック保存・revision
    errors.py            # NFError系(HTTPステータスとエラーコードを持つ)
  comfy_glue/            # ComfyUIに依存する部分はここだけ
    extension.py         # ComfyExtension(on_loadでルート登録、get_node_list)
    paths.py             # 保存先の解決(folder_paths)
    services.py          # TemplateLibraryのシングルトン、lookup関数
  nodes/
    prompt_template/     # node.py 以外はComfyUI非依存
      node.py            # V3 ComfyNode(runnerを呼ぶだけの薄いラッパー)
      runner.py          # ノードの処理本体:run / validate / fingerprint
      resolve.py         # ライブラリとsnapshotのどちらを使うかの判定、ウィジェット値のパース
      expand.py          # 変数展開・区切り整理・警告(純粋関数)
      schema.py          # JSONスキーマ検証・ID生成
      library.py         # TemplateLibrary:テンプレートのCRUD(JsonDocumentStoreの上)
      routes.py          # aiohttpルート(aiohttpのみに依存。登録はcomfy_glueが行う)
    independent_queue/
      node.py            # NF_IndependentQueue(通常版)と NF_IndependentQueueRun(出力ノード版、dev_only)
      preview.py         # 結果の表示内容(テキスト/画像の判定、切り詰め。純粋関数)
    empty_latent/        # NF_Toolsから移設。node_idは旧来の NFEmptyLatentImage / NFPresetEmptyLatentImage のまま
      node.py            # V3。入力名・順序・選択肢・初期値は旧ノードと同じ(保存済みワークフローの互換のため)
      dimensions.py      # 寸法計算(純粋)。旧実装と全7,680通りで一致することを確認済み
    preview_selector/
      node.py            # NF_PreviewSelector(出力ノード)と NF_PreviewSelectorSource(Continue用、dev_only)
      runner.py          # 候補の保存・表示・下流の停止/自動選択、Continue時の読み込み(純粋)
      selection.py       # 選択文字列の解釈、モードごとの選択、取り出し(純粋)
      store.py           # BatchStore:候補テンソルを一時フォルダに保存
  frontend/              # Vueソース(Viteでビルド)。package.json / vite.config.ts / tsconfig.json
    src/
      main.ts            # CSSの読み込みと registerExtension(ここの1回だけ。setupでサイドバー登録)
      env.d.ts           # 'comfy/app' 'comfy/api' の型宣言(実行時は本体の /scripts/*.js)
      core/
        comfy.ts         # ComfyUIに触る唯一の層(app/api、ウィジェット操作、addDOMWidget、toast、confirm、サイドバー登録)
        apiClient.ts     # fetchApiのラッパー、ApiError
        mountVue.ts      # 自前Vue+PrimeVue(unstyled)でマウント。{ instance, unmount } を返す
        ModalShell.vue   # 汎用モーダル枠(閉じる判断は呼び出し側。keydownを外に漏らさない)
        jobs.ts          # 部分実行の投入・追跡・キャンセル(queuePartial、reduceJob、swapClassType)
        seeds.ts         # 上流のseedを進める(randomize/follow/off。ノード風のオブジェクトを受け取る純粋ロジック)
        primevuePt.ts    # PrimeVueのpass-through(クラス名の付与)
        styles.css       # 全スタイル(ComfyUIのCSS変数+フォールバック)
      prompt_template/
        attach.ts        # nodeCreatedから呼ぶ:ウィジェットを隠し、UIウィジェットを追加・マウント
        controller.ts    # ノード1つ分:隠しウィジェット ⇔ 表示用の状態、snapshotの取得
        libraryStore.ts  # テンプレート一覧のキャッシュと作成・更新・削除(全ノード・エディタで共有)
        logic.ts         # 純粋関数:パース、sameContent、resolveTemplate(resolve.pyと同じ順序)、groupTemplates
        editorForm.ts    # 純粋関数:エディタのフォーム ⇔ テンプレート、検証、変更検知、プレースホルダー検出
        editorSession.ts # サイドバーの未保存状態を再マウントをまたいで保持
        editorModal.ts   # openTemplateEditor():モーダルを1つだけ開く
        sidebar.ts       # サイドバータブの登録
        types.ts         # 型とウィジェット名・API定数
        PromptTemplateNode.vue / VariableFields.vue
        TemplateEditor.vue / EditorModal.vue / SidebarEditor.vue
        *.test.ts        # vitest
      preview_selector/
        controller.ts    # 候補・batch_id・選択(node.properties)、Generate / Continue
        logic.ts         # 下流の出力ノード、Continue用のプロンプト書き換え、選択の操作(純粋)
        gridLayout.ts    # グリッドの配置計算(純粋)
        PreviewSelectorNode.vue / attach.ts
      independent_queue/
        attach.ts        # nodeCreatedから呼ぶ:UIウィジェットを追加・マウント
        runner.ts        # ノード1つ分の実行:seedを進める → 差し替えて投入 → 追跡
        IndependentQueueNode.vue  # Run/Cancel、状態、進捗バー、結果テキストとCopy
  web/                   # ビルド成果物(main.js、main.css、main.js.map)
  examples/templates.example.json   # 初期テンプレート(保存先にファイルがないときコピー)
  tests/
```

- テンプレートの実データはリポジトリに置かない(保存先は下記「決定事項」)
- `web/` には1ファイルだけ出力する(`inlineDynamicImports`)。ComfyUIは `WEB_DIRECTORY` 以下の `**/*.js` をすべて拡張として読み込むため
- CSSは `new URL('./main.css', import.meta.url)` を `<link>` で読み込む

## アーキテクチャ原則(必ず守る)

1. **バックエンドはUI方式に依存させない。** Python側(カスタムAPI、ジョブ管理、ストレージ)は、フロントエンドがLiteGraphでもVueノード描画でも同じように動くこと。UI固有の処理はフロント側のアダプタ層に閉じ込める。
2. **Vueは拡張側に同梱する。** ComfyUI Frontend 1.33.9以降、フロントエンドはVueを外部公開していない。フロントのVueインスタンスに依存せず、自前でバンドルしたVueを使う。参考:`jtydhr88/ComfyUI_frontend_vue_basic`
3. **公式のExtension APIだけを使う。** フロントエンドの内部実装や非公開のプロパティには触らない。移行が進行中なので、内部に依存した実装は将来壊れる。やむを得ず使う場合は、コードとこのファイルの「既知のリスク」に明記する。
4. **Pythonノードの中で待機しない。** `while not done: sleep()` のように、ユーザー操作を待つためにexecutorを占有する実装は禁止。ユーザー操作をはさむ処理は、ワークフローを前半と後半に分け、ボタン操作で後半をQueueへ投入する方式にする。
5. **ノードが持つ状態は最小限にする。** ノード(ウィジェット値)が持つのは、入力値、ID、実行要求、状態、結果の参照程度にとどめる。ボタンやプレビューのようなUIはフロントのコンポーネントとして実装する。
6. **ノードAPIはV3を使う。** 理由は下の「決定事項」を参照。

## Prompt Template ノード仕様

### UI
- 通常時のノードはコンパクトにする:テンプレート選択ドロップダウン、展開後プロンプトのプレビュー、[Edit] [Reload]ボタン
- [Edit]ではノード自体を巨大化させず、モーダルかサイドパネルでエディタを開く
- エディタに必要な機能:テンプレート一覧、新規作成、複製、削除、名前・カテゴリ・本文・negativeの編集、保存
- テンプレートを選ぶと、変数定義に合わせた入力欄をノード上に自動で生成する

### JSONスキーマ(v1案)
```json
{
  "version": 1,
  "templates": [
    {
      "id": "fantasy_01",
      "name": "Fantasy Scene",
      "category": "Scene",
      "template": "{quality}, {character}, {location}, {lighting}",
      "negative_prompt": "low quality, blurry",
      "variables": {
        "quality": "masterpiece, high quality",
        "character": "",
        "location": "",
        "lighting": "cinematic lighting"
      }
    }
  ]
}
```
- `version` を必ず持たせ、将来の形式変更時にマイグレーションできるようにする
- ライブラリは1ファイル(`templates.json`)にまとめる
- テンプレートIDは名前から自動生成(例 `fantasy_scene`、重複時は `_2` を付加)。作成後は変更しない

### 変数展開ルール
- 置換するのは `{識別子}`(`[A-Za-z_][A-Za-z0-9_]*`)だけ。`{a|b}` や `{{...}}` などはそのまま残す(Dynamic Prompts等の構文と衝突させない)
  - `{{a}}` は `a` が定義されていても置換せず、未定義・使用中のどちらにも数えない。正規表現は `(?<!\{)\{名前\}(?!\})`。Python(`expand.py`)とTS(`editorForm.ts`)の2か所にあるので、変えるときは両方を直す
- 変数の空欄は空文字として扱う
- 置換後、区切り(カンマとピリオド)と空白を行ごとに整理する。置換と整理はテンプレートの1行ずつ行う(`expand.py` の `_expand_line`)
  - 連続した区切り(`, ,` `. .` `,.` など)は1つに詰める。ピリオドが含まれていればピリオド、なければカンマを残す(文末の `{a}, {b}.` で b が空でも `x.` になるように)
  - 行頭の区切りは削除する。行末のピリオドは残す(文末のピリオドを消さないため)
  - 行末のカンマは、テンプレートの行がカンマで終わっていれば残し、そうでなければ削除する(`{a},` 改行 `{b},` のように各行の末尾に書いたカンマを残し、`{a}, {b}` で b が空のときに残るカンマは消す。2026-10-02、ユーザー判断で変更。以前は行末のカンマを常に削除していた)。値の中の改行で増えた行は、その行末のカンマをそのまま残す
  - テンプレートでは中身があった行が、値が空になったことで空になった場合は、行ごと削除する。テンプレートにもともとある空行は残す
  - 2つ以上の空白は1つにする。カンマの前の空白、および直後が空白か行末のピリオドの前の空白は削除する
  - `1.2` のような小数や `(word:1.2)` の重みは変化しない。`...` は `.` に詰まる
- 未定義の変数(そのまま残す)、未使用の変数、`()` `[]` `{}` の閉じ忘れは、エラーにせず警告を返す
- 他ノードとつなぐ入力口は `input1` と `input2`(STRING、入力口のみ、任意)の2つ(2026-10-05、ユーザー判断。2026-10-02 に `text` / `{input}` の1つで追加し、2つに変えた。互換の処理は入れていない)。つながっている入力口は、同じ名前の変数 `{input1}` / `{input2}` を置き換え、テンプレートのデフォルトやノードの入力欄より優先する。つながっていなければ普通の変数として扱う。つながっているのに同じ名前の変数がテンプレートになければ警告 `input_unused`(`var` に名前)
  - `input1` はポジティブ用、`input2` はネガティブ用という**目安**(ツールチップは付けない。ユーザー判断)。どちらの変数もポジティブ・ネガティブのどちらのテンプレートでも置き換える(ユーザー判断)
  - `fingerprint_inputs` には入力口の値を入れない(本体はリンクの値を渡さない。上流が変われば本体のキャッシュキーが変わる)
  - ノードのプレビューは、`/expand` に `inputs: {input1: '‹from input1›', …}`(つながっているものだけ)を渡して表示する。同じ名前の変数の入力欄はグレーアウトする
  - 名前の一覧は `expand.py` の `INPUT_VARS` と `types.ts` の `INPUT_VARS` の2か所。入力口の名前(`node.py`)も同じにする。変えるときはすべて直す

### ノードの入力と状態
- 入力はプレーンなウィジェット:`template_id`(STRING)、`variables`(STRING/JSON)、`snapshot`(STRING/JSON、空可)、`pin_snapshot`(BOOLEAN)、任意の入力口 `input1` / `input2`(STRING)。出力は `positive` と `negative`(STRING)
- フロントはこれらを `hidden` にし、`serialize:false` のDOMウィジェット(Vue)で編集する。拡張JSが壊れても素のテキスト欄として動くようにするため
- 変数の入力欄は本物のウィジェットとして増減させず、`VariableFields` が描画して `variables` JSONに書き込む
- `fingerprint_inputs` は、実際に使うテンプレート内容+`variables` のハッシュを返す(外部JSONの変更で再実行させる)
- `validate_inputs` で、テンプレートもsnapshotも無い場合にエラーを返す

### 保存と再現性
- テンプレートライブラリはワークフローJSONに埋め込まず、独立したJSONファイルとして持つ
- **snapshot**:テンプレートのフィールド一式+`captured_at`(`hash` は持たない。内容の比較は `template` `negative_prompt` `variables` で行う)。テンプレート選択時・Reload時・Queueのたび(`beforeQueued`)にフロントが更新する。`pin_snapshot` がONのときは更新しない
  - 内容が変わっていなければ書き換えない(Queueのたびにワークフローが「変更あり」にならないように)
  - 比較の前に必ずウィジェットから読み直す(ウィジェットが正、表示用の状態は写し)
- 実行時の解決順:`pin_snapshot` ON → snapshot/ライブラリにIDあり → ライブラリの最新/IDなし → snapshot(警告)/どちらもない → エラー
- ライブラリとsnapshotのハッシュが違えば、ノード上に「保存時から変更あり」と表示する
- 書き込みはアトミックに行う(同じフォルダの一時ファイルに書いて `os.replace`)。壊れたJSONを読んだときは読み取り専用モードにしてUIにエラーを出し、ファイルは上書きしない
- 編集の競合は `revision`(ファイル内容のハッシュ)で検出し、古い `base_revision` での書き込みは409にする

### Python API
プレフィックスは `/nyafu/prompt_template`。フロントからは `api.fetchApi()` 経由(`/api` が自動で付く)。

| メソッドとパス | リクエスト | レスポンス |
|---|---|---|
| `GET /templates` | — | `{version, revision, templates:[...], warnings:[]}` |
| `GET /templates/{id}` | — | `{template, revision}` / 404 |
| `POST /templates` | `{template, base_revision}` | 201 `{template, revision}` / 409 |
| `PUT /templates/{id}` | `{template, base_revision}` | 200 `{template, revision}` / 404 / 409 |
| `DELETE /templates/{id}` | `?base_revision=` | 200 `{revision}` / 404 / 409 |
| `POST /expand` | `{template_id? または template?, variables, inputs?}` | `{positive, negative, warnings:[{code, message, var?}]}` |
| `GET /info` | — | `{api_version, storage_path, readonly, load_error?}` |

- エラーは `{error:{code, message, details?}}`。code:`BAD_REQUEST`(400) `NOT_FOUND`(404) `CONFLICT` / `DUPLICATE_ID`(409) `INVALID_TEMPLATE` / `INVALID_LIBRARY`(422) `LIBRARY_CORRUPT`(503) `INTERNAL_ERROR`(500)
- ノードの検証・実行時のエラーコード:`NO_TEMPLATE` `SNAPSHOT_MISSING` `INVALID_VARIABLES` `INVALID_SNAPSHOT`。警告コード:`undefined_variable` `unused_variable` `unbalanced_bracket` `snapshot_outdated` `template_missing` `library_unavailable` `input_unused`
- 全エンドポイントを実装済み(書き込み系はエディタのフェーズで追加)。`base_revision` がないと400。DELETEはクエリ `?base_revision=` で渡す
- フロントの書き込み(`libraryStore` の createTemplate / updateTemplate / deleteTemplate)は、常に手元の `library.revision` を送る。409のときはライブラリを読み直してからエラーを投げる(フォームの編集内容は残り、もう一度保存すると新しいrevisionで送られる)
- 複製専用のAPIは作らない(フロントでコピーしてPOST)
- 展開ロジックはPythonの `/expand` に一本化し、TypeScriptで二重実装しない

### フロントエンド
- エディタ(`TemplateEditor.vue`)はモーダルとサイドバーの両方で使う。表示場所ごとに別のVueアプリとして起動し、状態は共有の `libraryStore` にまとめる
  - モーダル:自前の `Modal.vue` を `document.body` にマウント
  - サイドバー:`registerSidebarTab({type:'custom', render})` の中で `createApp`
- Vueアプリはノードごとではなくウィジェット単位で管理し、`onRemove` でunmountする(`node.id` はサブグラフ間で重複するため)
- PrimeVueは同梱し、**unstyledモード**で使う。スタイルは自前のCSSで付け、ComfyUIの `--p-*` 変数を参照する。アイコンは本体が読み込み済みのPrimeIcons(`pi pi-*`)を使う
  - M2のスパイクで確認済み:同梱PrimeVueは `<style>` を1つも追加せず、本体のスタイルと衝突しない
  - クラスは `primevuePt.ts` で付ける。状態は PrimeVue が付ける `data-p-*` 属性(`data-p-selected` など)で指定する
- ノードの `template_id` `variables` `snapshot` は隠し、`pin_snapshot` は本体のBOOLEANウィジェットのまま表示する
- 変数の入力欄(`VariableFields`)はM2で実装済み。ラベル、値(空なら `(empty)`)、デフォルトに戻すボタン
- ワークフローの読み込み・貼り付け・Undoでは `node.onConfigure` をフックして、表示をウィジェットから読み直す
- UIの文言は英語(ComfyUI本体に合わせる)

### Template Editor
- 左に一覧(PrimeVue Listbox:カテゴリ別、検索付き)、右にフォーム。フォームは名前、カテゴリ(既存カテゴリの候補付き)、ID(表示のみ。初回保存時にサーバーが名前から付ける)、テンプレート、negative、変数の表(名前/デフォルト/削除)、プレビュー(デフォルト値で展開)
- 操作:New、Duplicate(保存済みの内容をコピー。IDなしで新規作成)、Delete(確認あり)、Save(Ctrl+Sでも可)、Revert、Reload、[Add missing](テンプレートとnegativeに出てくる未定義の `{名前}` を変数に追加)
- 検証:名前が空、変数名が不正、変数名の重複はエラーにして Save を押せなくする
- 未保存の変更があるときに、別のテンプレートを選ぶ・New・Duplicate・モーダルを閉じる(Esc/×/背景クリック)と、本体の確認ダイアログで確認する
- モーダル:ノードの[Edit]で開き、ノードのテンプレートを最初に表示する。同時に開くのは1つだけ(開いているときに[Edit]を押すと、そのテンプレートに切り替える)
- サイドバー:`registerSidebarTab({type:'custom'})`。幅が狭いときはコンテナクエリで一覧とフォームを縦に並べる。別のタブに切り替えるとUIは破棄されるので、未保存の状態を `editorSession.ts` に残し、戻ったときに復元する
- 別の場所(もう一方のエディタ、Reload)で変更されたとき、手元に未保存の変更がなければフォームをその内容に更新する。変更があれば手元を優先し、保存時の409で気づけるようにする
- テンプレートを保存しても、ノードのsnapshotは更新しない(ノードには「snapshot取得後に変更あり」と表示し、次のQueueで更新される)

## Independent Queue(**実装済み** 2026-09-30。pytest 157件、vitest 91件、Nodes 2.0とLiteGraphで実機確認済み。LLMでの生成も2026-10-01にユーザーが実機で確認済み)

### 用途
1. **LLMでのプロンプト生成を繰り返す**(第一の目的。`custom_nodes/NF_LLM-Prompt` の `TextToImagePrompt` / `ImageToPrompt`)
2. 上流の処理を繰り返し、選んだ結果を下流に流す(第二の目的。Image Selectorのフェーズで同じ仕組みを使って実現する)

### 仕組み
- ノード `NF_IndependentQueue`:入力 `value`(どの型でも受け付ける)1つ、**出力なし**(出力を持つと、通常の[Run]でも実行されてしまうため)
- 通常は出力ノードでない種類。[Run]のときだけ、投入するプロンプト上で出力ノード版 `NF_IndependentQueueRun`(メニューに出さない)に差し替え、`partial_execution_targets` にこのノードだけを指定する
  - 通常の[Run]では、どの出力の上流でもないので実行されない
  - ノードIDは元のままなので、本体の `executed` 処理で、プレビュー画像や実行中表示がこのノードに付く
- 投入は `app.graphToPrompt()` → 差し替え → `api.queuePrompt(…, { partialExecutionTargets })`。prompt_idを受け取り、そのイベント(`progress_state` / `executing` / `executed` / `execution_success|error|interrupted`)だけを見て、ノード内に状態を表示する。待機中のジョブの後ろに入る(先頭に割り込まない)
- キャンセル:実行中は `api.interrupt(prompt_id)`、待機中は `/queue` の delete
- **seed:** [Run]の前に、上流の制御付きINT(seedなど)を進める。既定は `randomize`(制御の設定に関係なく乱数にする)。ほかに `follow`(各ノードの制御の設定に従う)と `off`(変えない)を選べる
  - 制御ウィジェットは、名前ではなく、対象ウィジェットの `linkedWidgets` からたどる
- 結果の表示:テキスト(Copyボタン付き)、画像は本体がノードに表示、それ以外は型名と概要
- 投入・追跡・キャンセル・プロンプトの差し替え・ダミー入力の追加は、Coreの `frontend/src/core/jobs.ts` にまとめ、Image Selectorでも使う
- 最初はルートのグラフに置いたノードだけに対応する(サブグラフ内では「ルートに置いてください」と表示する)
- 「単体のPython処理」を独自APIで直接実行する方式は作らない(現時点で用途がない)
- どのノードでも「ここまで実行」できるメニューは後回し

### プロンプト生成での使い方
LLMノードのseedの制御は `fixed` にしておく → Independent Queueの[Run]でseedが変わり、プロンプトが生成し直される → 気に入ったら通常の[Run] → LLMノードは同じseed・同じ入力なのでキャッシュが使われ、選んだプロンプトがそのまま使われる(2026-10-01、ユーザーが実機で確認済み)

### 実装の順番
1. NF_LLM-Promptにseedを追加し、改善する(**完了** 2026-09-30。下記)
2. Coreの `jobs.ts` と `seeds.ts`(**完了**)
3. Independent Queueノード(**完了**)

### 実装で決めたこと・分かったこと
- `seed_mode` はPython側のComboウィジェット(本体の標準UI。ワークフローに保存される)。バックエンドは値を使わない
- 完了数は「対象ノードとその上流」に限って数える。`execution_cached` は、プロンプト上でキャッシュが効いたノードをすべて列挙するため(対象外のノードも含まれる)
- 本体の `executing` イベントはprompt_idを落とす(`api.ts` がノードIDだけを渡す)。実行中ノードと進捗は、prompt_id付きの `progress_state` から取る
- `nodeCreated` の時点ではノードはまだグラフに追加されていない(`node.graph` が空)。サブグラフかどうかは「グラフが設定済みで、かつルートではない」ときだけ判定し、[Run]時にも改めて確かめる
- 投入エラーは、`validate_inputs` が入力の数だけ繰り返す同じメッセージを1つにまとめて表示する
- 実行結果はノードのUIだけが持つ(ページを読み込み直すと消える)。画像は本体がノードに表示する
- キャンセルの実機確認はできていない(数秒以上かかる処理がないため)。待機中の削除と実行中の中断の呼び分けは、vitestで確認済み

### NF_LLM-Promptの変更(2026-09-30)
- `TextToImagePrompt` / `ImageToPrompt` に `seed` を追加(任意の入力で、最後に置く。制御の初期値は `fixed`)。OpenAI互換APIには `seed`、Geminiには `generationConfig.seed` として渡す。サーバーがseedを理由に拒否した場合(4xxでseedに言及)は、seedなしで1回再送する
- APIキーの保存先を、`custom_nodes/NF_LLM-Prompt/config.json` から `user/__nf_llm_prompt/config.json` に移した(初回読み込み時に自動で移行し、元のファイルは `config.json.migrated` に改名)
- `LLMProviderConfig` からAPIキーの入力をなくした(ウィジェットの値はワークフローや画像のメタデータに保存されるため)。代わりに、保存されないパスワード欄(DOMウィジェット)から `POST /api/comfy_llm_prompt/config` で設定する。状態取得の応答にキーは含めない
- モデル一覧のAPIは、URLのクエリからAPIキーを受け取らない。Geminiのキーは、URLではなく `x-goog-api-key` ヘッダーで送る
- ルートは `api_routes.py` に切り出した。pytest 35件。`git init` 済み(コミットはまだしていない)。フロントの拡張は公式の登録方法に書き直した

## Preview Selector(旧称 Image Selector。2026-10-01 **実装済み**。pytest 189件、vitest 107件、Nodes 2.0とLiteGraphで実機確認済み)

NF_Tools の `NFPreviewSelector2` をNF_Suiteに統合し、待機方式を部分実行に置き換える。優先順位:1. 統合 → 2. 部分実行による[Continue] → 3. グリッド表示の改善。

### 旧実装(NF_Tools)からの変更
- 旧実装はノード内で `time.sleep(0.1)` を繰り返して選択を待っていた(原則4違反、最大300秒キューを占有)。待機はやめ、`timeout` 入力はなくす
- 独自WebSocketイベント(`nf_preview_request_2`)と独自API(`/nf_preview_response_2`)は使わない。候補はノードのUI出力で、選択は[Continue]時のプロンプトで渡す
- ノードサイズのスナップショットと復元(`_nfPreferredSize`)、`app.queuePrompt` の差し替えはやめる
- NF_Tools は 2026-10-01 に削除した(ユーザー判断)。旧ノード `NFPreviewSelector2` には `io.NodeReplace` で `NF_PreviewSelector` への置換を登録している(`comfy_glue/extension.py`)。旧ノードを含むワークフローを開くと、エラーパネルに「Replace Node」が出て、同じノードID・リンク・`mode` のまま置き換わる(実機で確認済み。`timeout` は捨てる)
- グリッド:等倍を超える拡大を許可、切り替えの感度は現状(SAME_SIZE 2%、HYSTERESIS 4%)で確定

### ノード
- `NF_PreviewSelector`(出力ノード):入力 `images`、`mode`(review_and_select / pass_through / take_first / take_last)、`seed_mode`、任意の `latents`。出力 `selected_images` / `selected_latents` / `selection_indices`(旧ノードと同じ並び)
  - review_and_select:候補を一時フォルダにPNGで保存し、テンソル(画像とlatent)を `BatchStore` に保存して `batch_id` を得る。UI出力 `nf_candidates`(画像の参照)と `nf_batch`(batch_id)を返し、**3つの出力すべてに `ExecutionBlocker(None)` を返して下流を静かに止める**
  - それ以外のモード:候補を表示しつつ、選んだものをそのまま出力する
  - UI出力のキーを `images` にしないこと(本体がノードに画像プレビューを追加してしまう)
- `NF_PreviewSelectorSource`(出力ノードではない、dev_only):入力 `batch_id` / `selection`(例 "0,2")。`BatchStore` から読み込み、選んだものを出力する。[Continue]のときだけ、プロンプト上でセレクターをこの種類に差し替える(上流へのリンクは消す)
- `BatchStore`:`temp/nf_preview_selector/<batch_id>.pt` に `torch.save`。一時フォルダはComfyUIの起動時に消える。保存数に上限を設けて古いものから消す
- `block_execution` はノードが値を返したときしか効かない(`execution.py`)ので、`ExecutionBlocker(None)` を値として返す。メッセージがNoneなら下流はエラーにならずに止まる

### フロントエンド
- 状態(候補の参照、batch_id、選択)は `node.properties` に持つ(ワークフローに保存され、プロンプトには入らない)。候補は `node.onExecuted` で受け取る(通常の[Run]でも[Generate]でも同じ経路)
- [Generate]:上流のseedを `seed_mode` に従って進め、セレクター自身を対象に部分実行する(もともと出力ノードなので差し替え不要)
- [Continue]:下流の出力ノード(プロンプト上でセレクターの子孫、かつ出力ノード)を対象に部分実行する。セレクターは `NF_PreviewSelectorSource` に差し替え、`batch_id` と `selection` を入力に入れる。出力ノードかどうかは `api.getNodeDefs()` の `output_node` で判定する(1回だけ取得してキャッシュ)
- `core/jobs.ts` の `queuePartial` は対象を複数受け取れるようにする
- グリッド:ノードサイズを決めるのはユーザーだけ。画像が届いてもノードサイズは変えない。配置は、今の表示領域の中で画像が最も大きくなる列数を選び、セルの大きさをpxで決める(中身がノードの大きさに影響しないよう、グリッドは絶対配置にする)

### 実装で決めたこと・分かったこと
- ファイル:`nodes/preview_selector/`(`node.py` / `runner.py` / `selection.py` / `store.py`)、`frontend/src/preview_selector/`(`controller.ts` / `logic.ts` / `gridLayout.ts` / `PreviewSelectorNode.vue` / `attach.ts`)。プロンプトの純粋な関数は `core/prompt.ts` に分けた(`core/jobs.ts` は本体のモジュールをimportするため、テストから直接読み込めない)
- `computeGridLayout`:セルは画像と同じ縦横比で、等倍を超えて拡大してよい。大きさの差が2%以内なら余るセルが少ない配置を優先し、今の列数は、他の配置が4%以上大きくならない限り維持する(リサイズ中のちらつき防止)
- 縦横比は1枚目の画像の実寸から取る(バッチ内は同じ大きさが前提)
- 新しいノードだけ初期サイズ(420×480)にする。それ以外でノードサイズを変える処理はない(`fitNodeHeight` も使わない)
- 幅が380px以下のときは、下部のバーを2行にする(コンテナクエリ)
- 画像の右クリック:**本体のノードメニューに「Copy Image / Open Image / Save Image (#n)」を追加する**(`getNodeMenuItems`、`preview_selector/menu.ts`。2026-10-01、ユーザー判断)
  - ブラウザ標準のメニューを使う案(A案、`c40d232`)は破棄して `git revert` した。画像に `pointer-events` を戻すと、画像の上でホイールによるズームが効かなくなるため。**画像の `pointer-events: none` は外さないこと**
  - 対象の画像:直前(1.5秒以内)に右クリックした画像 → 選択中の最初の画像 → #1(`contextMenu.ts` の `menuTargetIndex`)。候補がない・期限切れのときは項目を出さない
  - Nodes 2.0:画像の右クリックはノード要素の `@contextmenu` まで伝わり、本体がノードメニューを開く。こちらは右クリックした画像を記録するだけ
  - LiteGraph:ギャラリーはキャンバスの上のDOMなので、キャンバスに右クリックが届かない。画像の右クリックで既定動作を止め、`LGraphCanvas.adjustMouseEvent` + `processContextMenu` でノードメニューを開く(`core/comfy.ts` の `openNodeContextMenu`)。どちらも公開メソッドだが、本体の内部に近い
  - 画像の枠のボタンは `disabled` を使わず `aria-disabled`(無効なボタンには右クリックのイベントが届かないため)
  - Copy Imageは `navigator.clipboard.write` + `ClipboardItem`。`write()` はクリック内で即座に呼び、画像はPromiseで渡す(先に `fetch` を待つとユーザー操作の扱いが切れることがある)。https/localhost以外では使えず、拒否されたときは「Open Imageを使って」と案内する
  - ブラウザペイン(Claude Codeの確認環境)ではクリップボードの書き込み権限が `denied` で、Open Imageは同じタブで開く。コピーの成功は通常のChromeで確認すること
- 候補の画像が読み込めない(ComfyUIを再起動して一時ファイルが消えた)ときは「もう一度Generateしてください」と表示し、Continueを押せなくする
- `batch_id` は「20桁の単調増加ナノ秒 + 乱数12桁」。Windowsではファイルの更新時刻が粗く、連続保存の順序を時刻で判断できないため
- `queuePartial` は `targetIds`(配列、またはプロンプトを受け取って対象を返す関数)を受け取る
- テストの実行では、件数だけでなく終了コードも見ること(vitestは、読み込みに失敗したテストファイルがあっても「n passed」と表示する)
- `ResizeObserver` の通知は描画のタイミングで届く。ブラウザペインが描画されていないと、計測値が古いままになる(テスト時の注意)

## 開発の進め方

1. 調査:ComfyUI Custom Node Skills、現行ComfyUI/Frontendのバージョン、公式Extension API、Vue同梱方式のサンプル
2. 設計:Plan Modeで設計を出し、NyaFuのレビューを受けてから実装する
3. 最小構成:Core+「テンプレートを1つ選んで文字列を出力するだけ」のノード
4. Template Editorを実装
5. その後にIndependent Queue → Image Selector

- 各フェーズの最後に、ComfyUIを起動して確認する手順を書き出す
- Python側のストレージとテンプレート展開ロジックにはpytestでテストを書く
- 大きな設計変更や新しい依存パッケージの追加は、実装前に確認を取る

## 最小構成の実装手順(M0〜M2)

- M0(**完了** 2026-09-29):`pyproject.toml`、`.gitignore` を用意(`git init` と `web/` のコミットは 2026-10-01 に実施)
- M1(**完了** 2026-09-29。pytest 128件、実機でノード実行を確認済み。Pythonのみ):`storage.py` `expand.py` `schema.py` とpytest → 読み取り系API(`GET /templates` `GET /templates/{id}` `POST /expand` `GET /info`)→ V3ノード本体(この段階ではSTRINGウィジェットがそのまま見える)
- M2(**完了** 2026-09-30。Nodes 2.0とLiteGraphの両方で実機確認済み。vitest 32件):冒頭でPrimeVue unstyledの共存を確認するスパイク → Viteの1ファイルビルド → `PromptTemplateNode`(ドロップダウン、プレビュー、Reload)→ snapshotの自動更新。Editは次のフェーズ
- Template Editor(**完了** 2026-09-30。pytest 147件、vitest 59件、実機確認済み):書き込みAPI → エディタのフォームのロジック → `TemplateEditor.vue` → モーダルとサイドバー

### 動作確認の手順
1. venvを有効にして `python main.py --port 8189`。ログの「Import times」にNF_Suiteがエラーなしで出ること
2. `curl http://127.0.0.1:8189/api/nyafu/prompt_template/templates` で一覧が返ること
3. ノードを追加 → テンプレートを選択 → プレビューが出ること
4. 出力を「Preview as Text」につないでQueue → 出力文字列を確認
5. 設定の「Nodes 2.0」をONにして3〜4を繰り返す
6. JSONを外部で編集 → Reload → プレビューが変わり、再実行されること
7. JSONをわざと壊す → UIにエラーが出て、ファイルが上書きされないこと
8. ワークフローを保存 → ブラウザ再読み込みで状態が戻ること。テンプレートを削除してもsnapshotから実行できること
9. `pytest tests/`
10. フロントを変更したら `cd frontend` → `npm test`(vitest)→ `npm run build`(型チェック+ビルド)。ブラウザを再読み込みすれば反映される(サーバーの再起動は不要)

## 決定事項(実装しながら追記)

- パッケージ:スイート全体を1パッケージ `NF_Suite` にする(旧フォルダ名 `NF_Prompt_Template` からリネーム済み)
- ノードAPI:**V3**(`comfy_api.latest`)。公式推奨で、本体ノードもすべてV3。`fingerprint_inputs` / `validate_inputs` が使える。1モジュールでV1とV3は混在できない(`NODE_CLASS_MAPPINGS` があると `comfy_entrypoint` が無視される)ので、スイート内はすべてV3にする
- 確認した環境:ComfyUI 0.22.0(commit `ea62dc11`)、Frontend 1.44.19、Python 3.12.8(venv)、Node v24.5.0
- 対応する最小のComfyUI Frontendバージョン:**1.44.19**。型定義 `@comfyorg/comfyui-frontend-types` も1.44.19に固定
- テンプレート保存場所:通常は `user/__nf_prompt_template/templates.json`(`folder_paths.get_system_user_directory` で、HTTPのuserdata APIからは触れない領域)。環境変数 `NF_PROMPT_TEMPLATE_DIR` で変更可能
- 拡張の登録は `WEB_DIRECTORY` で行う。`nodes.EXTENSION_WEB_DIRS` は直接触らない
- 依存パッケージ:Python(venv)に `pytest`。フロントに `vue` ^3.5 / `primevue` ^4.5(本体と同じメジャー。5系は使わない)/ `vite` ^7 / `@vitejs/plugin-vue` ^6 / `typescript` ~5.9(7系はvue-tscが使うJS APIがないため使わない)/ `vue-tsc` ^3 / `@comfyorg/comfyui-frontend-types@1.44.19`
- バンドルサイズ:main.js 約454KB(gzip 約109KB。エディタ追加後)
- フロントのテスト:`vitest` ^5(環境は node)。テストは `src/**/*.test.ts` に置く。ComfyUIに触る `@/core/comfy` は `vi.mock` で偽物に置き換え、ノードはウィジェット配列だけの偽物で表す(`controller.test.ts` を参照)
- UIの文言は英語で確定
- Git:2026-10-01 に `git init`。`web/`(`main.js` / `main.css` / `main.js.map`)もコミットする(git clone や ComfyUI Manager からのインストールでビルドなしに動かすため)。**フロントのソースを変えたら、`npm test` と `npm run build` を通してから、`frontend/src` と `web/` を同じコミットに入れること**
- 起動:開発時は `python main.py --port 8189`(venvを有効にして)。普段は `start.bat`(ポート8188、`--enable-manager`)

## 既知のリスク

- ComfyUIのフロントエンドは移行の途中。確認したバージョンとAPIをここに記録する
- `comfy_api.latest` は `STABLE=False`。`v0_0_2` も中身は `latest` の再exportで、バージョン固定にならない
- ComfyUIは `WEB_DIRECTORY` 以下の `**/*.js` をすべて拡張として読み込む(`server.py`)。Viteがチャンクを分割すると、それも読み込まれる
- 同梱したVueのコンポーネントは `registerSidebarTab({type:'vue'})` と `dialog.showExtensionDialog` に渡せない(本体とVueのランタイムが別)。`type:'custom'` と自前のModalを使う
- 同梱PrimeVueをスタイル付きモードで動かすと、本体のテーマ(`<style>`)を上書きするおそれがある。unstyledモードで回避している(M2で確認済み)
- ウィジェットを隠すには `widget.hidden = true`(LiteGraph用)と `widget.options.hidden = true`(Nodes 2.0用)の両方が必要。`options` は**オブジェクトを差し替えず、その場で書き換える**こと。Nodes 2.0は widgetValueStore に登録された元の `options`(同じ参照)を上に重ねて読むため、差し替えると効かない
- `LGraphNode` とウィジェットの型は `@comfyorg/comfyui-frontend-types` から名前付きでexportされていない。`ComfyExtension['nodeCreated']` の引数から取り出している。`addDOMWidget` `beforeQueued` `widget.serialize` は型にないので `core/comfy.ts` で自前で宣言している
- `beforeQueued` は同期関数。snapshotはサーバーに問い合わせず、キャッシュ済みのライブラリから作る。外部でJSONを編集してReloadしないままQueueすると、snapshotは古い内容になる(バックエンドは最新のファイルで実行し、`snapshot_outdated` をログに出す)
- 選択肢の一覧(PrimeVueのSelect)は `document.body` に出す。一覧を開いたままキャンバスを動かすと、一覧は元の位置に残る
- 自前モーダルの z-index は 1000。同梱PrimeVueのオーバーレイ(1001〜)と本体のダイアログ(1101〜)がその上に出る。本体の確認ダイアログは `app.extensionManager.dialog.confirm` を使う(`core/comfy.ts` の `confirmDialog`)
- モーダルとサイドバーは外枠で `keydown` の伝播を止めている。本体のショートカット(windowのkeydownをバブリングで受ける)がグラフに作用しないようにするため
- PrimeVue Listbox は選択状態を内部にも持ち、`model-value` が変わらないと表示を戻さない。選択を取り消したとき(確認でCancel、選択中の項目の再クリック)は、値をいったん別の値にしてから戻して表示を同期している(`TemplateEditor.vue` の `resyncListSelection`)
- `@container` の条件は、`container-type` を付けた要素の子孫にしか効かない。エディタは外側の `.nf-editor-host` をコンテナにしている
- PrimeVueのunstyledモードで出る要素の属性は推測せず、実際のDOMで確かめてからCSSを書く(例:検索欄は `data-pc-name="pcfiltercontainer"` / `"pcfiltericoncontainer"`)
- 部分実行(`partial_execution_targets`)の対象になるのは、`OUTPUT_NODE` のノードだけ(`execution.py` の `validate_prompt`)。それ以外を指定すると400(`prompt_no_outputs`)。V3の `has_intermediate_output` は考慮されない
- 部分実行では、本体のseed自動更新(`control_after_generate`)が働かない(`widgets.ts` の `valueControl` が `isPartialExecution` を見ている)
- キャッシュのキーには、プロンプト上のそのノードの入力キーが**すべて**含まれる(`caching.py`)。宣言されていない定数の入力は実行時に無視される(`get_input_data`)。この2つを利用すると、ダミー入力を足すだけでノードの再実行を強制できる(V1/V3とも実験で確認。seedを持たないノード向けの予備の手段)
- キャッシュが効いた出力ノードでも、`executed` は再送される(実験で確認)
- このバージョンには、ジョブ単位のキャンセルAPI(`cancelJob`、`/api/jobs/{id}/cancel`)がない。実行中は `/interrupt` にprompt_idを渡し、待機中は `/queue` のdeleteで消す
- `app.queuePrompt(…, queueNodeIds)` はprompt_idを返さない。`api.queuePrompt` を直接使うとprompt_idは得られるが、ウィジェットの `beforeQueued` は呼ばれず、本体の実行中ジョブの記録にも登録されない
- 入力定義で `control_after_generate` に文字列(例 `"fixed"`)を指定すると、本体のフロントは、それを制御ウィジェットの**名前**にも使う(本体の `PrimitiveInt` でも名前が `fixed` になる)。制御ウィジェットは名前で探さず、対象ウィジェットの `linkedWidgets` からたどること
- 上流をたどるときに `node.getInputNode(slot)` を使わない。Frontend 1.53.6 の `SubgraphNode` は `getInputLink(slot)` を上書きしており、入力の番号でサブグラフの**出力**側(`subgraph.outputNode.slots`)を引くため、多くのスロットで「Cannot read properties of undefined (reading 'getLinks')」になる。`node.graph.getLink(input.link)` → `getNodeById(origin_id)` で解決し、サブグラフノードは `subgraph.nodes` で中に入る(`core/seeds.ts` の `collectUpstream`、2026-10-02 実機で確認)
- 旧ノードの互換:ノードを別パッケージから移すときは node_id・入力名・ウィジェットの順序を変えない(workflow JSON の `widgets_values` は位置で復元される)。変えるときは `io.NodeReplace` を登録する。`old_widget_ids` は旧ノードのウィジェットの並び順(リンク入力は含めない)
- (NF_Toolsから引き継いだ知見)`addDOMWidget` のオプションに `computeSize` を入れないこと。オプションはウィジェット本体にコピーされ、LiteGraphは `widget.computeSize` があると高さ固定のレイアウトを使うため、ノードの縦方向のリサイズができなくなる。最小の高さは `getMinHeight` で指定する
- npm 11 で vitest 4系を入れると、依存解決が `Cannot read properties of null (reading 'edgesOut')` で失敗する(クリーンな状態でも再現)。vitest 5系なら入る
- venvの `python.exe` は本体のPythonを子プロセスとして起動する。Claude CodeのTaskStopでは親しか止まらず、ポート8189を持つ子プロセスが残ることがある。止めるときは `main.py --port 8189` を含むpythonプロセスをすべて止める
- ブラウザのコンソールに出る「ComfyApp graph accessed before initialization」は、`app.rootGraph` をグラフの初期化前に読んだときに本体が出すもの。**発生源は未特定**(以前「NF_Tools由来」と書いたのは誤り。NF_Tools削除後も読み込みのたびに出る)。NF_Suiteは操作時にしか `rootGraph` を読まず、`app.isGraphReady` で確認してから読む(`core/comfy.ts`)
- Vueノード描画(Nodes 2.0)では、DOMウィジェットの要素が別の親要素へ付け替えられる。親の参照を保持しない、サイズは `ResizeObserver` で追う、ホイールイベントは自前で止める
- `addDOMWidget` と `widget.hidden` は内部API系統(`scripts/domWidget`)に属する。安定して使えるimportは `scripts/app.js` と `scripts/api.js` のみ
- `--p-*` のCSS変数は公式に保証された仕様ではない
- システム側のPythonには古いFrontend 1.28.9が入っている。必ずvenvを有効にしてから起動する
- ComfyUI本体の `.gitignore` が `/custom_nodes/` を除外しているため、NF_Suiteはまだどのリポジトリにも入っていない
- `validate_inputs` がエラーを返すと、ComfyUIは受け取った入力の数(4つ)だけ同じエラーを並べる(`execution.py` の仕様)。見た目の問題だけなので、そのままにしている
- テストの実行は `cd custom_nodes/NF_Suite` から `..\..\venv\Scripts\python.exe -m pytest`。`tests/conftest.py` が `custom_nodes` を `sys.path` に追加し、`NF_Suite` をパッケージとしてimportする
