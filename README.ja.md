# ComfyUI-NF_Suite

[English](README.md) | 日本語

ComfyUI 用のカスタムノード集です。ノードは「Add Node」メニューの **NF Suite** カテゴリーにあります。

| ノード | カテゴリー | 概要 |
|---|---|---|
| NF Prompt Template | NF Suite/prompt | テンプレートを選び、変数を埋めてプロンプトを作る |
| NF Independent Queue | NF Suite/queue | このノードの上流だけを専用の Run ボタンで実行し、結果をノード上に表示する |
| NF Preview Selector | NF Suite/image | 生成した画像を一覧表示し、選んだ画像だけで下流を続行する |
| NF Empty Latent Image | NF Suite/latent | 長辺・アスペクト比・向きから Empty Latent を作る |
| NF Preset Empty Latent Image | NF Suite/latent | よく使うサイズのプリセットから Empty Latent を作る |

## 動作環境

- ComfyUI 0.22.0 以降（V3 ノード API）
- ComfyUI Frontend 1.44.19 以降
- Nodes 2.0（Vue ノード）と従来の LiteGraph 表示の両方に対応

## インストール

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/NyaFuP/ComfyUI-NF_Suite.git
```

ComfyUI を再起動してください。追加の Python パッケージは不要です。ビルド済みのフロントエンド（`web/`）を同梱しているので、Node.js も不要です。

## ノード

### NF Prompt Template

テンプレートライブラリからテンプレートを選び、`{変数名}` を値に置き換えて `positive` / `negative` を出力します。

1. ノードを置き、ドロップダウンでテンプレートを選びます。
2. テンプレートの変数に合わせて、ノード上に入力欄が出ます。空欄は空文字として扱います。
3. 鉛筆ボタン（Edit）でエディタを開き、テンプレートの作成・複製・削除・編集ができます。左のサイドバーの「Prompt Templates」タブからも開けます。

テンプレートの書き方：

```text
{quality}, {character}, {location}, {lighting}
```

- 置き換えるのは `{名前}`（英数字と `_`）だけです。`{a|b}` や `{{a}}` などはそのまま残るので、Dynamic Prompts などの構文と併用できます。
- 置き換えたあと、空の変数で残った余分なカンマ・ピリオド・空白を整理します。
- 未定義の変数や閉じ忘れのカッコはエラーにせず、警告を出します。

他のノードのテキストを使う：

- 任意の入力口 `text` に STRING の出力（テキストノードや LLM ノードなど）をつなぐと、その文字列でテンプレートの `{input}` を置き換えます。
- `text` がつながっている間は、ノードのプレビューで `{input}` の部分が `‹from input›` と表示されます。テンプレートで変数 `input` を定義している場合、その入力欄はグレーアウトします。
- `text` がつながっていないときは、`{input}` は普通の変数として扱います。テンプレートで `input` を定義すれば、デフォルト値を入れておけます。
- `text` をつないでいるのにテンプレートに `{input}` がない場合は、ノードに警告が出ます。

テンプレートの保存と再現性：

- ライブラリは `ComfyUI/user/__nf_prompt_template/templates.json` に保存されます。環境変数 `NF_PROMPT_TEMPLATE_DIR` で保存先を変えられます。
- Queue のたびに、使ったテンプレートの内容をノードに snapshot として保存します。ライブラリからテンプレートが消えても、そのワークフローは snapshot で動きます。
- `pin_snapshot` を ON にすると、ライブラリが変わっても常に snapshot の内容を使います。

### NF Independent Queue

ワークフロー全体を実行せずに、このノードの上流だけを実行します。LLM によるプロンプト生成を気に入るまで繰り返す、といった用途向けです。

1. 結果を見たいノードの出力を、このノードの `value` につなぎます。型は問いません。
2. ノードの **Run** を押すと、上流だけが実行され、結果がノード上に表示されます。テキストは Copy ボタンでコピーできます。画像はプレビューとして表示されます。
3. 実行中は **Cancel** で止められます。

- このノードには出力がないので、通常の Run（ワークフロー全体の実行）では実行されません。
- `seed_mode` は、Run の前に上流の seed をどうするかを決めます。
  - `randomize`：毎回ランダムな値にする（既定）
  - `follow`：各 seed の control_after_generate の設定に従う
  - `off`：変えない
- 使い方の例：LLM ノードの seed を `fixed` にしておき、Independent Queue の Run で生成し直します。気に入ったら通常の Run を押すと、LLM ノードは同じ seed のままキャッシュが使われ、選んだプロンプトで画像が生成されます。
- 上流にサブグラフがあっても使えます。サブグラフの中の seed も `seed_mode` の対象になります。
- このノード自体は、今のところルートのグラフに置く必要があります（サブグラフの中に置くと Run できません）。

### NF Preview Selector

生成した画像をノード上にグリッドで表示し、選んだ画像だけを下流に流します。選んでいる間もキューは止まりません。

1. `images` に画像をつなぎます。latent も選びたい場合は `latents` もつなぎます。
2. ワークフローを実行するか、ノードの **Generate** を押すと、候補の画像が表示されます。review_and_select モードでは、ここで下流の実行が止まります。
3. 画像をクリックして選びます（複数可）。下部のボタンで全選択・選択解除ができます。
4. **Continue** を押すと、選んだ画像で下流だけが実行されます。上流は実行し直しません。

- `mode`
  - `review_and_select`：選んで Continue するまで下流を止める（既定）
  - `pass_through`：全部をそのまま流す
  - `take_first` / `take_last`：最初または最後の 1 枚を流す
- `seed_mode`：Generate の前に上流の seed をどうするか（Independent Queue と同じ。上流のサブグラフの中の seed も対象）
- Generate と Continue のボタンは、ノードをルートのグラフに置いたときだけ使えます。
- 出力：`selected_images`、`selected_latents`、`selection_indices`（例 `0,2`）
- 画像を右クリックすると、ノードメニューに **Copy Image / Open Image / Save Image** が出ます。Copy Image は https または localhost で開いたときだけ使えます。別の PC から http で開いている場合は、Open Image で開いてからコピーしてください。
- 候補は ComfyUI の temp フォルダに保存されます。ComfyUI を再起動すると消えるので、もう一度 Generate してください。
- 旧ノード（NF_Tools の `NFPreviewSelector2`）を含むワークフローを開くと、エラーパネルの「Replace Node」でこのノードに置き換えられます。

### NF Empty Latent Image

長辺のサイズ・アスペクト比・向きから Empty Latent を作ります。`latent` と、計算した `width` / `height` を出力します。

- `long_side`：長辺のピクセル数
- `aspect_ratio`：1:1、5:4、4:3、3:2、16:9、21:9、4:5、3:4、2:3、9:16
- `orientation`：`auto`（アスペクト比どおり）、`portrait`、`landscape`
- `force_multiple_of_64`：幅と高さを 64 の倍数にそろえる

### NF Preset Empty Latent Image

よく使うサイズ（SD 1.5、SDXL、HD、Full HD、4K、Instagram など）から選んで Empty Latent を作ります。`Custom` を選ぶと、`custom_width` / `custom_height` のサイズを使います。`latent` と、使った `width` / `height` を出力します。

## 開発

フロントエンドのソースは `frontend/src` にあります。変更したら、ビルドして `web/` も一緒にコミットしてください。

```bash
cd frontend
npm install
npm test
npm run build
```

Python のテストは ComfyUI の venv で実行します。

```bash
python -m pytest
```

## サポート

個人で作っているプロジェクトです。Issue や Pull Request は歓迎しますが、返信や取り込みができない場合があります。自分用に変えたい場合は、フォークして自由に改造してください。

## ライセンス

[MIT](LICENSE)
